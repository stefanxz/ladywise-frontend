import { getAuthData, isValidAuthData } from "@/lib/auth";
import "@assets/styles/main.css";
import { Aclonica_400Regular } from "@expo-google-fonts/aclonica";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Aclonica_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  const [authReady, setDataReady] = useState(false);

  // Effect for fetching data on component mount
  useEffect(() => {
    async function prepareData() {
      try {
        const authData = await getAuthData();
        if (isValidAuthData(authData)) {
          // User is logged in
          router.replace("/(main)/home");
        } else {
          // User is not logged in
          router.replace("/(auth)/landing");
        }
      } catch (e) {
        console.warn("Failed to check auth token", e);
        router.replace("/(auth)/landing");
      } finally {
        setDataReady(true);
      }
    }

  prepareData();
  }, [router]);

  // Hide the splash screen only when fonts AND data are ready
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && authReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authReady]);

  if (!fontsLoaded || !authReady) {
    return null;
  }

  // Render the app layout inside a View with the onLayout prop.
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
