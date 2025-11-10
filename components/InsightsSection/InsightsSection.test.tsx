import React from "react";
import { render, screen } from "@testing-library/react-native";
import InsightsSection from "./InsightsSection";
import { RiskData } from "@/lib/types/risks";

jest.mock("../RiskCard/RiskCard", () => {
  // Use a requireActual mock to get the props but render a simple View
  const { View, Text } = require("react-native");
  const MockRiskCard = (props: any) => (
    <View testID="mock-risk-card">
      <Text>{props.title}</Text>
    </View>
  );
  return MockRiskCard;
});

// Mock data for the success case
const MOCK_INSIGHTS: RiskData[] = [
  {
    id: "1",
    title: "Thrombosis Risk",
    level: "Medium",
    description: "Some factors may raise clotting risk.",
  },
  {
    id: "2",
    title: "Anemia Risk",
    level: "Low",
    description: "Iron levels appear sufficient.",
  },
];

describe("InsightsSection", () => {
  // Test Case 1: The new loading state
  it("renders an ActivityIndicator when isLoading is true", () => {
    render(<InsightsSection insights={[]} isLoading={true} />);

    // Query by the testID you just added
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();

    // Check that data-related elements are NOT visible
    expect(screen.queryByText("No insights available.")).toBeNull();
    expect(screen.queryByTestId("mock-risk-card")).toBeNull();
  });

  // Test Case 2: The empty state (after loading)
  it("renders the empty message when isLoading is false and insights are empty", () => {
    render(<InsightsSection insights={[]} isLoading={false} />);

    // Check that the empty message is visible
    expect(screen.getByText("No insights available.")).toBeTruthy();

    // Update the query to match the new testID
    expect(screen.queryByTestId("loading-indicator")).toBeNull();
    expect(screen.queryByTestId("mock-risk-card")).toBeNull();
  });

  // Test Case 3: The data state (after loading)
  it("renders RiskCards when isLoading is false and insights are provided", () => {
    render(<InsightsSection insights={MOCK_INSIGHTS} isLoading={false} />);

    // Check that the correct cards are rendered
    expect(screen.getAllByTestId("mock-risk-card")).toHaveLength(2);
    expect(screen.getByText("Thrombosis Risk")).toBeTruthy();
    expect(screen.getByText("Anemia Risk")).toBeTruthy();

    // Update the query to match the new testID
    expect(screen.queryByTestId("loading-indicator")).toBeNull();
    expect(screen.queryByText("No insights available.")).toBeNull();
  });

  it("renders only the first two insights if more are provided", () => {
    const threeInsights: RiskData[] = [
      ...MOCK_INSIGHTS,
      {
        id: "3",
        title: "Third Risk",
        level: "High",
        description: "A third item.",
      },
    ];
    render(<InsightsSection insights={threeInsights} isLoading={false} />);

    // Your component logic has .slice(0, 2), so it should only render two.
    expect(screen.getAllByTestId("mock-risk-card")).toHaveLength(2);
    expect(screen.queryByText("Third Risk")).toBeNull();
  });
});
