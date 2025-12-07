import { LucideIcon } from "lucide-react-native";

/**
 * Represents the static definition of a risk factor.
 * This data is constant and lives in the registry.
 */
export interface FactorDefinition {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** The default value to display if the backend doesn't provide a specific override */
  defaultValue: string;
}

/**
 * Represents the data passed to the UI component.
 * This is a combination of static registry data + dynamic backend status.
 */
export interface FactorCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  /** Optional: Used for flow charts or different visual styles */
  variant?: "default" | "flow";
}

/**
 * Props passed to the FactorsSection component.
 */
export interface FactorsSectionProps {
  data: string[];
}
