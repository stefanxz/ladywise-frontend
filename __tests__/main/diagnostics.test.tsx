import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { AxiosError } from "axios";
import DiagnosticsScreen from "@/app/(main)/diagnostics";
import * as api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { RiskHistoryPoint } from "@/lib/types/risks";

// Mock dependencies
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  getRiskHistory: jest.fn(),
}));

jest.mock("react-native-chart-kit", () => ({
  LineChart: (props: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="mock-line-chart">
        <Text>{JSON.stringify(props.data)}</Text>
      </View>
    );
  },
}));

const mockUseAuth = useAuth as jest.Mock;
const mockGetRiskHistory = api.getRiskHistory as jest.Mock;

const mockHistory: RiskHistoryPoint[] = [
  {
    recordedAt: "2025-10-28T10:00:00Z",
    anemiaRisk: 1, // Medium
    thrombosisRisk: 0, // Low
    menstrualFlow: 2, // Normal
  },
  {
    recordedAt: "2025-10-30T10:00:00Z",
    anemiaRisk: 2, // High
    thrombosisRisk: 1, // Medium
    menstrualFlow: 2, // Normal
  },
];

describe("DiagnosticsScreen fetch behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to a logged-in state for all tests in this block
    mockUseAuth.mockReturnValue({
      token: "fake-token",
      userId: "fake-user-id",
    });
  });

  it("shows a loading indicator while fetching data", () => {
    // Mock a pending promise that never resolves to keep it in a loading state
    mockGetRiskHistory.mockReturnValue(new Promise(() => {}));
    render(<DiagnosticsScreen />);
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  it("renders charts with data when the fetch is successful", async () => {
    mockGetRiskHistory.mockResolvedValue(mockHistory);
    render(<DiagnosticsScreen />);

    // Wait for the loading to finish and the title to appear
    await waitFor(() => {
      expect(screen.getByText("Diagnostics")).toBeTruthy();
    });

    // Check that the charts are rendered
    expect(screen.getAllByTestId("mock-line-chart").length).toBe(3);

    // Check for the latest risk values displayed on the screen
    expect(screen.getByText("Thrombosis Risk")).toBeTruthy();
    expect(screen.getByText("Medium")).toBeTruthy(); // From the last entry: thrombosisRisk: 1

    expect(screen.getByText("Anemia Risk")).toBeTruthy();
    expect(screen.getByText("High")).toBeTruthy(); // From the last entry: anemiaRisk: 2
  });

  it("displays a fallback message and mock data if the API returns an empty array", async () => {
    mockGetRiskHistory.mockResolvedValue([]);
    render(<DiagnosticsScreen />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "No history data was found. Showing sample data for demonstration.",
        ),
      ).toBeTruthy();
    });

    // It should also render the charts with mock data.
    expect(screen.getAllByTestId("mock-line-chart").length).toBe(3);
  });

  it("displays a specific error and mock data on a failed fetch", async () => {
    mockGetRiskHistory.mockRejectedValue(new Error("Network error"));
    render(<DiagnosticsScreen />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(
          "An unexpected error occurred: Network error. Showing sample data.",
        ),
      ).toBeTruthy();
    });

    // Verify that it falls back to showing charts with mock data
    expect(screen.getAllByTestId("mock-line-chart").length).toBe(3);
  });

  it("displays a session expired error on 401 status and does not show charts", async () => {
    const error = new AxiosError("Unauthorized");
    error.response = { status: 401 } as any;
    mockGetRiskHistory.mockRejectedValue(error);

    render(<DiagnosticsScreen />);

    // Wait for the specific session expired error message
    await waitFor(() => {
      expect(
        screen.getByText("Your session has expired. Please log in again."),
      ).toBeTruthy();
    });

    // Ensure that no charts are rendered in this case
    expect(screen.queryAllByTestId("mock-line-chart").length).toBe(0);
  });
});
