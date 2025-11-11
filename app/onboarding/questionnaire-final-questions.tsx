import {
  BinaryChoiceGroup,
  QuestionScreen,
} from "@/app/onboarding/components";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { submitQuestionnaire } from "@/lib/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";

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
      //TODO: Add this when the completion is merged aswell
      //router.replace("/onboarding/first-questionnaire-completion");
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

  return (
    <QuestionScreen
      step={5}
      title="A few final questions"
      description="These help us fine-tune your results and recommendations."
      onSkip={() => router.push("/landing")}
      footer={
        <ThemedPressable
          label="Finish"
          onPress={handleFinish}
          disabled={
            usesEstrogen === null || usesBiosensor === null || submitting
          }
          loading={submitting}
        />
      }
    >
      <BinaryChoiceGroup
        question="Do you use contraception that contains estrogen?"
        value={usesEstrogen}
        onChange={setUsesEstrogen}
        testIDPrefix="estrogen"
      />
      <BinaryChoiceGroup
        question="Do you use the biosensor-integrated menstrual cup?"
        value={usesBiosensor}
        onChange={setUsesBiosensor}
        testIDPrefix="biosensor"
      />
      {error ? (
        <Text className="text-red-500 text-sm">{error}</Text>
      ) : null}
    </QuestionScreen>
  );
}

