import React from "react";
import { render, screen } from "@testing-library/react-native";
import InsightsSection from "./InsightsSection";
import { RiskData } from "@/lib/types/risks";

// Mock the child component to isolate the test
jest.mock("../RiskCard/RiskCard", () => {
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
  // Test Case 1: Initial Loading state (fetching from DB)
  it("renders the initial loading message when isLoading is true", () => {
    render(<InsightsSection insights={[]} isLoading={true} />);

    // Check for the specific loading message
    expect(screen.getByText("Loading health profile...")).toBeTruthy();

    // Check that other elements are NOT visible
    expect(screen.queryByText("No insights yet")).toBeNull();
    expect(screen.queryByTestId("mock-risk-card")).toBeNull();
  });

  // Test Case 2: Calculating state (AI processing)
  it("renders the analyzing message when isCalculating is true", () => {
    // Note: isLoading should be false here usually
    render(
      <InsightsSection insights={[]} isLoading={false} isCalculating={true} />,
    );

    // Check for the specific analyzing message
    expect(screen.getByText("Analyzing latest data...")).toBeTruthy();

    // Check that other elements are NOT visible
    expect(screen.queryByText("Loading health profile...")).toBeNull();
  });

  // Test Case 3: The empty state (after loading, no data)
  it("renders the empty message when not loading/calculating and insights are empty", () => {
    render(
      <InsightsSection insights={[]} isLoading={false} isCalculating={false} />,
    );

    // Check that the empty message is visible
    expect(screen.getByText("No insights yet")).toBeTruthy();
    expect(
      screen.getByText(
        "Log your daily symptoms to generate your risk profile.",
      ),
    ).toBeTruthy();

    expect(screen.queryByTestId("mock-risk-card")).toBeNull();
  });

  // Test Case 4: The data state (success)
  it("renders RiskCards when data is present", () => {
    render(<InsightsSection insights={MOCK_INSIGHTS} isLoading={false} />);

    // Check that the correct cards are rendered
    expect(screen.getAllByTestId("mock-risk-card")).toHaveLength(2);
    expect(screen.getByText("Thrombosis Risk")).toBeTruthy();
    expect(screen.getByText("Anemia Risk")).toBeTruthy();

    // Ensure loading/empty states are gone
    expect(screen.queryByText("Loading health profile...")).toBeNull();
    expect(screen.queryByText("No insights yet")).toBeNull();
  });

  // Test Case 5: Priority of states
  it("prioritizes loading over empty state", () => {
    render(
      <InsightsSection insights={[]} isLoading={true} isCalculating={false} />,
    );
    expect(screen.getByText("Loading health profile...")).toBeTruthy();
    expect(screen.queryByText("No insights yet")).toBeNull();
  });

  it("prioritizes calculating over empty state", () => {
    render(
      <InsightsSection insights={[]} isLoading={false} isCalculating={true} />,
    );
    expect(screen.getByText("Analyzing latest data...")).toBeTruthy();
    expect(screen.queryByText("No insights yet")).toBeNull();
  });
});
