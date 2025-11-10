import { RiskData } from "@/lib/types/health";
import { render, screen } from "@testing-library/react-native";
import React from "react";
import InsightsSection from "./InsightsSection";
import { View, Text } from "react-native";

jest.mock("../RiskCard/RiskCard", () => {
  // Use a requireActual mock to get the props but render a simple View
  const { View, Text } = require("react-native");
  return (props: any) => (
    <View testID="mock-risk-card">
      <Text>{props.title}</Text>
    </View>
  );
});

// Mock data
const mockInsights: RiskData[] = [
  { id: "1", title: "Risk 1", level: "Low", description: "Desc 1" },
  { id: "2", title: "Risk 2", level: "Medium", description: "Desc 2" },
  { id: "3", title: "Risk 3", level: "High", description: "Desc 3" },
];

describe("InsightsSection", () => {
  it("should render the section title", () => {
    render(<InsightsSection insights={[]} />);
    expect(screen.getByText("Your insights")).toBeTruthy();
  });

  it("should render no risk cards if insights are empty", () => {
    render(<InsightsSection insights={[]} />);

    // queryAllBy... returns [] if not found, avoiding an error
    expect(screen.queryAllByTestId("mock-risk-card")).toHaveLength(0);
  });

  it("should render one risk card if one insight is provided", () => {
    render(<InsightsSection insights={[mockInsights[0]]} />);

    expect(screen.getAllByTestId("mock-risk-card")).toHaveLength(1);
    expect(screen.getByText("Risk 1")).toBeTruthy(); // Verify correct data
  });

  // This is the key test for your slice(0, 2) logic
  it("should render only the first two risk cards if three or more are provided", () => {
    render(<InsightsSection insights={mockInsights} />);

    expect(screen.getAllByTestId("mock-risk-card")).toHaveLength(2);

    // Verify it rendered the *correct* two
    expect(screen.getByText("Risk 1")).toBeTruthy();
    expect(screen.getByText("Risk 2")).toBeTruthy();

    // Verify the third is excluded
    expect(screen.queryByText("Risk 3")).toBeNull();
  });
});
