/**
 * Props for the PasswordField component.
 */
export interface PasswordFieldProps {
  /** Label text displayed above the input. */
  label: string;
  /** Current value of the password input. */
  value: string;
  /** Callback function to handle text changes. */
  onChangeText: (t: string) => void;
  /** Optional placeholder text. */
  placeholder?: string;
  /** Error message to display below the input. */
  error?: string | null;
  /** Test ID for testing purposes. */
  testID?: string;
}
