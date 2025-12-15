import React from "react";
import { render } from "@testing-library/react-native";
import { View } from "react-native";
import FactorCard from "./FactorCard";
import type { LucideIcon } from "lucide-react-native";

describe("FactorCard Component", () => {
  const MockIcon = (() => <View testID="mock-icon" />) as unknown as LucideIcon;

  const mockProps = {
    title: "Test Factor",
    value: "High Risk",
    description: "This is a test description",
    icon: MockIcon,
    variant: "default" as const,
  };

  it("renders the title, value, and description correctly", () => {
    const { getByText } = render(<FactorCard {...mockProps} />);

    expect(getByText("Test Factor")).toBeTruthy();
    expect(getByText("High Risk")).toBeTruthy();
    expect(getByText("This is a test description")).toBeTruthy();
  });
});
