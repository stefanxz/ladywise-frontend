import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import DiagnosticsScreen from "@/app/(main)/diagnostics";
import * as api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

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

import { RiskHistoryPoint } from "@/lib/types/risks";
const mockUseAuth = useAuth as jest.Mock;
const mockedApi = api as jest.Mocked<typeof api>;

const mockHistory: RiskHistoryPoint[] = [
  {
    recordedAt: "2025-10-28T10:00:00Z",
    anemiaRisk: 1,
    thrombosisRisk: 0,
    menstrualFlow: 2,
  },
  {
    recordedAt: "2025-10-29T10:00:00Z",
    anemiaRisk: 1,
    thrombosisRisk: 1,
    menstrualFlow: 3,
  },
  {
    recordedAt: "2025-10-30T10:00:00Z",
    anemiaRisk: 2,
    thrombosisRisk: 1,
    menstrualFlow: 2,
  },
];

describe("DiagnosticsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to a successful state with a token
    mockUseAuth.mockReturnValue({
      token: "fake-token",
      userId: "fake-user-id",
    });
    // For now, let's use the mock data embedded in the component
    // mockedApi.getRiskHistory.mockResolvedValue(mockHistory);
  });

  // The component currently uses mock data internally, so these tests pass without mocking the API.
  // When the internal mock data is removed, these tests will correctly test the success state with the mocked API.
  describe("When data is available", () => {
    beforeEach(() => {
        mockedApi.getRiskHistory.mockResolvedValue(mockHistory);
    });

    it("renders the screen title", async () => {
      render(<DiagnosticsScreen history={mockHistory} />);
      await waitFor(() => expect(screen.getByText("Diagnostics")).toBeTruthy());
    });
  
    it("renders three line charts", async () => {
      render(<DiagnosticsScreen history={mockHistory} />);
      await waitFor(() => {
        const charts = screen.getAllByTestId("mock-line-chart");
        expect(charts.length).toBe(3);
      });
    });
  
    it("displays the thrombosis risk chart and latest value", async () => {
      render(<DiagnosticsScreen history={mockHistory} />);
      await waitFor(() => expect(screen.getByText("Thrombosis Risk")).toBeTruthy());
      expect(screen.getByText("Medium")).toBeTruthy(); // From the last entry in mockHistory
    });
  
    it("displays the anemia risk chart and latest value", async () => {
      render(<DiagnosticsScreen history={mockHistory} />);
      await waitFor(() => expect(screen.getByText("Anemia Risk")).toBeTruthy());
      expect(screen.getByText("High")).toBeTruthy(); // From the last entry in mockHistory
    });
  
    it("displays the menstrual flow chart and latest value", async () => {
      render(<DiagnosticsScreen history={mockHistory} />);
      await waitFor(() => expect(screen.getByText("Menstrual Flow")).toBeTruthy());
      expect(screen.getByText("Normal")).toBeTruthy(); // From the last entry in mockHistory
    });

    it("renders the scrollview", async () => {
        render(<DiagnosticsScreen history={mockHistory} />);
        await waitFor(() => expect(screen.getByTestId("diagnostics-scroll-view")).toBeTruthy());
    });
  });

});
