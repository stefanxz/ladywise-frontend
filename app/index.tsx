import { Redirect } from "expo-router";

export default function RootIndex() {
  const user = null;

  return user ? (
    <Redirect href="/(main)/home" />
  ) : (
    <Redirect href="/(auth)/landing" />
  );
}
