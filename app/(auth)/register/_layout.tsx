import { Stack } from "expo-router";

export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Register" }} />
      <Stack.Screen
        name="personal-details"
        options={{ title: "Personal Details" }}
      />
    </Stack>
  );
}
