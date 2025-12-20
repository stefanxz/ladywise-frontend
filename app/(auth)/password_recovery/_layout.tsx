import { Stack } from "expo-router";

/**
 * PasswordRecoveryLayout
 * 
 * Layout wrapper for the password recovery flow screens.
 * Defines the stack navigator and common options for recovery steps.
 * 
 * @returns {JSX.Element} The rendered layout
 */
export default function PasswordRecoveryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Password Recovery" }} />
      <Stack.Screen
        name="reset-password"
        options={{ title: "Password Recovery" }}
      />
      <Stack.Screen name="mail-sent-info" options={{ title: "Mail Sent" }} />
    </Stack>
  );
}
