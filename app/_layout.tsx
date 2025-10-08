import { Stack } from "expo-router";
import "@/assets/styles/main.css";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
