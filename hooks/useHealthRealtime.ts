import { useEffect, useState, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { TextEncoder } from "text-encoding";
import { RiskResult, InsightResult } from "@/lib/types/risks";

// Polyfill for TextEncoder
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

/**
 * useHealthRealtime
 *
 * Custom hook to manage real-time health data connections via WebSocket (STOMP).
 * Subscribes to risk updates and trend insights for the specific user.
 *
 * @param {string | null} userId - The ID of the authenticated user
 * @param {string | null} token - Authentication token
 * @returns {Object} Real-time health data and connection status
 */
export const useHealthRealtime = (
  userId: string | null,
  token: string | null,
) => {
  // Using independent state atoms to avoid object merging conflicts
  const [realtimeRisks, setRealtimeRisks] = useState<RiskResult | null>(null);
  const [anemiaTrend, setAnemiaTrend] = useState<InsightResult | null>(null);
  const [thrombosisTrend, setThrombosisTrend] = useState<InsightResult | null>(
    null,
  );
  const [isConnected, setIsConnected] = useState(false);

  const clientRef = useRef<Client | null>(null);

  // DEBUG: Monitor State Updates
  useEffect(() => {
    if (realtimeRisks)
      console.log("🔄 Hook State Updated: RISKS", realtimeRisks.anemia.risk);
  }, [realtimeRisks]);

  useEffect(() => {
    if (anemiaTrend)
      console.log("🔄 Hook State Updated: ANEMIA TREND", anemiaTrend.trend);
  }, [anemiaTrend]);

  useEffect(() => {
    if (thrombosisTrend)
      console.log(
        "🔄 Hook State Updated: THROMBOSIS TREND",
        thrombosisTrend.trend,
      );
  }, [thrombosisTrend]);

  useEffect(() => {
    if (!userId || !token) return;

    const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");
    const socketUrl = `${cleanBaseUrl}/sockjs`;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(socketUrl, null, {
          transports: ["xhr-streaming", "xhr-polling"],
        }),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        // Filter out heartbeat noise
        if (!str.includes("PING") && !str.includes("PONG")) {
          console.log("[STOMP Internal]:", str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log(`✅ Connected to Health Stream at ${socketUrl}`);
      setIsConnected(true);

      // Risk Subscription
      client.subscribe(`/topic/risks/${userId}`, (message: IMessage) => {
        if (message.body) {
          const parsed = JSON.parse(message.body);
          console.log("📥 STOMP Packet Received: RISKS", parsed);
          // Functional update guarantees we don't use stale closures
          setRealtimeRisks(() => parsed);
        }
      });

      // Anemia Trend Subscription
      client.subscribe(
        `/topic/insights/anemia/${userId}`,
        (message: IMessage) => {
          if (message.body) {
            const parsed = JSON.parse(message.body);
            console.log("📥 STOMP Packet Received: ANEMIA TREND", parsed);
            setAnemiaTrend(() => parsed);
          }
        },
      );

      // Thrombosis Trend Subscription
      client.subscribe(
        `/topic/insights/thrombosis/${userId}`,
        (message: IMessage) => {
          if (message.body) {
            const parsed = JSON.parse(message.body);
            console.log("📥 STOMP Packet Received: THROMBOSIS TREND", parsed);
            setThrombosisTrend(() => parsed);
          }
        },
      );
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP Broker Error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
      setIsConnected(false);
    };
  }, [userId, token]);

  return {
    realtimeRisks,
    anemiaTrend,
    thrombosisTrend,
    isConnected,
  };
};
