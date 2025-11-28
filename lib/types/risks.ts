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
