export type FlowLevel = "LIGHT" | "NORMAL" | "HEAVY" | "SPOTTING" | null;
export type RiskFactor =
  | "ESTROGEN_PILL"
  | "SURGERY_OR_INJURY"
  | "BLOOD_CLOT"
  | "POSTPARTUM_UNDER_6_MONTHS";

export type Symptom =
  | "SHORTNESS_OF_BREATH"
  | "SWELLING"
  | "TIRED"
  | "CHEST_PAIN"
  | "ONE_SIDED_LEG_PAIN"
  | "DIZZY";

export type DailyLogRequest = {
  date: string; // "YYYY-MM-DD"
  flow: FlowLevel;
  symptoms: Symptom[];
  riskFactors: RiskFactor[];
};
