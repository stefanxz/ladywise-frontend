import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="landing" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" options={{ headerTitle: "Landing" }} />
      <Stack.Screen
        name="index"
        options={{ headerShown: false, headerTitle: "Register" }}
      />
      <Stack.Screen
        name="personal-details"
        options={{ headerShown: false, headerTitle: "Register" }}
      />
      <Stack.Screen
        name="questionnaire-intro"
        options={{ headerShown: false, headerTitle: "Register" }}
      />
    </Stack>
  );
}
