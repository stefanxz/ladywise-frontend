import { Redirect, useRootNavigationState } from "expo-router";
import { useContext } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RootIndex() {
  const nav = useRootNavigationState();
  const { token, isLoading } = useAuth();

  if (!nav?.key || isLoading) {
    return null;
  }

  return token ? (
    <Redirect href="/(main)/home" />
  ) : (
    <Redirect href="/(auth)/landing" />
  );
}
