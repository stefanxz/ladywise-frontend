import { Stack } from "expo-router";

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
