import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="landing" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" options={{ headerTitle: "Landing" }} />
      <Stack.Screen
        name="register"
        options={{ headerShown: false, headerTitle: "Register" }}
      />
    </Stack>
  );
}
