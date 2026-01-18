import {
  BinaryChoiceGroup,
  QuestionScreen,
} from "@/app/onboarding/components/QuestionScreen";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { submitQuestionnaire } from "@/lib/api";
import { QuestionnairePayload } from "@/lib/types/payloads";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

/**
 * Onboarding: Final Health Questionnaire Step
 *
 * This concluding step captures specific health habits, such as the use of
 * hormonal contraception and specialized medical hardware (biosensor cup).
 * These final data points are critical for calibrating the system's
 * analytical models to the user's specific physiological context.
 *
 * This screen also handles the final aggregation of all onboarding data and
 * manages the secure submission of the complete health profile to the backend.
 */
export default function QuestionnaireFinalQuestions() {
  const router = useRouter();
  const { answers, updateAnswers, reset } = useQuestionnaire();

  const [usesEstrogen, setUsesEstrogen] = useState(
    answers.usesEstrogenContraception,
  );
  const [usesBiosensor, setUsesBiosensor] = useState(answers.usesBiosensorCup);
  const [submitting, setSubmitting] = useState(false);

  // Error States
  const [apiError, setApiError] = useState<string | null>(null); // For submission errors

  /**
   * Complete Health Profile Submission
   *
   * Aggregates answers from all previous questionnaire steps, transforms them
   * into the required backend payload format, and performs the final network
   * request. On successful submission, it clears the local questionnaire state
   * and directs the user to the onboarding completion screen.
   */
  const submit = async (
    estrogen: boolean | null,
    biosensor: boolean | null,
  ) => {
    if (submitting) return;
    setSubmitting(true);
    setApiError(null);

    updateAnswers({
      usesEstrogenContraception: estrogen,
      usesBiosensorCup: biosensor,
    });

    try {
      const finalAnswers = {
        ...answers,
        usesEstrogenContraception: estrogen,
        usesBiosensorCup: biosensor,
      };

      const health: QuestionnairePayload["health"] = {
        personalDetails: {
          age: parseInt(finalAnswers.personal.age, 10) || 0,
          weight: parseFloat(finalAnswers.personal.weight) || 0,
          height: parseFloat(finalAnswers.personal.height) || 0,
        },
        familyHistory: {
          familyHistoryAnemia: finalAnswers.familyHistory.anemia ?? undefined,
          familyHistoryThrombosis:
            finalAnswers.familyHistory.thrombosis ?? undefined,
          anemiaConditions: finalAnswers.anemiaRiskFactors,
          thrombosisConditions: finalAnswers.thrombosisRiskFactors,
        },
      };

      if (finalAnswers.usesEstrogenContraception !== null) {
        health.estrogenPill = finalAnswers.usesEstrogenContraception;
      }
      if (finalAnswers.usesBiosensorCup !== null) {
        health.biosensorCup = finalAnswers.usesBiosensorCup;
      }

      const payload: QuestionnairePayload = {
        health: health,
        history: [],
      };

      // Send health object to backend
      await submitQuestionnaire(payload);

      reset();
      router.replace("/onboarding/first-questionnaire-completion");
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

  const handleFinish = () => submit(usesEstrogen, usesBiosensor);

  return (
    <QuestionScreen
      step={5}
      title="A few final questions ✨"
      description="These help us fine-tune your results and recommendations."
      showSkip={false}
      footer={
        <ThemedPressable
          label="Finish"
          onPress={handleFinish}
          loading={submitting}
        />
      }
    >
      <View>
        <BinaryChoiceGroup
          question="Do you use contraception that contains estrogen?"
          value={usesEstrogen}
          onChange={setUsesEstrogen}
          testIDPrefix="estrogen"
        />
      </View>

      <View className="mt-4">
        <BinaryChoiceGroup
          question="Do you use the biosensor-integrated menstrual cup?"
          value={usesBiosensor}
          onChange={setUsesBiosensor}
          testIDPrefix="biosensor"
        />
      </View>

      {/* API submission error */}
      {apiError ? (
        <Text className="text-red-600 text-xs mt-4 ml-2">{apiError}</Text>
      ) : null}
    </QuestionScreen>
  );
}
