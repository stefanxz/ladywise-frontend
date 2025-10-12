import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
    </Stack>
  );
}
