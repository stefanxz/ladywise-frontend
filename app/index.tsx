import { Redirect, useRootNavigationState } from "expo-router";
import { useAuth } from "@/context/AuthContext";

/**
 * RootIndex
 *
 * The entry point route ("/") of the application.
 * Redirects the user to the home screen if authenticated, or the landing page if not.
 *
 * @returns {JSX.Element | null} The redirect component or null
 */
export default function RootIndex() {
  const nav = useRootNavigationState();
  const { token, isLoading } = useAuth();

  if (!nav?.key || isLoading) {
    return null;
  }

  return token && !isLoading ? (
    <Redirect href="/(main)/home" />
  ) : (
    <Redirect href="/(auth)/landing" />
  );
}
