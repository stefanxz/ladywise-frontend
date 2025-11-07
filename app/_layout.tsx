import "@/assets/styles/main.css";
import { Aclonica_400Regular } from "@expo-google-fonts/aclonica";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // State #1: Fonts
  const [fontsLoaded] = useFonts({
    Aclonica_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  // State #2: Data Fetching
  const [dataReady, setDataReady] = useState(false);

  // Effect for fetching data on component mount
  useEffect(() => {
    async function prepareData() {
      try {
        // This is where we will put the actual data fetching logic
        // The promise is a placeholder for that async work.
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate a 1.5s fetch
      } catch (e) {
        // You can handle data fetching errors here
        console.warn("Failed to fetch app data", e);
      } finally {
        // Mark the data as ready
        setDataReady(true);
      }
    }

    prepareData();
  }, []); // The empty dependency array ensures this runs only once.

  // Hide the splash screen only when fonts AND data are ready
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && dataReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dataReady]);

  // Do not render the main app until all assets are loaded
  if (!fontsLoaded || !dataReady) {
    return null;
  }

  // Render the app layout inside a View with the onLayout prop.
  return (
    <GestureHandlerRootView className="flex-1" onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
