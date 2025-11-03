export interface ThemedButtonProperties {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;

  // /** Tailwind classes */
  className?: string; // applied to ThemedPressable
  textClassName?: string; // applied to inner Text
}
