import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { FLOW_MAP, RISK_MAP, SYMPTOM_MAP } from "@/constants/cycle-mappings";
import { DailyLogRequest } from "@/lib/types/period";

export const cn = (...xs: Array<string | false | undefined | null>) =>
  xs.filter(Boolean).join(" ");

export const mapAnswersToPayload = (
  answers: DailyCycleAnswers,
): DailyLogRequest => {
  const mappedFlow =
    answers.flow && answers.flow !== ""
      ? (FLOW_MAP[answers.flow] ?? null)
      : null;

  const mappedSymptoms = answers.symptoms
    .filter((s) => s !== "None of the above")
    .map((s) => SYMPTOM_MAP[s])
    .filter(Boolean);

  const mappedRiskFactors = answers.riskFactors
    .filter((r) => r !== "None of the above")
    .map((r) => RISK_MAP[r])
    .filter(Boolean);

  return {
    date: answers.date,
    flow: mappedFlow,
    symptoms: mappedSymptoms,
    riskFactors: mappedRiskFactors,
  };
};
