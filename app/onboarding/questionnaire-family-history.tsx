import { BinaryChoiceGroup, QuestionScreen } from "@/app/onboarding/components";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function QuestionnaireFamilyHistory() {
  const router = useRouter();
  const { answers, updateAnswers } = useQuestionnaire();
  const [familyAnemia, setFamilyAnemia] = useState(answers.familyHistory.anemia);
  const [familyThrombosis, setFamilyThrombosis] = useState(
    answers.familyHistory.thrombosis,
  );

  // Error States
  const [anemiaError, setAnemiaError] = useState<string | null>(null);
  const [thrombosisError, setThrombosisError] = useState<string | null>(null);

  const handleContinue = () => {
    setAnemiaError(null);
    setThrombosisError(null);

    let hasError = false;

    if (familyAnemia === null) {
      setAnemiaError("Please select an answer for Anemia.");
      hasError = true;
    }

    if (familyThrombosis === null) {
      setThrombosisError("Please select an answer for Thrombosis.");
      hasError = true;
    }

    if (hasError) return;

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
      title="Family health matters 🌿"
      description="Do you have any family history of the following conditions?"
      onSkip={() => router.push("/landing")}
      footer={
        <ThemedPressable
          label="Continue"
          onPress={handleContinue}
        />
      }
    >
      <View>
        <BinaryChoiceGroup
          question="Anemia"
          value={familyAnemia}
          onChange={(value) => {
            setFamilyAnemia(value);
            if (anemiaError) setAnemiaError(null);
          }}
          testIDPrefix="family-anemia"
        />
        {anemiaError ? (
          <Text className="text-red-600 text-xs mt-1 ml-2">{anemiaError}</Text>
        ) : null}
      </View>

      <View className="mt-4">
        <BinaryChoiceGroup
          question="Thrombosis"
          value={familyThrombosis}
          onChange={(value) => {
            setFamilyThrombosis(value);
            if (thrombosisError) setThrombosisError(null);
          }}
          testIDPrefix="family-thrombosis"
        />
        {thrombosisError ? (
          <Text className="text-red-600 text-xs mt-1 ml-2">{thrombosisError}</Text>
        ) : null}
      </View>
    </QuestionScreen>
  );
}