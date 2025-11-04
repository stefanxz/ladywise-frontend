import { BinaryChoiceGroup, QuestionScreen } from "@/app/onboarding/components";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function QuestionnaireFamilyHistory() {
  const router = useRouter();
  const { answers, updateAnswers } = useQuestionnaire();
  const [familyAnemia, setFamilyAnemia] = useState(answers.familyHistory.anemia);
  const [familyThrombosis, setFamilyThrombosis] = useState(
    answers.familyHistory.thrombosis,
  );

  const handleContinue = () => {
    if (familyAnemia === null || familyThrombosis === null) return;
    updateAnswers({
      familyHistory: {
        anemia: familyAnemia,
        thrombosis: familyThrombosis,
      },
    });
    router.push("/onboarding/questionnaire-anemia-risk");
  };

  return (
    <QuestionScreen
      step={2}
      title="Family health matters"
      description="Do you have any family history of the following conditions?"
      onSkip={() => router.push("/landing")}
      footer={
        <ThemedPressable
          label="Continue"
          onPress={handleContinue}
          disabled={familyAnemia === null || familyThrombosis === null}
        />
      }
    >
      <BinaryChoiceGroup
        question="Anemia"
        value={familyAnemia}
        onChange={setFamilyAnemia}
        testIDPrefix="family-anemia"
      />
      <BinaryChoiceGroup
        question="Thrombosis"
        value={familyThrombosis}
        onChange={setFamilyThrombosis}
        testIDPrefix="family-thrombosis"
      />
    </QuestionScreen>
  );
}
