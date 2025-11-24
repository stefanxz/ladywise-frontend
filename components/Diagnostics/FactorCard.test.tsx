import React from "react";
import { render } from "@testing-library/react-native";
import FactorCard from "@/components/Diagnostics/FactorCard";

describe("FactorCard Component", () => {
  const mockProps = {
    title: "Test Factor",
    value: "High Risk",
    description: "This is a test description",
    icon: { uri: "mock-icon-url" }, // Mock image source
    variant: "default" as const,
  };

  it("renders the title, value, and description correctly", () => {
    const { getByText } = render(<FactorCard {...mockProps} />);

    expect(getByText("Test Factor")).toBeTruthy();
    expect(getByText("High Risk")).toBeTruthy();
    expect(getByText("This is a test description")).toBeTruthy();
  });
});