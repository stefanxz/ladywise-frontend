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

type AuthStatus = "loading" | "signedIn" | "signedOut";
export const AuthContext = createContext<{ status: AuthStatus }>({
  status: "loading",
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Aclonica_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  const [status, setStatus] = useState<AuthStatus>("loading");

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

  const value = useMemo(() => ({ status }), [status]);

  if (!fontsLoaded || status === "loading") {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      <Slot />
    </AuthContext.Provider>
  );
}
