import { FactorDefinition } from "../components/Diagnostics/types";

// Fix for "require" error: tells TypeScript this global function exists
declare const require: any;

/**
 * FACTORS_REGISTRY
 * ------------------------------------------------
 * This registry serves as the Single Source of Truth (SSOT) for all
 * potential risk factors and symptoms displayed in the application.
 */
export const FACTORS_REGISTRY: Record<string, FactorDefinition> = {
  // =================================================================
  // SECTION: MEDICAL RISK FACTORS
  // Derived from Baseline & Cycle Questionnaires
  // =================================================================

  estrogen_pill: {
    id: "estrogen_pill",
    title: "Estrogen Pill",
    defaultValue: "Present",
    description: "Hormonal therapy currently in use",
    icon: require("@/assets/images/estrogen-pill-icon.png"),
  },

  surgery_injury: {
    id: "surgery_injury",
    title: "Surgery or Severe Injury",
    defaultValue: "Present",
    description: "Recent operation or major trauma",
    icon: require("@/assets/images/surgery-severe-injury-icon.png"),
  },

  blood_clot: {
    id: "blood_clot",
    title: "Blood Clot",
    defaultValue: "Present",
    description: "Active or past clotting event noted",
    icon: require("@/assets/images/blood-clot-icon.png"),
  },

  postpartum: {
    id: "postpartum",
    title: "Postpartum",
    defaultValue: "< 6 Months",
    description: "Elevated physiological risk period",
    icon: require("@/assets/images/postpartum-icon.png"),
  },

  // =================================================================
  // SECTION: SYMPTOMS
  // Self-reported daily symptoms
  // =================================================================

  chest_pain: {
    id: "chest_pain",
    title: "Chest Pain",
    defaultValue: "Present",
    description: "Symptomatic chest discomfort",
    icon: require("@/assets/images/chestpain-icon.png"),
  },

  unilateral_leg_pain: {
    id: "unilateral_leg_pain",
    title: "Unilateral Leg Pain",
    defaultValue: "Present",
    description: "Localized limb discomfort",
    icon: require("@/assets/images/leg-pain-icon.png"),
  },

  shortness_breath: {
    id: "shortness_breath",
    title: "Shortness of Breath",
    defaultValue: "Present",
    description: "Breathing difficulty noted",
    icon: require("@/assets/images/shortness-breath-icon.png"),
  },

  swelling: {
    id: "swelling",
    title: "Swelling",
    defaultValue: "Present",
    description: "Localized or general swelling",
    icon: require("@/assets/images/swelling-icon.png"),
  },

  dizziness: {
    id: "dizziness",
    title: "Dizziness",
    defaultValue: "Present",
    description: "Reported episodes of dizziness",
    icon: require("@/assets/images/dizziness-icon.png"),
  },

  // =================================================================
  // SECTION: FLOW CHARACTERISTICS
  // Mapped dynamically in mapBackendToFactors.ts
  // =================================================================

  flow_light: {
    id: "flow_light",
    title: "Flow Characteristics",
    defaultValue: "Light",
    description: "Low menstrual volume",
    icon: require("@/assets/images/light-flow-icon.png"),
  },

  flow_moderate: {
    id: "flow_moderate",
    title: "Flow Characteristics",
    defaultValue: "Moderate",
    description: "Typical menstrual volume",
    icon: require("@/assets/images/moderate-flow-icon.png"),
  },

  flow_heavy: {
    id: "flow_heavy",
    title: "Flow Characteristics",
    defaultValue: "Heavy",
    description: "High menstrual volume",
    icon: require("@/assets/images/heavy-flow-icon.png"),
  },
};
