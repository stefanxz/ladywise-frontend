import "@/assets/styles/main.css";
import { Aclonica_400Regular } from "@expo-google-fonts/aclonica";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
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
    async function placeholder() {
      setTimeout(10000);
    }
  }, []);

  if (appReadyStatus) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }
}
