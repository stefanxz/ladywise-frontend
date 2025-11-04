import { QUESTIONNAIRE_TOTAL_STEPS, useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { cn } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionnaireFamilyHistory() {
  const router = useRouter();
  const { answers, updateAnswers } = useQuestionnaire();
  const [familyAnemia, setFamilyAnemia] = useState(answers.familyHistory.anemia);
  const [familyThrombosis, setFamilyThrombosis] = useState(
    answers.familyHistory.thrombosis,
  );

  const handleSkip = () => {
    router.push("/landing");
  };

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

  const renderBinaryOption = (
    label: string,
    value: boolean,
    selected: boolean | null,
    onSelect: (val: boolean) => void,
  ) => (
    <Pressable
      key={`${label}-${value}`}
      onPress={() => onSelect(value)}
      className={cn(
        "w-full rounded-2xl border border-transparent px-4 py-3",
        selected === value ? "bg-brand/10 border-brand" : "bg-white",
      )}
    >
      <Text
        className={cn(
          "text-inter-semibold text-left",
          selected === value ? "text-brand" : "text-regularText",
        )}
      >
        {value ? "Yes" : "No"}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-background items-center">
      <View className="w-full max-w-md mt-2 px-10 pt-[71px]">
        <View className="flex-row items-center">
          <View className="flex-1">
            <ProgressBar currentStep={2} totalSteps={QUESTIONNAIRE_TOTAL_STEPS} />
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
          Family health matters 🌿
        </Text>

        <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">
          Do you have any family history of the following conditions?
        </Text>

        <View className="w-full mt-8 gap-y-6">
          <View className="gap-y-3">
            <Text className="text-inter-semibold text-regularText">Anemia</Text>
            <View className="gap-y-2">
              {renderBinaryOption("anemia-yes", true, familyAnemia, setFamilyAnemia)}
              {renderBinaryOption("anemia-no", false, familyAnemia, setFamilyAnemia)}
            </View>
          </View>

          <View className="gap-y-3">
            <Text className="text-inter-semibold text-regularText">
              Thrombosis
            </Text>
            <View className="gap-y-2">
              {renderBinaryOption(
                "thrombosis-yes",
                true,
                familyThrombosis,
                setFamilyThrombosis,
              )}
              {renderBinaryOption(
                "thrombosis-no",
                false,
                familyThrombosis,
                setFamilyThrombosis,
              )}
            </View>
          </View>
        </View>

        <View className="w-full mt-10">
          <ThemedPressable
            label="Continue"
            onPress={handleContinue}
            disabled={familyAnemia === null || familyThrombosis === null}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
