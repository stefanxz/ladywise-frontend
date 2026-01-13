/**
 * Properties for the UnitInputField component.
 */
export interface UnitInputFieldProps {
  /** The unit string to display as a suffix (e.g., "kg", "cm"). */
  unit: string;
  /** The current numeric value as a string. */
  value: string;
  /** Callback function called when the text changes. */
  onChangeText: (text: string) => void;
  /** Placeholder text displayed when the input is empty. */
  placeholder?: string;
  /** Error message to display below the input field. */
  error?: string | null;
  /** Used to locate this view in end-to-end tests. */
  testID?: string;
}
