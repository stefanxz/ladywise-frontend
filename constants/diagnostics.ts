import { FlowNum, RiskNum } from "@/lib/types/diagnostics";

/**
 * Mappings for Risk Levels
 *
 * Converts numerical risk scores (0-3) into human-readable labels for display
 * on diagnostic cards and charts.
 * - 0: Unknown / Insufficient Data
 * - 1: Low Risk
 * - 2: Medium Risk
 * - 3: High Risk
 */
export const RISK_LABELS: Record<RiskNum, string> = {
  0: "Unknown",
  1: "Low",
  2: "Medium",
  3: "High",
};

/**
 * Mappings for Menstrual Flow Levels
 *
 * Converts numerical flow values (0-3) into descriptive text for daily logs
 * and historical charts.
 * - 0: None (No bleeding)
 * - 1: Light flow
 * - 2: Normal / Moderate flow
 * - 3: Heavy flow
 */
export const FLOW_LABELS: Record<FlowNum, string> = {
  0: "None",
  1: "Light",
  2: "Normal",
  3: "Heavy",
};
