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

it("handles single step case (totalSteps=1)", () => {
  const { getByTestId } = render(<ProgressBar currentStep={1} totalSteps={1} />);
  const progressBarFill = getByTestId("progress-bar-progress");
  // Logic: fraction = offset + (1 - 2*offset) * 0.5. With offset=0 => 0.5 => 50%
  expect(progressBarFill.props.style.width).toBe("50%");
});

it("clamps currentStep within bounds", () => {
  const { getByTestId, rerender } = render(<ProgressBar currentStep={0} totalSteps={5} />);
  const progressBarFill = getByTestId("progress-bar-progress");
  // Step 0 -> clamped to 1 -> 0%
  expect(progressBarFill.props.style.width).toBe("0%");

  rerender(<ProgressBar currentStep={10} totalSteps={5} />);
  // Step 10 -> clamped to 5 -> 100%
  expect(progressBarFill.props.style.width).toBe("100%");
});

it("handles edgeOffset clamping", () => {
  // Test negative offset -> clamped to 0
  const { getByTestId } = render(<ProgressBar currentStep={1} totalSteps={1} edgeOffset={-0.1} />);
  const progressBarFill = getByTestId("progress-bar-progress");
  expect(progressBarFill.props.style.width).toBe("50%"); // same as 0 offset
});
