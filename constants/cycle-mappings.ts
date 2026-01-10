import { FlowLevel, RiskFactor, Symptom } from "@/lib/types/period";

export const FLOW_MAP: Record<string, FlowLevel> = {
  None: "NONE",
  Light: "LIGHT",
  Normal: "NORMAL",
  Heavy: "HEAVY",
};

export const SYMPTOM_MAP: Record<string, Symptom> = {
  "Shortness of breath": "SHORTNESS_OF_BREATH",
  Swelling: "SWELLING",
  Tired: "TIRED",
  "Chest Pain": "CHEST_PAIN",
  "One-sided leg pain": "ONE_SIDED_LEG_PAIN",
  Dizzy: "DIZZY",
};

export const RISK_MAP: Record<string, RiskFactor> = {
  "Estrogen pill": "ESTROGEN_PILL",
  "Surgery or severe injury": "SURGERY_OR_INJURY",
  "Post/current blood clot": "BLOOD_CLOT",
  "<6 months postpartum": "POSTPARTUM_UNDER_6_MONTHS",
};
