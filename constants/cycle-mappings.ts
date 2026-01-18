import { FlowLevel, RiskFactor, Symptom } from "@/lib/types/period";

/**
 * Menstrual Flow Level Mappings
 *
 * Maps user-facing string descriptions (e.g., "Light", "Heavy") to their
 * corresponding internal enum values (`FlowLevel`). This is used when parsing
 * user input or displaying data from the backend.
 */
export const FLOW_MAP: Record<string, FlowLevel> = {
  None: "NONE",
  Light: "LIGHT",
  Normal: "NORMAL",
  Heavy: "HEAVY",
};

/**
 * Symptom Identification Mappings
 *
 * Maps the readable names of various health symptoms to their strict
 * enumerated types (`Symptom`) used in the system logic and database.
 */
export const SYMPTOM_MAP: Record<string, Symptom> = {
  "Shortness of breath": "SHORTNESS_OF_BREATH",
  Swelling: "SWELLING",
  Tired: "TIRED",
  "Chest Pain": "CHEST_PAIN",
  "One-sided leg pain": "ONE_SIDED_LEG_PAIN",
  Dizzy: "DIZZY",
};

/**
 * Risk Factor Mappings
 *
 * Associates descriptions of specific health risks (like medication use or medical history)
 * with the `RiskFactor` enum constants used for risk assessment algorithms.
 */
export const RISK_MAP: Record<string, RiskFactor> = {
  "Estrogen pill": "ESTROGEN_PILL",
  "Surgery or severe injury": "SURGERY_OR_INJURY",
  "Post/current blood clot": "BLOOD_CLOT",
  "<6 months postpartum": "POSTPARTUM_UNDER_6_MONTHS",
};
