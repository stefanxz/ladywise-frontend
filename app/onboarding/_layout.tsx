import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="questionnaire" options={{ title: "Questionnaire" }} />
      <Stack.Screen
        name="questionnaire-intro"
        options={{ title: "Questionnaire Intro" }}
      />
    </Stack>
  );
}
