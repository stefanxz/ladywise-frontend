import {
  MultiSelectGroup,
  QuestionScreen,
} from "@/app/onboarding/components";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native"; // Import Text and View

const OPTIONS = [
  { id: "smoking", label: "Smoking" },
  { id: "obesity", label: "Obesity" },
  { id: "immobility", label: "Prolonged immobility" },
  { id: "pregnancy-postpartum", label: "Pregnancy or postpartum" },
  { id: "hormonal-therapy", label: "Hormonal therapy" },
  { id: "inherited-clotting", label: "Inherited clotting disorder" },
  { id: "none", label: "None of the above" },
];

export default function QuestionnaireThrombosisRisk() {
  const router = useRouter();
  const { answers, updateAnswers } = useQuestionnaire();
  const [selected, setSelected] = useState<string[]>(
    answers.thrombosisRiskFactors.length
      ? answers.thrombosisRiskFactors
      : [],
  );

  // Error State
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    if (selected.length === 0) {
      setError("Please select at least one option.");
      return; // Stop if there is an error
    }

    const cleaned = displaySelected.includes("none") ? [] : displaySelected;
    updateAnswers({ thrombosisRiskFactors: cleaned });
    router.push("/onboarding/questionnaire-final-questions");
  };

  return (
    <QuestionScreen
      step={4}
      title="Health background Thrombosis risk 💧"
      description="Select any conditions that apply to you."
      onSkip={() => router.push("/landing")}
      footer={<ThemedPressable label="Continue" onPress={handleContinue} />}
    >
      <View>
        <MultiSelectGroup
          question="Options"
          options={OPTIONS}
          selected={displaySelected}
          onToggle={(value) => {
            toggleOption(value);
            if (error) setError(null); // Clear error on change
          }}
        />
        {/* Error message display */}
        {error ? (
          <Text className="text-red-600 text-xs mt-1 ml-2">{error}</Text>
        ) : null}
      </View>
    </QuestionScreen>
  );
}