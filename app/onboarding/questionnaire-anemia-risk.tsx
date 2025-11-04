import {
  MultiSelectGroup,
  QuestionScreen,
} from "@/app/onboarding/components";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

const OPTIONS = [
  { id: "iron-deficiency", label: "Iron deficiency" },
  { id: "heavy-menstrual-bleeding", label: "Heavy menstrual bleeding" },
  { id: "chronic-illness", label: "Chronic illness (e.g., kidney disease)" },
  { id: "vitamin-deficiency", label: "Vitamin deficiency" },
  { id: "genetic-blood-disorders", label: "Genetic blood disorders" },
  { id: "none", label: "None of the above" },
];

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
    router.push("/onboarding/questionnaire-thrombosis-risk");
  };

  return (
    <QuestionScreen
      step={3}
      title="Health background Anemia risk"
      description="Select any conditions that apply to you."
      onSkip={() => router.push("/landing")}
      footer={<ThemedPressable label="Continue" onPress={handleContinue} />}
    >
      <MultiSelectGroup
        question="Options"
        options={OPTIONS}
        selected={displaySelected}
        onToggle={toggleOption}
      />
    </QuestionScreen>
  );
}
