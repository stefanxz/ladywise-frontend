import { Stack } from "expo-router";

/**
 * SettingsLayout
 *
 * Layout wrapper for the settings section.
 * Defines the stack navigator for various settings sub-screens (account, profile, etc.).
 *
 * @returns {JSX.Element} The rendered settings layout
 */
export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="account" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="questions" />
    </Stack>
  );
}
