import {
  BinaryChoiceGroup,
  QuestionScreen,
} from "@/app/onboarding/components";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { submitQuestionnaire } from "@/lib/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native"; // Import View

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

  // --- Error States ---
  const [apiError, setApiError] = useState<string | null>(null); // For submission errors
  const [estrogenError, setEstrogenError] = useState<string | null>(null); // For field validation
  const [biosensorError, setBiosensorError] = useState<string | null>(null); // For field validation

  const handleFinish = async () => {

    setEstrogenError(null);
    setBiosensorError(null);

    let hasError = false;
    if (usesEstrogen === null) {
      setEstrogenError("Please select an answer.");
      hasError = true;
    }
    if (usesBiosensor === null) {
      setBiosensorError("Please select an answer.");
      hasError = true;
    }

    if (hasError || submitting) return;

    setSubmitting(true);
    setApiError(null);

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
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QuestionScreen
      step={5}
      title="A few final questions ✨"
      description="These help us fine-tune your results and recommendations."
      onSkip={() => router.push("/landing")}
      footer={
        <ThemedPressable
          label="Finish"
          onPress={handleFinish}
          loading={submitting}
          // The 'disabled' prop is removed to allow validation to run on press
        />
      }
    >
      <View>
        <BinaryChoiceGroup
          question="Do you use contraception that contains estrogen?"
          value={usesEstrogen}
          onChange={(value) => {
            setUsesEstrogen(value);
            if (estrogenError) setEstrogenError(null); // Clear error on change
          }}
          testIDPrefix="estrogen"
        />
        {/* Field validation error */}
        {estrogenError ? (
          <Text className="text-red-600 text-xs mt-1 ml-2">{estrogenError}</Text>
        ) : null}
      </View>

      <View className="mt-4">
        <BinaryChoiceGroup
          question="Do you use the biosensor-integrated menstrual cup?"
          value={usesBiosensor}
          onChange={(value) => {
            setUsesBiosensor(value);
            if (biosensorError) setBiosensorError(null); // Clear error on change
          }}
          testIDPrefix="biosensor"
        />
        {/* Field validation error */}
        {biosensorError ? (
          <Text className="text-red-600 text-xs mt-1 ml-2">{biosensorError}</Text>
        ) : null}
      </View>

      {/* API submission error */}
      {apiError ? (
        <Text className="text-red-600 text-xs mt-4 ml-2">{apiError}</Text>
      ) : null}
    </QuestionScreen>
  );
}