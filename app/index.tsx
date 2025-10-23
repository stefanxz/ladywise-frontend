import { Redirect, useRootNavigationState } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/app/_layout";

export default function RootIndex() {
  const nav = useRootNavigationState();
  const { status } = useContext(AuthContext);

  if (!nav?.key || status === "loading") {
    return null;
  }

  return status === "signedIn" ? (
    <Redirect href="/(main)/home" />
  ) : (
    <Redirect href="/(auth)/landing" />
  );
}
