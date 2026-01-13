import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { AxiosError } from "axios";
import DiagnosticsScreen from "@/app/(main)/diagnostics/index";
import * as api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DiagnosticsResponseDTO } from "@/lib/types/diagnostics";

// Mock dependencies
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  getRiskHistory: jest.fn(),
}));

const mockShowToast = jest.fn();
jest.mock("@/hooks/useToast", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock("@/components/charts/RiskLineChart", () => ({
  RiskLineChart: (props: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="mock-line-chart">
        <Text>{JSON.stringify(props.data)}</Text>
      </View>
    );
  },
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
  Link: (props: any) => {
    // If asChild is true, render the children directly.
    // This is to correctly handle components like TouchableOpacity inside Link.
    if (props.asChild) {
      return props.children;
    }
    // For other cases, you might want a mock Link component.
    const { View } = require("react-native");
    return <View testID="mock-link">{props.children}</View>;
  },
  Stack: {
    Screen: () => null,
  },
  useFocusEffect: (effect: () => void) => {
    const React = require("react");
    React.useEffect(effect, []);
  },
}));

const mockUseAuth = useAuth as jest.Mock;
const mockGetRiskHistory = api.getRiskHistory as jest.Mock;

const mockHistory: DiagnosticsResponseDTO[] = [
  {
    id: "1",
    userId: "test",
    date: "2025-10-28",
    lastUpdated: "2025-10-28T10:00:00Z",
    anemiaRisk: 1, // Low
    thrombosisRisk: 0, // Unknown
    flowLevel: 2, // Normal
  },
  {
    id: "2",
    userId: "test",
    date: "2025-10-30",
    lastUpdated: "2025-10-30T10:00:00Z",
    anemiaRisk: 3, // High (was 2 which is Medium)
    thrombosisRisk: 1, // Low
    flowLevel: 2, // Normal
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
    mockGetRiskHistory.mockReturnValue(new Promise(() => { }));
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

    expect(screen.getByText("Thrombosis Risk")).toBeTruthy();
    expect(screen.getByText("Low")).toBeTruthy(); // From the last entry: thrombosisRisk: 1

    expect(screen.getByText("Anemia Risk")).toBeTruthy();
    expect(screen.getByText("High")).toBeTruthy(); // From the last entry: anemiaRisk: 2
  });

  it("displays an empty state if the API returns an empty array", async () => {
    mockGetRiskHistory.mockResolvedValue([]);
    render(<DiagnosticsScreen />);

    await waitFor(() => {
      expect(
        screen.getByText("No diagnostic data available yet."),
      ).toBeTruthy();
    });

    // It should NOT render the charts
    expect(screen.queryAllByTestId("mock-line-chart").length).toBe(0);
  });

  it("displays a specific error toast and no charts on a failed fetch", async () => {
    mockGetRiskHistory.mockRejectedValue(new Error("Network error"));
    render(<DiagnosticsScreen />);

    // Wait for the loading to finish (should hide invalid data toast if any, but here we expect error toast)
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "An unexpected error occurred. Please try again.",
        "error"
      );
    });

    // Verify that it does NOT show charts
    expect(screen.queryAllByTestId("mock-line-chart").length).toBe(0);
  });

  it("displays a session expired toast on 401 status", async () => {
    const error = new AxiosError("Unauthorized");
    error.response = { status: 401 } as any;
    mockGetRiskHistory.mockRejectedValue(error);

    render(<DiagnosticsScreen />);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "Your session has expired. Please log in again.",
        "error"
      );
    });

    // Ensure that no charts are rendered in this case
    expect(screen.queryAllByTestId("mock-line-chart").length).toBe(0);
  });
});
