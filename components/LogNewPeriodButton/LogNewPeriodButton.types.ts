import { StyleProp, ViewStyle } from "react-native";

/**
 * Props for the “Log period +” button.
 *
 * This component takes a background color and displays
 * a centered, rounded button with a text label and optional loading spinner.
 */
/**
 * Properties for the LogNewPeriodButton component.
 */
export interface LogNewPeriodButtonProps {
  /** Background color of the button. */
  color: string;
  /** Called when the user taps the button. */
  onPress: () => void;
  /** Shows a spinner instead of the label and blocks presses. */
  loading?: boolean;
  /** Disables the button and dims its appearance. */
  disabled?: boolean;
  /** Text read by screen readers (defaults to 'Log period'). */
  accessibilityLabel?: string;
  /** Test identifier for automated UI tests (defaults to 'log-new-period-button'). */
  testID?: string;
  /** Additional style for the button container. */
  style?: StyleProp<ViewStyle>;
}
