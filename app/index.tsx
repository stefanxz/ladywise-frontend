import { Redirect } from "expo-router";

// test comment
export default function RootIndex() {
  const user = null;

  return user ? (
    <Redirect href="/(main)/home" />
  ) : (
    <Redirect href="/(auth)/landing" />
  );
}
