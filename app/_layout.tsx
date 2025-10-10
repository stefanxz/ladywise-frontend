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
  }); // fontsLoaded is updated automatically (similar to calling useState()) once the fonts are loaded

  const [appReadyStatus, setAppReadyStatus] = useState(false); // hook to handle state of the status of the app

  useEffect(() => {
    async function prepare() {
      try {
        // Take control of the splash screen
        await SplashScreen.preventAutoHideAsync();

        // If the fontsLoaded is true (boolean auto updated once the useFonts() hook finished execution), then we can fetch user data
        if (fontsLoaded) {
          const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));
          await delay(3000); // PLACEHOLDER timer to mimic what happens when the app first fetches user data. The fetching data is to be implemented this
        }
      } catch (e) {
        console.error(
          "Encountered Error at Application Setup during Splash Screen handling: ",
          e
        ); // Basic error handling
      } finally {
        if (fontsLoaded) {
          // Current logic permits fontsLoaded to be set to true only once the app setup is complete (explained below)
          setAppReadyStatus(true);
        }
      }
    }
    prepare();
  }, [fontsLoaded]); // Changes on fontsLoaded since the useEffect() hook always executes before loading fonts (when RootLayout is mounted), meaning that this hook will execute twice

  useEffect(() => {
    if (appReadyStatus) {
      // Hide the splash screen once the app is ready
      SplashScreen.hideAsync();
    }
  }, [appReadyStatus]); // Also executes once

  // Do not return anything if the app is not ready; currently looks bad bacuse of the delay, real delay would be 10x smaller, unovservable by human eye
  if (!appReadyStatus) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
