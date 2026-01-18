/**
 * Properties for the FloatingAddButton component.
 */
export type FloatingAddButtonProps = {
  /**
   * The diameter of the button in pixels.
   * @default 56
   */
  size?: number;
  /**
   * The background color of the button.
   * Should contrast well with the `textColor`.
   */
  buttonColor?: string;
  /**
   * The color of the plus icon (+).
   */
  textColor?: string;
  /**
   * Callback function executed when the button is pressed.
   */
  onPress: () => void;
  /**
   * If true, the button is visually disabled (reduced opacity) and interactions are blocked.
   */
  disabled?: boolean;
  /**
   * Accessibility label for screen readers.
   * Important for users with visual impairments.
   */
  accessibilityLabel?: string;
};
