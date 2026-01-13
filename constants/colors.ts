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

  green: "#16a34a",
  red: "#dc2626",

  tooltipColor: "#292524",
};

// colors for text (and later, maybe dots) per level
export const riskColors: Record<RiskNum, string> = {
  0: "#9CA3AF", // unknown - gray
  1: "#16a34a", // low - green
  2: "#F59E0B", // medium - amber/orange
  3: "#dc2626", // high - red
};

export const flowColors: Record<FlowNum, string> = {
  0: "#6B7280", // grey for "None"
  1: "#22c55e", // light-ish green
  2: Colors.brand, // normal = brand
  3: "#dc2626", // heavy = red
};
