import { ANEMIA_RISK_OPTIONS as OPTIONS } from "@/data/anemia-risk-options";
import {
  MultiSelectGroup,
  QuestionScreen,
} from "@/app/onboarding/components/QuestionScreen";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";

/**
 * Onboarding: Anemia Risk Assessment
 *
 * This screen presents users with a multi-selection list of known clinical
 * risk factors for anemia. It allows for a granular assessment of their health
 * context, which directly informs the diagnostic insights displayed on their
 * main dashboard.
 *
 * The selection logic ensures that choosing "None" correctly resets other
 * selections to maintain data accuracy.
 */
export default function QuestionnaireAnemiaRisk() {
  const router = useRouter();
  const { answers, updateAnswers } = useQuestionnaire();
  const [selected, setSelected] = useState<string[]>(
    answers.anemiaRiskFactors.length ? answers.anemiaRiskFactors : [],
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
    updateAnswers({
      anemiaRiskFactors: cleaned,
    });
    router.push("./questionnaire-thrombosis-risk");
  };

  const handleSkip = () => {
    updateAnswers({
      anemiaRiskFactors: [],
    });
    router.push("./questionnaire-thrombosis-risk");
  };

  return (
    <QuestionScreen
      step={3}
      title="Health background Anemia risk 🩸"
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
