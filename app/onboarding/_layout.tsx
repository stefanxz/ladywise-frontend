import { QuestionnaireProvider } from "@/app/onboarding/QuestionnaireContext";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <QuestionnaireProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="questionnaire"
          options={{ title: "Questionnaire" }}
        />
        <Stack.Screen
          name="questionnaire-intro"
          options={{ title: "Questionnaire Intro" }}
        />
        <Stack.Screen
          name="questionnaire-family-history"
          options={{ title: "Family History" }}
        />
        <Stack.Screen
          name="questionnaire-anemia-risk"
          options={{ title: "Anemia Risk" }}
        />
        <Stack.Screen
          name="questionnaire-thrombosis-risk"
          options={{ title: "Thrombosis Risk" }}
        />
        <Stack.Screen
          name="questionnaire-final-questions"
          options={{ title: "Final Questions" }}
        />
        <Stack.Screen
          name="questionnaire-complete"
          options={{ title: "Questionnaire Complete" }}
        />
      </Stack>
    </QuestionnaireProvider>
  );
}
