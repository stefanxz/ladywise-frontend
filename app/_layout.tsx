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
        // Take contro
        await SplashScreen.preventAutoHideAsync();
        const delay = (ms: number) => {
          new Promise((resolve) => setTimeout(resolve, ms));
        };
        await delay(3000);
      } catch (e) {
        console.log(e);
      } finally {
        setAppReadyStatus(true);
      }
    }
  });

  if (!appReadyStatus) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
