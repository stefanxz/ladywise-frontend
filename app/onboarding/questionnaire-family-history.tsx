import {
  BinaryChoiceGroup,
  QuestionScreen,
} from "@/app/onboarding/components/QuestionScreen";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

/**
 * Onboarding: Family Health History Section
 *
 * This step of the questionnaire focuses on capturing potential genetic
 * predispositions to anemia and thrombosis. By identifying conditions that
 * run in the user's family, the application can provide more nuanced risk
 * assessments and personalized health advice.
 *
 * Users can either specify their history or skip this section if they are
 * unsure or prefer not to disclose.
 */
export default function QuestionnaireFamilyHistory() {
  const router = useRouter();
  const { answers, updateAnswers } = useQuestionnaire();
  const [familyAnemia, setFamilyAnemia] = useState(
    answers.familyHistory.anemia,
  );
  const [familyThrombosis, setFamilyThrombosis] = useState(
    answers.familyHistory.thrombosis,
  );

  const handleContinue = () => {
    updateAnswers({
      familyHistory: {
        anemia: familyAnemia,
        thrombosis: familyThrombosis,
      },
    });
    router.push("./questionnaire-anemia-risk");
  };

  const handleSkip = () => {
    updateAnswers({
      familyHistory: {
        anemia: null,
        thrombosis: null,
      },
    });
    router.push("./questionnaire-anemia-risk");
  };

  return (
    <QuestionScreen
      step={2}
      title="Family health matters 🌿"
      description="Do you have any family history of the following conditions?"
      onSkip={handleSkip}
      footer={
        <ThemedPressable
          label="Continue"
          onPress={handleContinue}
          disabled={familyAnemia === null && familyThrombosis === null}
        />
      }
    >
      <View>
        <BinaryChoiceGroup
          question="Anemia"
          value={familyAnemia}
          onChange={(value) => {
            setFamilyAnemia(value);
          }}
          testIDPrefix="family-anemia"
        />
      </View>

      <View className="mt-4">
        <BinaryChoiceGroup
          question="Thrombosis"
          value={familyThrombosis}
          onChange={(value) => {
            setFamilyThrombosis(value);
          }}
          testIDPrefix="family-thrombosis"
        />
      </View>
    </QuestionScreen>
  );
}
