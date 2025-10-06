import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerTitle: "Landing" }} />
      <Stack.Screen
        name="register_page"
        options={{ headerShown: false, headerTitle: "Register" }}
      />
    </Stack>
  );
}
