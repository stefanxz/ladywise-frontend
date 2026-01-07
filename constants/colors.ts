import type { RiskNum, FlowNum } from "@/lib/types/diagnostics";

export const Colors = {
  brand: "#A45A6B",
  lightBrand: "#FFF5F7",
  brandLight: "#F5EBEB",
  background: "#F9FAFB",
  regularText: "#374151",
  activeTab: "#111827",
  inactiveTab: "#9CA3AF",
  textHeading: "#111827",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",

  lightGreen: "#F0FDF4",
  lightRed: "#FEF2F2",

  tooltipColor: "#292524",
};

// colors for text (and later, maybe dots) per level
export const riskColors: Record<RiskNum, string> = {
  0: "#16a34a", // green
  1: "#eab308", // yellow
  2: "#dc2626", // red
};

export const flowColors: Record<FlowNum, string> = {
  0: "#6B7280", // grey for "None"
  1: "#22c55e", // light-ish green
  2: Colors.brand, // normal = brand
  3: "#dc2626", // heavy = red
};
