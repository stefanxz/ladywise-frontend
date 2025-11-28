import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { FLOW_MAP, RISK_MAP, SYMPTOM_MAP } from "@/constants/cycle-mappings";
import { DailyLogRequest } from "@/lib/types/period";
import { ApiRiskResponse, RiskData, RiskLevel } from "@/lib/types/risks";

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

export const mapApiToInsights = (apiData: ApiRiskResponse): RiskData[] => {
  const levelMap: { [key: number]: RiskLevel } = {
    0: "Low",
    1: "Medium",
    2: "High",
  };

  const titleMap: { [key: string]: string } = {
    thrombosisRisk: "Thrombosis Risk",
    anemiaRisk: "Anemia Risk",
  };

  const descriptionMap: { [key: string]: string } = {
    thrombosisRisk: "Some factors may raise clotting risk.",
    anemiaRisk: "Iron levels appear sufficient.",
  };

  // Convert object { key1: val1, key2: val2 } into array [ { ...risk1 }, { ...risk2 } ]
  return Object.keys(apiData).map((key) => {
    const typedKey = key as keyof ApiRiskResponse;
    const apiLevel = apiData[typedKey];

    return {
      id: typedKey,
      title: titleMap[typedKey] || "Unknown Risk",
      level: levelMap[apiLevel] || "Low",
      description: descriptionMap[typedKey] || "No description.",
    };
  });
};
