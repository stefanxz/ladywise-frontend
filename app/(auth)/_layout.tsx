import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (token) {
    return <Redirect href="/(main)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
