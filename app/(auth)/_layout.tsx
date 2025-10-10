import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="landing" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" options={{ headerTitle: "Landing" }} />
      <Stack.Screen
        name="register1"
        options={{ headerShown: false, headerTitle: "Register" }}
      />
      <Stack.Screen
        name="register2"
        options={{ headerShown: false, headerTitle: "Register" }}
      />
      <Stack.Screen
        name="register3"
        options={{ headerShown: false, headerTitle: "Register" }}
      />
    </Stack>
  );
}
