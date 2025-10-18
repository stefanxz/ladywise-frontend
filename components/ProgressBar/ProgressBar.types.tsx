export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
}