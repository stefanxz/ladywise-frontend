import {
  QUESTIONNAIRE_TOTAL_STEPS,
  useQuestionnaire,
} from "@/app/onboarding/QuestionnaireContext";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { submitQuestionnaire } from "@/lib/api";
import { cn } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionnaireFinalQuestions() {
  const router = useRouter();
  const { answers, updateAnswers, reset } = useQuestionnaire();

  const [usesEstrogen, setUsesEstrogen] = useState(
    answers.usesEstrogenContraception,
  );
  const [usesBiosensor, setUsesBiosensor] = useState(
    answers.usesBiosensorCup,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSkip = () => {
    router.push("/landing");
  };

  const handleFinish = async () => {
    if (usesEstrogen === null || usesBiosensor === null || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const updatedAnswers = {
        ...answers,
        usesEstrogenContraception: usesEstrogen,
        usesBiosensorCup: usesBiosensor,
      };

      updateAnswers({
        usesEstrogenContraception: usesEstrogen,
        usesBiosensorCup: usesBiosensor,
      });

      if (updatedAnswers.userId) {
        await submitQuestionnaire({
          userId: updatedAnswers.userId,
          age: Number(updatedAnswers.personal.age),
          weightKg: parseFloat(updatedAnswers.personal.weight),
          heightCm: parseFloat(updatedAnswers.personal.height),
          familyHistory: {
            anemia: Boolean(updatedAnswers.familyHistory.anemia),
            thrombosis: Boolean(updatedAnswers.familyHistory.thrombosis),
          },
          anemiaRiskFactors: updatedAnswers.anemiaRiskFactors,
          thrombosisRiskFactors: updatedAnswers.thrombosisRiskFactors,
          usesEstrogenContraception: Boolean(
            updatedAnswers.usesEstrogenContraception,
          ),
          usesBiosensorCup: Boolean(updatedAnswers.usesBiosensorCup),
        });
      }

      reset();
      router.replace("/onboarding/questionnaire-complete");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderBinaryOption = (
    value: boolean,
    selected: boolean | null,
    onSelect: (val: boolean) => void,
  ) => (
    <Pressable
      key={value ? "yes" : "no"}
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
            <ProgressBar currentStep={5} totalSteps={QUESTIONNAIRE_TOTAL_STEPS} />
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
      <View className="w-full max-w-md items-start mt-2 gap-y-3 px-10 pt-[71px] pb-12">
        <Text className="text-3xl font-inter-semibold text-brand text-left">
          A few final questions ✨
        </Text>
        <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">
          These help us fine-tune your results and recommendations.
        </Text>
        <View className="w-full mt-8 gap-y-6">
          <View className="gap-y-3">
            <Text className="text-inter-semibold text-regularText">
              Do you use contraception that contains estrogen?
            </Text>
            <View className="gap-y-2">
              {renderBinaryOption(true, usesEstrogen, setUsesEstrogen)}
              {renderBinaryOption(false, usesEstrogen, setUsesEstrogen)}
            </View>
          </View>

          <View className="gap-y-3">
            <Text className="text-inter-semibold text-regularText">
              Do you use the biosensor-integrated menstrual cup?
            </Text>
            <View className="gap-y-2">
              {renderBinaryOption(true, usesBiosensor, setUsesBiosensor)}
              {renderBinaryOption(false, usesBiosensor, setUsesBiosensor)}
            </View>
          </View>
        </View>

        {error ? (
          <Text className="text-red-500 text-sm mt-4">{error}</Text>
        ) : null}

        <View className="w-full mt-10">
          <ThemedPressable
            label="Finish"
            onPress={handleFinish}
            disabled={
              usesEstrogen === null || usesBiosensor === null || submitting
            }
            loading={submitting}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
