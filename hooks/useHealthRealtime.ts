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
 * Custom hook to manage real-time health data connections via WebSocket (STOMP).
 * Subscribes to risk updates and trend insights for the specific user.
 *
 * @param userId - The ID of the authenticated user.
 * @param token - Authentication token.
 * @returns An object containing real-time risk data, trends, and connection status.
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

    // Initialize STOMP client over SockJS
    // This allows for bi-directional real-time communication with the Spring Boot backend
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
      // Listens for real-time updates to the user's calculated risk scores
      client.subscribe(`/topic/risks/${userId}`, (message: IMessage) => {
        if (message.body) {
          const parsed = JSON.parse(message.body);
          console.log("📥 STOMP Packet Received: RISKS", parsed);
          // Functional update guarantees we don't use stale closures
          setRealtimeRisks(() => parsed);
        }
      });

      // Anemia Trend Subscription
      // Receives AI-driven insights regarding anemia progression
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
      // Receives AI-driven insights regarding thrombosis progression
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
