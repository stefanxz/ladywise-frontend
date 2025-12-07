import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import ExtendedDiagnosticsScreen from "@/app/(main)/extended-diagnostics";
import { useLocalSearchParams, useRouter } from "expo-router";

// Mock dependencies
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
  Stack: {
    Screen: () => null, // Mock the Screen component
  },
}));

jest.mock("@/components/charts/RiskLineChart", () => ({
  RiskLineChart: (props: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="mock-risk-line-chart">
        <Text>{JSON.stringify(props.data)}</Text>
      </View>
    );
  },
}));

jest.mock("@/components/Diagnostics/FactorCard", () => {
  return (props: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="mock-factor-card">
        <Text>{props.title}</Text>
      </View>
    );
  };
});

const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

const mockRouter = {
  push: jest.fn(),
};

const mockParams = {
  conditionId: "anemia",
  title: "Anemia Risk",
  graphData: JSON.stringify({
    labels: ["W1", "W2", "W3", "W4"],
    data: [0, 1, 0, 1],
  }),
  currentRisk: "Medium",
};

describe("ExtendedDiagnosticsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    // Mock the timers for the setTimeout in the component
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders a loading indicator while fetching insights", () => {
    mockUseLocalSearchParams.mockReturnValue(mockParams);
    render(<ExtendedDiagnosticsScreen />);

    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    expect(screen.queryByText(/Based on your recent symptoms/)).toBeNull();
  });

  it("displays the correct title and current risk from params", async () => {
    mockUseLocalSearchParams.mockReturnValue(mockParams);
    render(<ExtendedDiagnosticsScreen />);

    // Wait for the insights to load
    await waitFor(() => jest.runAllTimers());

    expect(screen.getByText("Anemia Risk")).toBeTruthy();
    expect(screen.getByText("Medium")).toBeTruthy();
  });

  it("renders the risk chart with data from params", async () => {
    mockUseLocalSearchParams.mockReturnValue(mockParams);
    render(<ExtendedDiagnosticsScreen />);
    
    await waitFor(() => jest.runAllTimers());

    const chart = screen.getByTestId("mock-risk-line-chart");
    expect(chart).toBeTruthy();
    // Check if the data is passed correctly
    expect(chart.props.children.props.children).toBe(JSON.stringify(JSON.parse(mockParams.graphData).data));
  });

  it("displays fetched insights after loading", async () => {
    mockUseLocalSearchParams.mockReturnValue(mockParams);
    render(<ExtendedDiagnosticsScreen />);

    // Initially loading
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();

    // Fast-forward timers
    await waitFor(() => jest.runAllTimers());

    // Now insights should be visible
    expect(screen.queryByTestId("loading-indicator")).toBeNull();
    expect(screen.getByText(/Based on your recent symptoms/)).toBeTruthy();
  });

  it("renders factor cards", async () => {
    mockUseLocalSearchParams.mockReturnValue(mockParams);
    render(<ExtendedDiagnosticsScreen />);

    await waitFor(() => jest.runAllTimers());

    const factorCards = screen.getAllByTestId("mock-factor-card");
    expect(factorCards.length).toBeGreaterThan(0);
    expect(screen.getByText("Estrogen Pill")).toBeTruthy();
    expect(screen.getByText("Surgery or Severe Injury")).toBeTruthy();
  });

  it("handles navigation back to diagnostics screen", async () => {
    mockUseLocalSearchParams.mockReturnValue(mockParams);
    render(<ExtendedDiagnosticsScreen />);

    await waitFor(() => jest.runAllTimers());

    const backButton = screen.getByTestId("back-button"); // We need to add a testID to the TouchableOpacity
    fireEvent.press(backButton);
    expect(mockRouter.push).toHaveBeenCalledWith("/(main)/diagnostics");
  });

  it("shows a fallback message if graph data is missing", async () => {
    mockUseLocalSearchParams.mockReturnValue({
      ...mockParams,
      graphData: JSON.stringify({ labels: [], data: [] }),
    });
    render(<ExtendedDiagnosticsScreen />);

    await waitFor(() => jest.runAllTimers());

    expect(screen.getByText("No graph data available.")).toBeTruthy();
    expect(screen.queryByTestId("mock-risk-line-chart")).toBeNull();
  });
});
