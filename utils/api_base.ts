// src/utils/apiBase.ts
import Constants from "expo-constants";
import { Platform } from "react-native";

const isWeb =
  typeof window !== "undefined" && typeof document !== "undefined";

function hostFromExpoDev(): string | null {
  // SDK 49+ (modern)
  const hostUri =
    Constants.expoConfig?.hostUri
    // Legacy fields for older SDKs / fallback:
    ?? (Constants as any)?.manifest?.debuggerHost
    ?? (Constants as any)?.manifest?.hostUri;

  // Examples:
  //  - "192.168.1.23:19000"
  //  - "localhost:19000"
  //  - sometimes "http://192.168.1.23:19000" (rare)
  if (!hostUri) return null;

  const cleaned = hostUri.replace(/^https?:\/\//, "");
  const host = cleaned.split(":")[0];

  console.log(`The host IP calculated from expoConfig is ${host}`)

  // On physical Android devices, "localhost" would point to the PHONE.
  if ((host === "localhost" || host === "127.0.0.1") && Platform.OS === "android") {
    return null;
  }
  return host;
}

export function resolveApiBaseUrl(port = 8080): string {
  // 1) Explicit override wins
  const env = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (env) return env.replace(/\/$/, "");

  // 2) Web (browser) → use the page's host
  if (isWeb) {
    const host = window.location.hostname;
    return `http://${host}:${port}`;
    // If your web page is served over HTTPS and you have HTTPS API locally,
    // switch to https:// here.
  }

  // 3) Native (Expo Go / dev client) → infer from Expo Constants
  const expoHost = hostFromExpoDev();
  if (expoHost) return `http://${expoHost}:${port}`;

  // 4) Last-resort fallbacks
  if (Platform.OS === "android") return "http://10.0.2.2:8080"; // Android emulator
  return "http://localhost:8080"; // iOS simulator or unknown
}
