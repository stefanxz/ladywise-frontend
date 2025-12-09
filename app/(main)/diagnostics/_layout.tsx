import { Stack } from "expo-router";

export default function DiagnosticsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[risk_factor]" />
    </Stack>
  );
}
