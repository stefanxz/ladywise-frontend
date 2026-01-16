export interface RiskBlock {
  risk: "Low" | "Medium" | "High";
  key_inputs: string[];
  summary_sentence: string;
}

export interface RiskResult {
  anemia: RiskBlock;
  thrombosis: RiskBlock;
}

export interface InsightResult {
  trend:
    | "improving"
    | "stable"
    | "worsening"
    | "neutral"
    | "increasing"
    | "declining";
  description: string;
}

export type RiskLevel = "Low" | "Medium" | "High";

/**
 * RiskData
 * UI-friendly representation of a risk factor and its analysis.
 */
export type RiskData = {
  id: string;
  title: string;
  level: RiskLevel;
  description: string;
  trend?: string; // Added to support UI arrows (e.g. "increasing")
};

// Updated to match the Java 'UserResponse' DTO
export type ApiRiskResponse = {
  thrombosisRisk: number;
  anemiaRisk: number;
  // Previously we used 'InsightResult', now we likely get the full details or we need to map the new structure.
  // The user says "The User object now contains the Daily Risk Details".
  // Note: The /risks endpoint might still return the old structure OR the new one.
  // Let's add the new fields as optional for now to be safe, or if we are sure, replace them.
  // Given the user instruction "naming consistency", let's expect snake_case in JSON.
  latest_anemia_risk_details?: {
    risk: RiskLevel;
    key_inputs: string[];
    summary_sentence: string;
  };
  latest_thrombosis_risk_details?: {
    risk: RiskLevel;
    key_inputs: string[];
    summary_sentence: string;
  };
  // Keeping old fields just in case until verified
  latestAnemiaInsight?: InsightResult | null;
  latestThrombosisInsight?: InsightResult | null;
};

/**
 * RiskHistoryPoint
 * A single data point for risk history charts.
 */
export interface RiskHistoryPoint {
  recordedAt: string; // ISO 8601
  anemiaRisk: 0 | 1 | 2; // Low / Medium / High
  thrombosisRisk: 0 | 1 | 2; // Low / Medium / High
  menstrualFlow: 0 | 1 | 2 | 3; // None / Light / Normal / Heavy
}
