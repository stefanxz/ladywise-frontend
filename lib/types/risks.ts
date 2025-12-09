export type RiskLevel = "Low" | "Medium" | "High";

export type RiskData = {
  id: string;
  title: string;
  level: RiskLevel;
  description: string;
};

export type ApiRiskResponse = {
  thrombosisRisk: number;
  anemiaRisk: number;
};

export interface RiskHistoryPoint {
  recordedAt: string; // ISO 8601
  anemiaRisk: 0 | 1 | 2; // Low / Medium / High
  thrombosisRisk: 0 | 1 | 2; // Low / Medium / High
  menstrualFlow: 0 | 1 | 2 | 3; // None / Light / Normal / Heavy
}
