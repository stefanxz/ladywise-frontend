import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { TextEncoder } from 'text-encoding';
import { RiskResult, InsightResult } from '@/lib/types/risks';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

export const useHealthRealtime = (userId: string | null, token: string | null) => {
  const [realtimeRisks, setRealtimeRisks] = useState<RiskResult | null>(null);
  const [anemiaTrend, setAnemiaTrend] = useState<InsightResult | null>(null);
  const [thrombosisTrend, setThrombosisTrend] = useState<InsightResult | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId || !token) return;

    // 1. Dynamic Configuration from Env
    // Fallback to localhost if env var is missing, though your .env should provide it.
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
    
    // Strip trailing slash if present to avoid double-slashing (e.g. "http://.../" -> "http://...")
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const socketUrl = `${cleanBaseUrl}/sockjs`;

    // 2. SockJS Factory
    const sockFactory = () => new SockJS(socketUrl, null, {
        transports: ['xhr-streaming', 'xhr-polling']
    });

    const client = new Client({
      webSocketFactory: sockFactory,
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log('[STOMP]:', str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log(`✅ Connected to Health Stream at ${socketUrl}`);
      setIsConnected(true);

      client.subscribe(`/topic/risks/${userId}`, (message) => {
        if (message.body) {
          console.log("⚡️ Risk Update Received");
          setRealtimeRisks(JSON.parse(message.body));
        }
      });

      client.subscribe(`/topic/insights/anemia/${userId}`, (message) => {
        if (message.body) {
          setAnemiaTrend(JSON.parse(message.body));
        }
      });

      client.subscribe(`/topic/insights/thrombosis/${userId}`, (message) => {
        if (message.body) {
          setThrombosisTrend(JSON.parse(message.body));
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('❌ STOMP Broker Error:', frame.headers['message']);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [userId, token]);

  return { realtimeRisks, anemiaTrend, thrombosisTrend, isConnected };
};