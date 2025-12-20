import { FACTORS_REGISTRY } from "@/constants/factors-registry";
import { FactorCardProps } from "@/components/Diagnostics/types";

/**
 * Backend String to Frontend Registry id map
 */
const BACKEND_TO_FRONTEND_MAP: Record<string, string> = {
  // Risk Factors (Backend sends UPPERCASE)
  ESTROGEN_PILL: "estrogen_pill",
  SURGERY_OR_INJURY: "surgery_injury",
  BLOOD_CLOT: "blood_clot",
  POSTPARTUM_UNDER_6_MONTHS: "postpartum",

  // Symptoms (Backend sends UPPERCASE)
  TIRED: "tired",
  CHEST_PAIN: "chest_pain",
  SHORTNESS_OF_BREATH: "shortness_breath",
  DIZZY: "dizziness",
  SWELLING: "swelling",
  ONE_SIDED_LEG_PAIN: "unilateral_leg_pain",

  // specific strings found in SymptomService.java
  "Family history of anemia": "family_history_anemia",
  "Family history of thrombosis": "family_history_thrombosis",
};

/**
 * Transforms a list of backend strings into UI-ready Factor Objects.
 * Maps backend string constants (e.g. "TIRED") to frontend definitions.
 *
 * @param {string[] | null | undefined} backendList - Array of backend strings
 * @returns {FactorCardProps[]} Array of mapped factors for display
 */
export function mapBackendListToFactors(
  backendList: string[] | null | undefined,
): FactorCardProps[] {
  const activeFactors: FactorCardProps[] = [];

  if (!backendList || !Array.isArray(backendList)) return [];

  backendList.forEach((rawItem) => {
    if (rawItem.startsWith("flow_")) {
      let flowKey = rawItem.toLowerCase();

      if (flowKey === "flow_normal") flowKey = "flow_moderate";
      if (flowKey === "flow_none") return;

      const def = FACTORS_REGISTRY[flowKey];
      if (def) {
        activeFactors.push({
          title: def.title,
          value: def.defaultValue,
          description: def.description,
          icon: def.icon,
          variant: "flow",
        });
      }
      return;
    }

    const registryKey =
      BACKEND_TO_FRONTEND_MAP[rawItem] || rawItem.toLowerCase();

    const def = FACTORS_REGISTRY[registryKey];
    if (def) {
      activeFactors.push({
        title: def.title,
        value: def.defaultValue,
        description: def.description,
        icon: def.icon,
        variant: "default",
      });
    }
  });

  return activeFactors;
}
