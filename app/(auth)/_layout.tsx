import { Stack, Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../_layout"; // adjust relative path if needed

export default function AuthLayout() {
  const { status } = useContext(AuthContext);

  if (status === "signedIn") {
    return <Redirect href="/(main)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
