import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { render } from "@testing-library/react-native";
import React from "react";

it("updates progress when currentStep changes", () => {
  const { getByTestId, rerender } = render(
    <ProgressBar currentStep={1} totalSteps={5} />,
  );

  const progressBarFill = getByTestId("progress-bar-progress");
  expect(progressBarFill.props.style.width).toBe("0%");

  // Update currentStep to 3
  rerender(<ProgressBar currentStep={3} totalSteps={5} />);
  expect(progressBarFill.props.style.width).toBe("50%");

  // Update currentStep to 5
  rerender(<ProgressBar currentStep={5} totalSteps={5} />);
  expect(progressBarFill.props.style.width).toBe("100%");
});
