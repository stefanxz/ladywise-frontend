import { FACTORS_REGISTRY } from "@/constants/factorsRegistry";
import { FactorCardProps } from "@/components/Diagnostics/types";

// 1. The Translator: Backend String -> Frontend Registry ID
const BACKEND_TO_FRONTEND_MAP: Record<string, string> = {
  // Risk Factors (Backend sends UPPERCASE)
  "ESTROGEN_PILL": "estrogen_pill",
  "SURGERY_OR_INJURY": "surgery_injury",
  "BLOOD_CLOT": "blood_clot",
  "POSTPARTUM_UNDER_6_MONTHS": "postpartum", 

  // Symptoms (Backend sends UPPERCASE)
  "TIRED": "tired",
  "CHEST_PAIN": "chest_pain",
  "SHORTNESS_OF_BREATH": "shortness_breath",
  "DIZZY": "dizziness", 
  "SWELLING": "swelling",
  "ONE_SIDED_LEG_PAIN": "unilateral_leg_pain", 

  // specific strings found in SymptomService.java
  "Family history of anemia": "family_history_anemia",
  "Family history of thrombosis": "family_history_thrombosis"
};

/**
 * Transforms a list of backend strings into UI-ready Factor Objects.
 * [cite_start]Requirement: URF-12.5 [cite: 501]
 * @param backendList - Array of strings (e.g. ["TIRED", "flow_heavy", "ESTROGEN_PILL"])
 */
export function mapBackendListToFactors(backendList: string[] | null | undefined): FactorCardProps[] {
  const activeFactors: FactorCardProps[] = [];

  if (!backendList || !Array.isArray(backendList)) return [];

  backendList.forEach((rawItem) => {
    // SCENARIO A: Flow Handling (Backend sends "flow_heavy", "flow_normal")
    if (rawItem.startsWith("flow_")) {
        let flowKey = rawItem.toLowerCase(); 
        
        // Fix: Map backend "normal" to frontend "moderate" if needed
        if (flowKey === "flow_normal") flowKey = "flow_moderate";
        if (flowKey === "flow_none") return; // Don't show card for no flow

        const def = FACTORS_REGISTRY[flowKey];
        if (def) {
            activeFactors.push({
                title: def.title,
                value: def.defaultValue, 
                description: def.description,
                icon: def.icon,
                variant: "flow"
            });
        }
        return;
    }

    // SCENARIO B: Standard Mapping using the Translator
    // 1. Try exact match in Map
    // 2. If not in Map, try lowercase version (fallback)
    const registryKey = BACKEND_TO_FRONTEND_MAP[rawItem] || rawItem.toLowerCase();
    
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