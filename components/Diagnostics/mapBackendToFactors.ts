import { FACTORS_REGISTRY } from "./factorsRegistry";
import { FactorCardProps } from "./types";

/**
 * Transforms backend API response into UI-ready Factor objects.
 * Requirement: URF-12.5 (Structured list of relevant data)
 * * @param backendData - Object with keys (factor IDs) and values (boolean/string).
 * Example: { "estrogen_pill": true, "flow": "Heavy", "dizziness": false }
 */
export function mapBackendToFactors(
  backendData: Record<string, any> | null,
): FactorCardProps[] {
  const activeFactors: FactorCardProps[] = [];

  if (!backendData) return [];

  // 1. Iterate through the raw backend keys
  Object.keys(backendData).forEach((key) => {
    const backendValue = backendData[key];

    // SKIP if the value is false, null, or undefined (Factor not present)
    if (!backendValue) return;

    // SCENARIO A: Direct Match (e.g., estrogen_pill: true)
    // The key in backend matches the key in our registry
    if (FACTORS_REGISTRY[key]) {
      const def = FACTORS_REGISTRY[key];
      activeFactors.push({
        title: def.title,
        // If backend sends a specific string (like "< 6 Months"), use it.
        // Otherwise use the default (like "Present").
        value:
          typeof backendValue === "string" ? backendValue : def.defaultValue,
        description: def.description,
        icon: def.icon,
        variant: "default",
      });
    }
  });

  // SCENARIO B: Special "Flow" Handling (Cycle Questionnaire)
  // Backend sends { flow: "Heavy" }, but registry key is "flow_heavy"
  if (backendData.flow) {
    const flowValue =
      typeof backendData.flow === "string" ? backendData.flow : "";
    // Construct the registry key: "flow_" + "heavy" -> "flow_heavy"
    const registryKey = `flow_${flowValue.toLowerCase()}`;

    const def = FACTORS_REGISTRY[registryKey];

    if (def) {
      activeFactors.push({
        title: def.title,
        value: flowValue, // "Heavy"
        description: def.description,
        icon: def.icon,
        variant: "flow",
      });
    }
  }

  return activeFactors;
}
