export type FlowLevel = "LIGHT" | "NORMAL" | "HEAVY" | "NONE" | null;
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

/**
 * DailyLogRequest
 * Payload for creating or updating a daily cycle entry.
 */
export type DailyLogRequest = {
  date: string; // "YYYY-MM-DD"
  flow: FlowLevel;
  symptoms: Symptom[];
  riskFactors: RiskFactor[];
};

/**
 * DailyLogResponse
 * Response data for a daily cycle entry.
 */
export type DailyLogResponse = {
  date: string; // "YYYY-MM-DD"
  flow: FlowLevel;
  symptoms: Symptom[];
  riskFactors: RiskFactor[];
};

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

export interface PredictedPeriodDTO {
  startDate: string;
  endDate: string;
  cycleLengthUsed: number;
}

export interface PeriodLogRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string | null;
}
