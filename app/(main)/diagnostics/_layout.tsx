import { Stack } from "expo-router";

/**
 * DiagnosticsLayout
 * 
 * Layout wrapper for the diagnostics section.
 * Defines the stack navigator for the diagnostics index and details screens.
 * 
 * @returns {JSX.Element} The rendered layout
 */
export default function DiagnosticsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[risk_factor]" />
    </Stack>
  );
}
