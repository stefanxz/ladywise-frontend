import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { render } from "@testing-library/react-native";
import React from "react";

it("updates progress when currentStep changes", () => {
  const { getByTestId } = render(
    <ProgressBar currentStep={1} totalSteps={5}/>
  );

  const progressBarFill = getByTestId("progress-bar-progress");
  expect(progressBarFill.props.style.width).toBe("20%");

  // Update currentStep to 3
  const { getByTestId: getByTestIdUpdated } = render(
    <ProgressBar currentStep={3} totalSteps={5}/>
  );

  const updatedProgressBarFill = getByTestIdUpdated("progress-bar-progress");
  expect(updatedProgressBarFill.props.style.width).toBe("60%");
});