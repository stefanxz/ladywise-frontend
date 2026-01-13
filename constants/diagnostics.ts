import { FlowNum, RiskNum } from "@/lib/types/diagnostics";

export const RISK_LABELS: Record<RiskNum, string> = {
    0: "Low",
    1: "Medium",
    2: "High",
};

export const FLOW_LABELS: Record<FlowNum, string> = {
    0: "None",
    1: "Light",
    2: "Normal",
    3: "Heavy",
};
