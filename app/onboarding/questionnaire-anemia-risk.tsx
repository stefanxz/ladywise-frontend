import {
  QUESTIONNAIRE_TOTAL_STEPS,
  useQuestionnaire,
} from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { cn } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handleSkip = () => {
    router.push("/landing");
  };

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

  const displaySelected = useMemo(() => selected, [selected]);

  const handleContinue = () => {
    const cleaned =
      displaySelected.includes("none") && displaySelected.length > 1
        ? ["none"]
        : displaySelected;
    updateAnswers({
      anemiaRiskFactors:
        cleaned.includes("none") && cleaned.length === 1 ? [] : cleaned,
    });
    router.push("/onboarding/questionnaire-thrombosis-risk");
  };

  return (
    <SafeAreaView className="flex-1 bg-background items-center">
      <View className="w-full max-w-md mt-2 px-10 pt-[71px]">
        <View className="flex-row items-center">
          <View className="flex-1">
            <ProgressBar currentStep={3} totalSteps={QUESTIONNAIRE_TOTAL_STEPS} />
          </View>
          <View className="w-1/6">
            <Pressable onPress={handleSkip}>
              <Text
                className="text-inter-regular text-right text-lightGrey"
                style={{
                  paddingRight: Platform.OS === "android" ? 3 : 0,
                }}
              >
                Skip
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

  <View className="w-full max-w-md items-start mt-2 gap-y-3 px-10 pt-[71px]">
        <Text className="text-3xl font-inter-semibold text-brand text-left">
          Health background Anemia risk 🩸
        </Text>

        <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">
          Select any conditions that apply to you.
        </Text>

        <View className="w-full mt-8 gap-y-3">
          {OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => toggleOption(option.id)}
              className={cn(
                "w-full rounded-2xl border border-transparent px-4 py-3",
                displaySelected.includes(option.id)
                  ? "bg-brand/10 border-brand"
                  : "bg-white",
              )}
            >
              <Text
                className={cn(
                  "text-inter-semibold text-left",
                  displaySelected.includes(option.id)
                    ? "text-brand"
                    : "text-regularText",
                )}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="w-full mt-10">
          <ThemedPressable label="Continue" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
}
