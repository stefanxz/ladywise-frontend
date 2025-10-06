export interface ThemedButtonProperties {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;

  // /** Tailwind classes */
  className?: string;      // applied to Pressable
  textClassName?: string;  // applied to inner Text
}
