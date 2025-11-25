export enum FlowLevel {
  NONE = "NONE",
  LIGHT = "LIGHT",
  NORMAL = "NORMAL",
  HEAVY = "HEAVY",
}

export enum Symptom {
  SHORTNESS_OF_BREATH = "SHORTNESS_OF_BREATH",
  SWELLING = "SWELLING",
  TIRED = "TIRED",
  CHEST_PAIN = "CHEST_PAIN",
  ONE_SIDED_LEG_PAIN = "ONE_SIDED_LEG_PAIN",
  DIZZY = "DIZZY",
}

export enum RiskFactor {
  ESTROGEN_PILL = "ESTROGEN_PILL",
  SURGERY_OR_INJURY = "SURGERY_OR_INJURY",
  BLOOD_CLOT = "BLOOD_CLOT",
  POSTPARTUM_UNDER_6_MONTHS = "POSTPARTUM_UNDER_6_MONTHS",
}

export interface DailyEntryDTO {
  date: string; // YYYY-MM-DD
  flow: FlowLevel;
  symptoms: Symptom[];
  riskFactors: RiskFactor[];
}

export interface PeriodLogResponse {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // Null if ongoing
  dailyEntries: DailyEntryDTO[];
}

export interface PeriodLogRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string | null;
}