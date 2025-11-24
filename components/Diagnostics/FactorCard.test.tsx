import React from "react";
import { render } from "@testing-library/react-native";
import { View } from "react-native";
import FactorCard from "./FactorCard";

describe("FactorCard Component", () => {
  // Create a dummy component to mock the Vector Icon
  const MockIcon = () => <View testID="mock-icon" />;

  const mockProps = {
    title: "Test Factor",
    value: "High Risk",
    description: "This is a test description",
    icon: MockIcon, // Pass the component, NOT an object
    variant: "default" as const,
  };

  it("renders the title, value, and description correctly", () => {
    const { getByText } = render(<FactorCard {...mockProps} />);

    expect(getByText("Test Factor")).toBeTruthy();
    expect(getByText("High Risk")).toBeTruthy();
    expect(getByText("This is a test description")).toBeTruthy();
  });
});
