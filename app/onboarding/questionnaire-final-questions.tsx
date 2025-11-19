import { useAuth } from "@/context/AuthContext";
import { BinaryChoiceGroup, QuestionScreen } from "@/app/onboarding/components";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import {
  submitQuestionnaire,
  type QuestionnairePayload,
} from "@/lib/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native"; // Import View

export default function QuestionnaireFinalQuestions() {
  const router = useRouter();
  const { answers, updateAnswers, reset } = useQuestionnaire();
  const { userId } = useAuth();

  const [usesEstrogen, setUsesEstrogen] = useState(
    answers.usesEstrogenContraception,
  );
  const [usesBiosensor, setUsesBiosensor] = useState(answers.usesBiosensorCup);
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

    if (hasError || submitting) {
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      // It's good practice to create the final payload in one step.
      const finalAnswers = {
        ...answers,
        usesEstrogenContraception: usesEstrogen,
        usesBiosensorCup: usesBiosensor,
      };

      // Update the context with the latest answers from this screen
      updateAnswers({
        usesEstrogenContraception: usesEstrogen,
        usesBiosensorCup: usesBiosensor,
      });

      const payload = {
        userId: userId,
        health: {
          personalDetails: {
            age: parseInt(finalAnswers.personal.age, 10) || 0,
            weight: parseFloat(finalAnswers.personal.weight) || 0,
            height: parseFloat(finalAnswers.personal.height) || 0,
          },
          familyHistory: {
            familyHistoryAnemia: finalAnswers.familyHistory.anemia ?? false,
            familyHistoryThrombosis:
              finalAnswers.familyHistory.thrombosis ?? false,
            anemiaConditions: finalAnswers.anemiaRiskFactors,
            thrombosisConditions: finalAnswers.thrombosisRiskFactors,
          },
          estrogenPill: finalAnswers.usesEstrogenContraception ?? false,
          biosensorCup: finalAnswers.usesBiosensorCup ?? false,
        },
        history: [], // Assuming history is empty for now
      };

      console.log(
        "Final payload being sent:",
        JSON.stringify(payload, null, 2),
      );

      if (payload.userId) {
        await submitQuestionnaire(payload as QuestionnairePayload);
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
          <Text className="text-red-600 text-xs mt-1 ml-2">
            {estrogenError}
          </Text>
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
          <Text className="text-red-600 text-xs mt-1 ml-2">
            {biosensorError}
          </Text>
        ) : null}
      </View>

      {/* API submission error */}
      {apiError ? (
        <Text className="text-red-600 text-xs mt-4 ml-2">{apiError}</Text>
      ) : null}
    </QuestionScreen>
  );
}
