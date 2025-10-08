import { Stack } from "expo-router";
import "@/assets/styles/main.css";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { Aclonica_400Regular } from "@expo-google-fonts/aclonica";

export default function RootLayout() {
  // Loads custom fonts
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Aclonica_400Regular,
  });

  return <Stack screenOptions={{ headerShown: false }} />;
}
