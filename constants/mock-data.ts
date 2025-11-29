import { RiskData, RiskHistoryPoint } from "@/lib/types/risks";

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

export const mockHistory: RiskHistoryPoint[] = [
  {
    recordedAt: "2025-10-28T10:00:00Z",
    anemiaRisk: 1,
    thrombosisRisk: 0,
    menstrualFlow: 2,
  },
  {
    recordedAt: "2025-10-29T10:00:00Z",
    anemiaRisk: 1,
    thrombosisRisk: 1,
    menstrualFlow: 3,
  },
  {
    recordedAt: "2025-10-30T10:00:00Z",
    anemiaRisk: 2,
    thrombosisRisk: 1,
    menstrualFlow: 2,
  },
  {
    recordedAt: "2025-10-31T10:00:00Z",
    anemiaRisk: 1,
    thrombosisRisk: 2,
    menstrualFlow: 1,
  },
  {
    recordedAt: "2025-11-01T10:00:00Z",
    anemiaRisk: 0,
    thrombosisRisk: 1,
    menstrualFlow: 0,
  },
];
