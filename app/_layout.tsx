import "@/assets/styles/main.css";
import { Aclonica_400Regular } from "@expo-google-fonts/aclonica";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

export default function RootLayout() {
  // Loads custom fonts
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Aclonica_400Regular,
  });

  const [appReadyStatus, setAppReadyStatus] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Take control of the splash screen
        await SplashScreen.preventAutoHideAsync();

        // If the fontsLoaded is true (boolean auto updated once the useFonts() hook finished execution)
        if (fontsLoaded) {
          const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));
          await delay(3000);
        }
      } catch (e) {
        console.log(e);
      } finally {
        if (fontsLoaded) {
          setAppReadyStatus(true);
        }
      }
    }
    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (appReadyStatus) {
      // Hide the splash screen once the app is ready
      SplashScreen.hideAsync();
    }
  }, [appReadyStatus]);

  if (!appReadyStatus) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
