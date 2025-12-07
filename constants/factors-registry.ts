import { FactorDefinition } from "@/components/Diagnostics/types";
import {
  Pill,
  Bandage,
  Droplet,
  Baby,
  HeartCrack,
  Activity,
  Wind,
  Expand,
  RotateCw,
  Waves,
  Dna,
  Battery,
} from "lucide-react-native";

/**
 * This registry serves as the Single Source of Truth for all
 * potential risk factors and symptoms displayed in the application.
 */
export const FACTORS_REGISTRY: Record<string, FactorDefinition> = {
  // Medical risk factors
  family_history_anemia: {
    id: "family_history_anemia",
    title: "Family History",
    defaultValue: "Anemia",
    description: "Genetic predisposition recorded",
    icon: Dna,
  },

  family_history_thrombosis: {
    id: "family_history_thrombosis",
    title: "Family History",
    defaultValue: "Thrombosis",
    description: "Genetic predisposition recorded",
    icon: Dna,
  },

  estrogen_pill: {
    id: "estrogen_pill",
    title: "Estrogen Pill",
    defaultValue: "Present",
    description: "Hormonal therapy currently in use",
    icon: Pill,
  },

  surgery_injury: {
    id: "surgery_injury",
    title: "Surgery or Severe Injury",
    defaultValue: "Present",
    description: "Recent operation or major trauma",
    icon: Bandage,
  },

  blood_clot: {
    id: "blood_clot",
    title: "Blood Clot",
    defaultValue: "Present",
    description: "Active or past clotting event noted",
    icon: Droplet,
  },

  postpartum: {
    id: "postpartum",
    title: "Postpartum",
    defaultValue: "< 6 Months",
    description: "Elevated physiological risk period",
    icon: Baby,
  },

  // Symptoms
  chest_pain: {
    id: "chest_pain",
    title: "Chest Pain",
    defaultValue: "Present",
    description: "Symptomatic chest discomfort",
    icon: HeartCrack,
  },

  unilateral_leg_pain: {
    id: "unilateral_leg_pain",
    title: "Unilateral Leg Pain",
    defaultValue: "Present",
    description: "Localized limb discomfort",
    icon: Activity,
  },

  shortness_breath: {
    id: "shortness_breath",
    title: "Shortness of Breath",
    defaultValue: "Present",
    description: "Breathing difficulty noted",
    icon: Wind,
  },

  swelling: {
    id: "swelling",
    title: "Swelling",
    defaultValue: "Present",
    description: "Localized or general swelling",
    icon: Expand,
  },

  dizziness: {
    id: "dizziness",
    title: "Dizziness",
    defaultValue: "Present",
    description: "Reported episodes of dizziness",
    icon: RotateCw,
  },

  tired: {
    id: "tired",
    title: "Fatigue",
    defaultValue: "Present",
    description: "Unusual tiredness reported",
    icon: Battery,
  },

  // Flow characteristics
  flow_light: {
    id: "flow_light",
    title: "Flow Characteristics",
    defaultValue: "Light",
    description: "Low menstrual volume",
    icon: Waves,
  },

  flow_moderate: {
    id: "flow_moderate",
    title: "Flow Characteristics",
    defaultValue: "Moderate",
    description: "Typical menstrual volume",
    icon: Waves,
  },

  flow_heavy: {
    id: "flow_heavy",
    title: "Flow Characteristics",
    defaultValue: "Heavy",
    description: "High menstrual volume",
    icon: Waves,
  },
};
