import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { FLOW_MAP, RISK_MAP, SYMPTOM_MAP } from "@/constants/cycle-mappings";
import { DailyLogRequest } from "@/lib/types/period";
import { ApiRiskResponse, RiskData, RiskLevel } from "@/lib/types/risks";
import { format } from "date-fns"; // Assuming date-fns is available, or use native Intl

/**
 * Utility to conditionally class names.
 * Filters out falsy values and joins the result.
 *
 * @param xs - Array of class names or falsy values.
 * @returns Joined class names string.
 */
export const cn = (...xs: (string | false | undefined | null)[]) =>
  xs.filter(Boolean).join(" ");

/**
 * Formats a date string (YYYY-MM-DD) or Date object into a short UTC-based string (e.g., "Jan 1").
 * This ensures consistency regardless of local timezone.
 *
 * @param date - Input date string or object
 * @returns Formatted date string
 */
export const formatDateUTC = (date: string | Date): string => {
  const d = new Date(date);
  // Manual formatting to ensure UTC consistency if needed, or simple local formatting
  // Using simple locale string for now as mostly used for display
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
};

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

// Reverse mappings for API to UI transformations
const REVERSE_FLOW_MAP = Object.fromEntries(
  Object.entries(FLOW_MAP).map(([k, v]) => [v, k]),
);
const REVERSE_SYMPTOM_MAP = Object.fromEntries(
  Object.entries(SYMPTOM_MAP).map(([k, v]) => [v, k]),
);
const REVERSE_RISK_MAP = Object.fromEntries(
  Object.entries(RISK_MAP).map(([k, v]) => [v, k]),
);

/**
 * Transforms backend API data into UI-compatible state.
 */
export const mapApiToAnswers = (data: any, date: string): DailyCycleAnswers => {
  // Map the symptoms
  const mappedSymptoms = (data.symptoms || []).map(
    (s: string) => REVERSE_SYMPTOM_MAP[s] || s,
  );

  // Map the risk factors
  const mappedRiskFactors = (data.riskFactors || []).map(
    (r: string) => REVERSE_RISK_MAP[r] || r,
  );

  return {
    date: date,
    flow: data.flow ? (REVERSE_FLOW_MAP[data.flow] ?? null) : null,

    // If the array is empty, default to "None of the above"
    symptoms:
      mappedSymptoms.length === 0 ? ["None of the above"] : mappedSymptoms,
    riskFactors:
      mappedRiskFactors.length === 0
        ? ["None of the above"]
        : mappedRiskFactors,
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
    // Map the integer score to string level
    level: mapScoreToLevel(apiData.anemiaRisk),
    // Safely extract description from the Insight object (if present)
    description:
      apiData.latest_anemia_risk_details?.key_inputs?.join(", ") ||
      apiData.latestAnemiaInsight?.description ||
      "No recent analysis.",
    // Extract trend
    trend: apiData.latestAnemiaInsight?.trend,
  };

  const thrombosisCard: RiskData = {
    id: "thrombosis",
    title: "Thrombosis Risk",
    level: mapScoreToLevel(apiData.thrombosisRisk),
    description:
      apiData.latest_thrombosis_risk_details?.key_inputs?.join(", ") ||
      apiData.latestThrombosisInsight?.description ||
      "No recent analysis.",
    trend: apiData.latestThrombosisInsight?.trend,
  };

  return [anemiaCard, thrombosisCard];
};

export const formatDateUTC = (dateStr: string) => {
  // Handle potential object format if somehow leaked (defensive)
  const dStr =
    typeof dateStr === "object" && (dateStr as any).$date
      ? (dateStr as any).$date
      : String(dateStr);
  const d = new Date(dStr);

  // Use UTC methods to avoid timezone shift
  if (isNaN(d.getTime())) return "";

  const month = d.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const day = d.getUTCDate();

  return `${month} ${day}`;
};
