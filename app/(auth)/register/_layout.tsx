import { Stack } from "expo-router";

/**
 * RegisterLayout
 * 
 * Layout wrapper for the registration flow screens.
 * Defines the stack navigator and common options for registration steps.
 * 
 * @returns {JSX.Element} The rendered layout
 */
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
