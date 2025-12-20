import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { FLOW_MAP, RISK_MAP, SYMPTOM_MAP } from "@/constants/cycle-mappings";
import { DailyLogRequest } from "@/lib/types/period";
import { ApiRiskResponse, RiskData, RiskLevel } from "@/lib/types/risks";

export const cn = (...xs: (string | false | undefined | null)[]) =>
  xs.filter(Boolean).join(" ");

/**
 * Transforms UI-level daily log answers into a backend-compatible payload.
 * Maps string literals to enums.
 *
 * @param {DailyCycleAnswers} answers - The answers from the bottom sheet
 * @returns {DailyLogRequest} The payload ready for API submission
 */
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

const mapScoreToLevel = (score: number): RiskLevel => {
  switch (score) {
    case 3:
      return "High";
    case 2:
      return "Medium";
    case 1:
    default:
      return "Low";
  }
};

/**
 * Maps raw API risk data into a UI-friendly structure for the insights dashboard.
 *
 * @param {ApiRiskResponse} apiData - The raw data from the backend
 * @returns {RiskData[]} Array of risk data objects for rendering cards
 */
export const mapApiToInsights = (apiData: ApiRiskResponse): RiskData[] => {
  if (!apiData) return [];

  const anemiaCard: RiskData = {
    id: "anemia",
    title: "Anemia Risk",
    // 1. Map the integer score to string level
    level: mapScoreToLevel(apiData.anemiaRisk),
    // 2. Safely extract description from the Insight object (if present)
    description:
      apiData.latestAnemiaInsight?.description || "No recent analysis.",
    // 3. Extract trend
    trend: apiData.latestAnemiaInsight?.trend,
  };

  const thrombosisCard: RiskData = {
    id: "thrombosis",
    title: "Thrombosis Risk",
    level: mapScoreToLevel(apiData.thrombosisRisk),
    description:
      apiData.latestThrombosisInsight?.description || "No recent analysis.",
    trend: apiData.latestThrombosisInsight?.trend,
  };

  return [anemiaCard, thrombosisCard];
};
