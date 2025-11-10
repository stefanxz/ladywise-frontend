import { render, screen } from "@testing-library/react-native";
import React from "react";
import RiskCard from "./RiskCard"; // Adjust path as needed

describe("RiskCard", () => {
  const baseProps = {
    title: "Heart Rate",
    level: "Low" as const, // Use 'as const' for type safety
    description: "Your resting heart rate is normal.",
  };

  it("should render the title, level, and description", () => {
    render(<RiskCard {...baseProps} />);

    expect(screen.getByText(baseProps.title)).toBeTruthy();
    expect(screen.getByText(baseProps.level)).toBeTruthy();
    expect(screen.getByText(baseProps.description)).toBeTruthy();
  });

  // Test the conditional styling logic
  it.each([
    ["Low", "text-green-500"],
    ["Medium", "text-yellow-500"],
    ["High", "text-red-500"],
  ])("should apply correct color for %s level", (level, expectedClass) => {
    render(
      <RiskCard {...baseProps} level={level as "Low" | "Medium" | "High"} />,
    );

    const levelElement = screen.getByText(level);

    // In React Native testing, we inspect props on the element.
    // We confirm the dynamic class string is being correctly assigned.
    expect(levelElement.props.className).toContain(expectedClass);
  });
});
