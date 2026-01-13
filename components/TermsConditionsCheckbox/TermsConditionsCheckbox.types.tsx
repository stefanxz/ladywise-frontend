/**
 * Properties for the TermsConditionsCheckbox component.
 */
export interface TermsConditionsCheckboxProps {
  /** Whether the checkbox is currently checked. */
  checked: boolean;
  /** Callback function to toggle the checked state. */
  onToggle: () => void;
  /** Callback function to open the Terms and Conditions full display (e.g. modal). */
  openSheet: () => void;
}
