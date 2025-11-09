import "@/assets/styles/main.css";
import { getAuthData, isTokenValid } from "@/lib/auth";
import { Aclonica_400Regular } from "@expo-google-fonts/aclonica";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Slot, SplashScreen } from "expo-router";
import { createContext, useEffect, useMemo, useState } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Represents the UI-facing session lifecycle (distinct from raw token status).
type SessionStatus = "loading" | "signedIn" | "signedOut";
type AuthContextValue = {
  status: SessionStatus;
  setStatus: (status: SessionStatus) => void;
};

export const AuthContext = createContext<AuthContextValue>({
  status: "loading",
  setStatus: () => undefined,
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Aclonica_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  const [status, setStatus] = useState<SessionStatus>("loading");

  // Bootstrap: resolve auth once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const authData = await getAuthData();
        const ok = isTokenValid(authData) === "VALID";
        if (!cancelled) setStatus(ok ? "signedIn" : "signedOut");
      } catch {
        if (!cancelled) setStatus("signedOut");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hide splash when ready
  useEffect(() => {
    if (fontsLoaded && status !== "loading") {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, status]);

  const value = useMemo(() => ({ status, setStatus }), [status]);

  if (!fontsLoaded || status === "loading") {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      <Slot />
    </AuthContext.Provider>
  );
}
