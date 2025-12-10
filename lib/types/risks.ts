// --- Real-time / WebSocket DTOs ---

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
  trend: "improving" | "stable" | "worsening" | "neutral" | "increasing" | "declining";
  description: string;
}

// --- App / UI Types ---

export type RiskLevel = "Low" | "Medium" | "High";

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
  latestAnemiaInsight?: InsightResult | null;
  latestThrombosisInsight?: InsightResult | null;
};

export interface RiskHistoryPoint {
  recordedAt: string; // ISO 8601
  anemiaRisk: 0 | 1 | 2; // Low / Medium / High
  thrombosisRisk: 0 | 1 | 2; // Low / Medium / High
  menstrualFlow: 0 | 1 | 2 | 3; // None / Light / Normal / Heavy
}