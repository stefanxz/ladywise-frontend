/**
 * Properties for the ProgressBar component.
 */
export interface ProgressBarProps {
  /** The current step number (1-based). */
  currentStep: number;
  /** The total number of steps. */
  totalSteps: number;
  /** Optional Test ID for testing. Defaults to 'progress-bar'. */
  testID?: string;
  /** Visual offset correction for the progress calculation. */
  edgeOffset?: number;
}
