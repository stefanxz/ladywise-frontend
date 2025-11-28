import { THROMBOSIS_RISK_OPTIONS as OPTIONS } from "@/data/thrombosis-risk-options";
import {
  MultiSelectGroup,
  QuestionScreen,
} from "@/app/onboarding/components/QuestionScreen";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";

export default function QuestionnaireThrombosisRisk() {
  const router = useRouter();
  const { answers, updateAnswers } = useQuestionnaire();
  const [selected, setSelected] = useState<string[]>(
    answers.thrombosisRiskFactors.length ? answers.thrombosisRiskFactors : [],
  );

  const displaySelected = useMemo(() => selected, [selected]);

  const toggleOption = (value: string) => {
    setSelected((prev) => {
      const exists = prev.includes(value);
      if (value === "none") {
        return exists ? [] : ["none"];
      }
      const withoutNone = prev.filter((item) => item !== "none");
      if (exists) {
        return withoutNone.filter((item) => item !== value);
      }
      return [...withoutNone, value];
    });
  };

  const handleContinue = () => {
    const cleaned = displaySelected.includes("none") ? [] : displaySelected;
    updateAnswers({ thrombosisRiskFactors: cleaned });
    router.push("./questionnaire-final-questions");
  };

  const handleSkip = () => {
    updateAnswers({ thrombosisRiskFactors: [] });
    router.push("./questionnaire-final-questions");
  };

  return (
    <QuestionScreen
      step={4}
      title="Health background Thrombosis risk 💧"
      description="Select any conditions that apply to you."
      onSkip={handleSkip}
      footer={
        <ThemedPressable
          label="Continue"
          onPress={handleContinue}
          disabled={selected.length === 0}
        />
      }
    >
      <View>
        <MultiSelectGroup
          question="Options"
          options={OPTIONS}
          selected={displaySelected}
          onToggle={toggleOption}
        />
      </View>
    </QuestionScreen>
  );
}
