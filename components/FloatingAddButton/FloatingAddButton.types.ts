/**
 * Properties for the FloatingAddButton component.
 */
export type FloatingAddButtonProps = {
  /** The diameter of the button in pixels. Default 56. */
  size?: number;
  /** The background color of the button. */
  buttonColor?: string;
  /** The color of the plus icon. */
  textColor?: string;
  /** Function to execute when the button is pressed. */
  onPress: () => void;
  /** If true, the button is visually disabled and interactions are disabled. */
  disabled?: boolean;
  /** Accessibility label for screen readers. */
  accessibilityLabel?: string;
};
