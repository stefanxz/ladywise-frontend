import React from "react";
import { View } from "react-native";
import { ProgressBarProps } from "./ProgressBar.types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * ProgressBar
 *
 * A horizontal progress bar indicating completion status.
 * Used in questionnaires and multi-step forms.
 *
 * @param {ProgressBarProps} props - Component props
 * @param {number} props.currentStep - The current step number
 * @param {number} props.totalSteps - The total number of steps
 * @param {string} [props.testID] - Test ID
 * @param {number} [props.edgeOffset] - Visual offset correction
 * @returns {JSX.Element} The rendered progress bar
 */
export function ProgressBar({
  currentStep,
  totalSteps,
  testID = "progress-bar",
  edgeOffset = 0,
}: ProgressBarProps) {
  const normalizedOffset = clamp(edgeOffset, 0, 0.45);

  let fraction = 0;
  if (totalSteps <= 1) {
    fraction = normalizedOffset + (1 - 2 * normalizedOffset) * 0.5;
  } else {
    const stepIndex = clamp(currentStep, 1, totalSteps);
    const normalized = (stepIndex - 1) / (totalSteps - 1 || 1);
    fraction = normalizedOffset + normalized * (1 - 2 * normalizedOffset);
  }

  const percentage = clamp(Math.round(fraction * 100), 0, 100);

  return (
    <View className="w-full flex-row items-center gap-2.5">
      <View className="flex-1 rounded-full overflow-hidden bg-lightGrey h-1">
        <View
          className="h-full rounded-full bg-brand"
          testID={`${testID}-progress`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
