import { RiskData } from "@/lib/types/risks";
import { DiagnosticsResponseDTO } from "@/lib/types/diagnostics";

export const MOCK_INSIGHTS: RiskData[] = [
  {
    id: "1",
    title: "Thrombosis Risk",
    level: "Medium",
    description: "Some factors may raise clotting risk.",
  },
  {
    id: "2",
    title: "Anemia Risk",
    level: "Low",
    description: "Iron levels appear sufficient.",
  },
];

export const MOCK_USER = {
  name: "Mirela Marcu",
  avatarUrl: "",
};

export const mockHistory: DiagnosticsResponseDTO[] = [
  {
    id: "1",
    userId: "mock",
    date: "2025-10-28",
    lastUpdated: "2025-10-28T10:00:00Z",
    anemiaRisk: 2, // Medium
    thrombosisRisk: 1, // Low
    flowLevel: 2,
    anemiaSummary: "Moderate anemia risk detected. You reported feeling tired.",
    thrombosisSummary: "Thrombosis risk is currently low. No significant factors reported.",
    anemiaKeyInputs: ["tired"],
    thrombosisKeyInputs: [],
  },
  {
    id: "2",
    userId: "mock",
    date: "2025-10-29",
    lastUpdated: "2025-10-29T10:00:00Z",
    anemiaRisk: 2, // Medium
    thrombosisRisk: 2, // Medium
    flowLevel: 3,
    anemiaSummary: "Anemia risk remains moderate. Continued fatigue observed.",
    thrombosisSummary: "Thrombosis risk increased slightly due to reporting medication use.",
    anemiaKeyInputs: ["tired"],
    thrombosisKeyInputs: ["estrogen_pill"],
  },
  {
    id: "3",
    userId: "mock",
    date: "2025-10-30",
    lastUpdated: "2025-10-30T10:00:00Z",
    anemiaRisk: 3, // High
    thrombosisRisk: 2, // Medium
    flowLevel: 2,
    anemiaSummary: "High anemia risk. Symptoms now include dizziness and fatigue.",
    thrombosisSummary: "Thrombosis risk remains stable at medium level.",
    anemiaKeyInputs: ["tired", "dizziness"],
    thrombosisKeyInputs: ["estrogen_pill"],
  },
  {
    id: "4",
    userId: "mock",
    date: "2025-10-31",
    lastUpdated: "2025-10-31T10:00:00Z",
    anemiaRisk: 2, // Medium
    thrombosisRisk: 3, // High
    flowLevel: 1,
    anemiaSummary: "Anemia risk has improved slightly.",
    thrombosisSummary: "High thrombosis risk detected. Combination of factors present.",
    anemiaKeyInputs: ["tired"],
    thrombosisKeyInputs: ["estrogen_pill", "surgery_injury"],
  },
  {
    id: "5",
    userId: "mock",
    date: "2025-11-01",
    lastUpdated: "2025-11-01T10:00:00Z",
    anemiaRisk: 1, // Low
    thrombosisRisk: 3, // High
    flowLevel: 0,
    anemiaSummary: "Anemia risk is low. No significant symptoms reported.",
    thrombosisSummary: "Critical thrombosis risk. Please consult a healthcare provider immediately.",
    anemiaKeyInputs: [],
    thrombosisKeyInputs: ["estrogen_pill", "surgery_injury", "swelling"],
  },
];
