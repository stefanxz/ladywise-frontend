/**
 * Properties for the ThemedPressable component.
 */
export interface ThemedButtonProperties {
  /** The text to display inside the button. */
  label: string;
  /** Function to execute on press. */
  onPress: () => void;
  /** If true, the button is disabled and cannot be pressed. */
  disabled?: boolean;
  /** If true, displays a loading spinner instead of the label. */
  loading?: boolean;
  /** Used to locate this view in end-to-end tests. */
  testID?: string;
  /** Additional Tailwind utility classes to apply to the Pressable container. */
  className?: string; // applied to ThemedPressable
  /** Additional Tailwind utility classes to apply to the inner Text component. */
  textClassName?: string; // applied to inner Text
}
