/**
 * Props for the “Log period +” button.
 * 
 * This component is color-driven — it takes a background color and displays
 * a centered, rounded button with a text label and optional loading spinner.
 */
export interface LogNewPeriodButtonProps {
  // Background color of the button (e.g. '#e11d48' or 'rgb(59,130,246)')
  color: string;

  // Called when the user taps the button
  onPress: () => void;

  // Shows a spinner instead of the label and blocks presses
  loading?: boolean;

  // Disables the button and dims its appearance
  disabled?: boolean;

  // Text read by screen readers (defaults to 'Log period')
  accessibilityLabel?: string;

  // Test identifier for automated UI tests (defaults to 'log-new-period-button')
  testID?: string;
}