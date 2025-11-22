export const FACTORS: Record<string, FactorDefinition> = {
  estrogen_pill: {
    id: "estrogen_pill",
    title: "Estrogen Pill",
    value: "Present",
    description: "Hormonal therapy currently in use",
    section: "Risk Factors",
    icon: require("@/assets/images/estrogen-pill-icon.png"),
  },

  surgery_injury: {
    id: "surgery_injury",
    title: "Surgery or Severe Injury",
    value: "Present",
    description: "Recent operation or major trauma",
    section: "Risk Factors",
    icon: require("@/assets/images/surgery-severe-injury-icon.png"),
  },

  blood_clot: {
    id: "blood_clot",
    title: "Blood Clot",
    value: "Present",
    description: "Active or past clotting event noted",
    section: "Risk Factors",
    icon: require("@/assets/images/blood-clot-icon.png"),
  },

  postpartum: {
    id: "postpartum",
    title: "Postpartum",
    value: "< 6 Months",
    description: "Elevated physiological risk period",
    section: "Risk Factors",
    icon: require("@/assets/images/postpartum-icon.png"),
  },

  chest_pain: {
    id: "chest_pain",
    title: "Chest Pain",
    value: "Present",
    description: "Symptomatic chest discomfort",
    section: "Symptoms",
    icon: require("@/assets/images/chestpain-icon.png"),
  },

  unilateral_leg_pain: {
    id: "unilateral_leg_pain",
    title: "Unilateral Leg Pain",
    value: "Present",
    description: "Localized limb discomfort",
    section: "Symptoms",
    icon: require("@/assets/images/leg-pain-icon.png"),
  },

  shortness_breath: {
    id: "shortness_breath",
    title: "Shortness of Breath",
    value: "Present",
    description: "Breathing difficulty noted",
    section: "Symptoms",
    icon: require("@/assets/images/shortness-breath-icon.png"),
  },

  swelling: {
    id: "swelling",
    title: "Swelling",
    value: "Present",
    description: "Localized or general swelling",
    section: "Symptoms",
    icon: require("@/assets/images/swelling-icon.png"),
  },

  dizziness: {
    id: "dizziness",
    title: "Dizziness",
    value: "Present",
    description: "Reported episodes of dizziness",
    section: "Symptoms",
    icon: require("@/assets/images/dizziness-icon.png"),
  },

  flow_light: {
    id: "flow_light",
    title: "Flow Characteristics",
    value: "Light",
    description: "Low menstrual volume",
    section: "Flow Characteristics",
    icon: require("@/assets/images/light-flow-icon.png"),
  },

  flow_moderate: {
    id: "flow_moderate",
    title: "Flow Characteristics",
    value: "Moderate",
    description: "Typical menstrual volume",
    section: "Flow Characteristics",
    icon: require("@/assets/images/moderate-flow-icon.png"),
  },

  flow_heavy: {
    id: "flow_heavy",
    title: "Flow Characteristics",
    value: "Heavy",
    description: "High menstrual volume",
    section: "Flow Characteristics",
    icon: require("@/assets/images/heavy-flow-icon.png"),
  },
};