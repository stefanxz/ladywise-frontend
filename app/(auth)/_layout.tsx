import { Stack, Redirect, usePathname } from "expo-router";
import { useAuth } from "@/context/AuthContext";

/**
 * AuthLayout
 *
 * Layout component for the authentication flow.
 * Handles redirection if the user is already authenticated
 * and not in the registration flow.
 *
 * @returns {JSX.Element | null} The rendered layout or null/redirect
 */
export default function AuthLayout() {
  const { token, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) return null;

  // Don’t auto-redirect to home if we’re in the register flow
  const inRegisterFlow = pathname?.startsWith("/register");
  if (token && !inRegisterFlow) {
    return <Redirect href="/(main)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
      {/* keep register stack under (auth)/register so it’s covered by this layout */}
    </Stack>
  );
}
