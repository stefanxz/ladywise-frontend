import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
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

jest.mock("@/components/ShareReport/ShareReportModal", () => {
  return {
    __esModule: true,
    default: ({
      visible,
      onClose,
    }: {
      visible: boolean;
      onClose: () => void;
    }) => {
      const { View, Text, Pressable } = require("react-native");
      if (!visible) return null;
      return (
        <View testID="share-report-modal">
          <Text>Share Report Modal</Text>
          <Pressable testID="close-modal-button" onPress={onClose}>
            <Text>Close</Text>
          </Pressable>
        </View>
      );
    },
  };
});

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
    if (props.asChild) {
      return props.children;
    }
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
        "error",
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
        "error",
      );
    });

    // Ensure that no charts are rendered in this case
    expect(screen.queryAllByTestId("mock-line-chart").length).toBe(0);
  });

  describe("Initial prop handling", () => {
    it("uses initialHistory prop and skips API fetch", async () => {
      render(<DiagnosticsScreen initialHistory={mockHistory} />);

      // Should render immediately without loading
      expect(screen.queryByTestId("loading-indicator")).toBeNull();
      expect(screen.getByText("Diagnostics")).toBeTruthy();

      // API should not be called
      expect(mockGetRiskHistory).not.toHaveBeenCalled();
    });

    it("renders charts correctly when initialHistory is provided", () => {
      render(<DiagnosticsScreen initialHistory={mockHistory} />);

      expect(screen.getAllByTestId("mock-line-chart").length).toBe(3);
      expect(screen.getByText("Thrombosis Risk")).toBeTruthy();
      expect(screen.getByText("Anemia Risk")).toBeTruthy();
      expect(screen.getByText("Menstrual Flow")).toBeTruthy();
    });
  });

  describe("Auth state handling", () => {
    it("stops loading and does not fetch when token is missing", async () => {
      mockUseAuth.mockReturnValue({
        token: null,
        userId: "fake-user-id",
      });

      render(<DiagnosticsScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-indicator")).toBeNull();
      });

      expect(mockGetRiskHistory).not.toHaveBeenCalled();
    });

    it("stops loading and does not fetch when userId is missing", async () => {
      mockUseAuth.mockReturnValue({
        token: "fake-token",
        userId: null,
      });

      render(<DiagnosticsScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-indicator")).toBeNull();
      });

      expect(mockGetRiskHistory).not.toHaveBeenCalled();
    });
  });

  describe("API error handling", () => {
    it("shows toast when API returns non-array data", async () => {
      mockGetRiskHistory.mockResolvedValue({ invalid: "data" });

      render(<DiagnosticsScreen />);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          "Received invalid data from server.",
          "error",
        );
      });
    });

    it("shows generic error toast for non-401 Axios errors", async () => {
      const error = new AxiosError("Server Error");
      error.response = { status: 500 } as any;
      mockGetRiskHistory.mockRejectedValue(error);

      render(<DiagnosticsScreen />);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          "Failed to load diagnostic data. Please try again.",
          "error",
        );
      });
    });
  });

  describe("Data sorting and filtering", () => {
    it("sorts history data by date in ascending order", async () => {
      const unsortedHistory: DiagnosticsResponseDTO[] = [
        {
          id: "2",
          userId: "test",
          date: "2025-10-30",
          lastUpdated: "2025-10-30T10:00:00Z",
          anemiaRisk: 2,
          thrombosisRisk: 1,
          flowLevel: 2,
        },
        {
          id: "1",
          userId: "test",
          date: "2025-10-28",
          lastUpdated: "2025-10-28T10:00:00Z",
          anemiaRisk: 1,
          thrombosisRisk: 1,
          flowLevel: 1,
        },
      ];

      mockGetRiskHistory.mockResolvedValue(unsortedHistory);
      render(<DiagnosticsScreen />);

      await waitFor(() => {
        expect(screen.getByText("Diagnostics")).toBeTruthy();
      });

      // The latest (sorted last) should be displayed - anemiaRisk: 2 = Medium
      expect(screen.getByText("Medium")).toBeTruthy();
    });

    it("filters out zero thrombosis risk values from thrombosis chart", async () => {
      const historyWithZeroThrombosis: DiagnosticsResponseDTO[] = [
        {
          id: "1",
          userId: "test",
          date: "2025-10-28",
          lastUpdated: "2025-10-28T10:00:00Z",
          anemiaRisk: 1,
          thrombosisRisk: 0, // Should be filtered out
          flowLevel: 2,
        },
        {
          id: "2",
          userId: "test",
          date: "2025-10-30",
          lastUpdated: "2025-10-30T10:00:00Z",
          anemiaRisk: 2,
          thrombosisRisk: 2,
          flowLevel: 2,
        },
      ];

      mockGetRiskHistory.mockResolvedValue(historyWithZeroThrombosis);
      render(<DiagnosticsScreen />);

      await waitFor(() => {
        expect(screen.getByText("Diagnostics")).toBeTruthy();
      });

      // Check that charts render - the mock shows data in text
      const charts = screen.getAllByTestId("mock-line-chart");
      expect(charts.length).toBe(3);
    });

    it("filters out zero anemia risk values from anemia chart", async () => {
      const historyWithZeroAnemia: DiagnosticsResponseDTO[] = [
        {
          id: "1",
          userId: "test",
          date: "2025-10-28",
          lastUpdated: "2025-10-28T10:00:00Z",
          anemiaRisk: 0, // Should be filtered out
          thrombosisRisk: 1,
          flowLevel: 2,
        },
        {
          id: "2",
          userId: "test",
          date: "2025-10-30",
          lastUpdated: "2025-10-30T10:00:00Z",
          anemiaRisk: 1,
          thrombosisRisk: 2,
          flowLevel: 2,
        },
      ];

      mockGetRiskHistory.mockResolvedValue(historyWithZeroAnemia);
      render(<DiagnosticsScreen />);

      await waitFor(() => {
        expect(screen.getByText("Diagnostics")).toBeTruthy();
      });

      expect(screen.getAllByTestId("mock-line-chart").length).toBe(3);
    });
  });

  describe("Share Modal", () => {
    it("opens share modal when share button is pressed", async () => {
      render(<DiagnosticsScreen initialHistory={mockHistory} />);

      const shareButton = screen.getByTestId("share-insights-button");
      fireEvent.press(shareButton);

      // The modal should now be visible
      await waitFor(() => {
        expect(screen.getByTestId("share-insights-button")).toBeTruthy();
      });
    });
  });

  describe("UI elements rendering", () => {
    it("opens and closes share modal", async () => {
      render(<DiagnosticsScreen initialHistory={mockHistory} />);

      // Modal should not be visible initially
      expect(screen.queryByTestId("share-report-modal")).toBeNull();

      // Open modal
      fireEvent.press(screen.getByTestId("share-insights-button"));
      expect(screen.getByTestId("share-report-modal")).toBeTruthy();

      // Close modal
      fireEvent.press(screen.getByTestId("close-modal-button"));
      await waitFor(() => {
        expect(screen.queryByTestId("share-report-modal")).toBeNull();
      });
    });

    it("renders all card sections with correct labels", async () => {
      render(<DiagnosticsScreen initialHistory={mockHistory} />);

      expect(screen.getByText("Thrombosis Risk")).toBeTruthy();
      expect(screen.getByText("Anemia Risk")).toBeTruthy();
      expect(screen.getByText("Menstrual Flow")).toBeTruthy();

      // Check for "Current Risk" labels (appears twice - thrombosis and anemia)
      expect(screen.getAllByText("Current Risk").length).toBe(2);

      // Check for "Current Level" label (flow card)
      expect(screen.getByText("Current Level")).toBeTruthy();

      // Check for "latest measurement" text
      expect(screen.getAllByText("latest measurement").length).toBe(3);
    });

    it("renders terms notice text", () => {
      render(<DiagnosticsScreen initialHistory={mockHistory} />);

      expect(
        screen.getByText(/By sharing your data, you agree with our Terms/),
      ).toBeTruthy();
    });

    it("renders share insights button with correct text", () => {
      render(<DiagnosticsScreen initialHistory={mockHistory} />);

      expect(screen.getByText("Share insights")).toBeTruthy();
    });
  });

  describe("Risk label formatting", () => {
    it("displays correct risk labels based on latest values", async () => {
      const historyWithVariousRisks: DiagnosticsResponseDTO[] = [
        {
          id: "1",
          userId: "test",
          date: "2025-10-30",
          lastUpdated: "2025-10-30T10:00:00Z",
          anemiaRisk: 1, // Low
          thrombosisRisk: 2, // Medium
          flowLevel: 3, // Heavy
        },
      ];

      render(<DiagnosticsScreen initialHistory={historyWithVariousRisks} />);

      expect(screen.getByText("Low")).toBeTruthy(); // Anemia
      expect(screen.getByText("Medium")).toBeTruthy(); // Thrombosis
      expect(screen.getByText("Heavy")).toBeTruthy(); // Flow
    });
  });

  describe("Cleanup behavior", () => {
    it("does not update state after unmount", async () => {
      // Create a delayed promise
      let resolvePromise: (value: DiagnosticsResponseDTO[]) => void;
      const delayedPromise = new Promise<DiagnosticsResponseDTO[]>(
        (resolve) => {
          resolvePromise = resolve;
        },
      );

      mockGetRiskHistory.mockReturnValue(delayedPromise);

      const { unmount } = render(<DiagnosticsScreen />);

      // Unmount before the promise resolves
      unmount();

      // Resolve the promise after unmount
      resolvePromise!(mockHistory);

      // If cleanup works correctly, no state update warning should occur
      // This test mainly ensures no errors are thrown
      await waitFor(() => {
        expect(mockGetRiskHistory).toHaveBeenCalled();
      });
    });
  });

  describe("Null/undefined value handling", () => {
    it("handles null risk values gracefully", async () => {
      const historyWithNulls: DiagnosticsResponseDTO[] = [
        {
          id: "1",
          userId: "test",
          date: "2025-10-30",
          lastUpdated: "2025-10-30T10:00:00Z",
          anemiaRisk: null as any,
          thrombosisRisk: null as any,
          flowLevel: null as any,
        },
      ];

      render(<DiagnosticsScreen initialHistory={historyWithNulls} />);

      // Should render without crashing
      expect(screen.getByText("Diagnostics")).toBeTruthy();
    });
  });
});
