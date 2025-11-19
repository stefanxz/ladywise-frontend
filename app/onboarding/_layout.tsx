import { useAuth } from "@/context/AuthContext";
import {
  QuestionnaireProvider,
  useQuestionnaire,
} from "@/app/onboarding/QuestionnaireContext";
import { Stack } from "expo-router";
import { useEffect } from "react";

function QuestionnaireWrapper({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const { setUserId } = useQuestionnaire();

  useEffect(() => {
    setUserId(userId);
  }, [userId, setUserId]);

  return <>{children}</>;
}

export default function OnboardingLayout() {
  return (
    <QuestionnaireProvider>
      <QuestionnaireWrapper>
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
            name="questionnaire-personal-details"
            options={{ title: "Personal Details" }}
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
      </QuestionnaireWrapper>
    </QuestionnaireProvider>
  );
}