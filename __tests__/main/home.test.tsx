import Home from "@/app/(main)/home";
import * as api from "@/lib/api";
import { CycleStatusDTO } from "@/lib/types/cycle";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";

const mockUseAuth = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockSetPhase = jest.fn();
jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({
    theme: {
      gradientStart: "#FFF",
      gradientEnd: "#EEE",
      highlight: "#F00",
      highlightTextColor: "#FFF",
      cardColor: "#EEE",
      button: "#F00",
      buttonText: "#FFF",
    },
    setPhase: mockSetPhase,
  }),
}));

jest.mock("@/lib/api", () => ({
  getCycleStatus: jest.fn(),
  logPeriodStart: jest.fn(),
  setAuthToken: jest.fn(),
}));
const mockedApi = jest.mocked(api);

jest.mock("@/components/InsightsSection/InsightsSection", () => ({
  __esModule: true,
  default: () => {
    const { View } = require("react-native");
    return <View testID="mock-insights-section" />;
  },
}));

jest.mock("@/components/MainPageHeader/Header", () => ({
  __esModule: true,
  default: () => {
    const { View } = require("react-native");
    return <View testID="mock-header" />;
  },
}));
jest.mock("@/components/CalendarStrip/CalendarStrip", () => ({
  __esModule: true,
  default: () => {
    const { View } = require("react-native");
    return <View testID="mock-calendar-strip" />;
  },
}));
jest.mock("@/components/PhaseCard/PhaseCard", () => ({
  __esModule: true,
  default: () => {
    const { View } = require("react-native");
    return <View testID="mock-phase-card" />;
  },
}));

jest.mock("expo-router", () => ({
  useFocusEffect: (callback: () => void) => {
    const { useEffect } = require("react");
    useEffect(callback, []);
  },
}));
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
}));

const MOCK_STATUS_DTO: CycleStatusDTO = {
  currentCycleDay: 14,
  currentPhase: "OVULATION",
  nextEvent: "NEXT_PERIOD",
  daysUntilNextEvent: 14,
  nextEventDate: "2025-11-23",
  periodHistory: [],
  predictedPeriodDates: [],
  periodDates: ["2025-11-07", "2025-11-08"],
};

describe("Home Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isLoading: false,
      token: "fake-token",
    });
    mockedApi.getCycleStatus.mockResolvedValue(MOCK_STATUS_DTO);
  });

  it("shows loading indicator while auth is loading", () => {
    mockUseAuth.mockReturnValue({ isLoading: true, token: null });
    const { getByTestId } = render(<Home />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("shows loading indicator while fetching data (after auth is done)", () => {
    mockedApi.getCycleStatus.mockImplementation(() => new Promise(() => {}));
    const { getByTestId } = render(<Home />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("shows an error message if API call fails", async () => {
    mockedApi.getCycleStatus.mockRejectedValue(
      new Error("Failed to load data.")
    );
    const { findByText } = render(<Home />);
    expect(await findByText("Error: Failed to load data.")).toBeTruthy();
  });

  it("shows 'No cycle data' error if API throws a 404", async () => {
    mockedApi.getCycleStatus.mockRejectedValue({
      response: { status: 404 },
    });
    const { findByText } = render(<Home />);
    expect(
        await findByText("Error: No cycle data found. Please set up your cycle.")    
    ).toBeTruthy();
  });

  it("fetches data, updates theme, and renders components on success", async () => {
    const { findByTestId } = render(<Home />);

    await waitFor(() => {
      expect(mockedApi.getCycleStatus).toHaveBeenCalled();
    });

    expect(await findByTestId("mock-header")).toBeTruthy();
    expect(await findByTestId("mock-calendar-strip")).toBeTruthy();
    expect(await findByTestId("mock-phase-card")).toBeTruthy();
    expect(await findByTestId("mock-insights-section")).toBeTruthy();

    expect(mockSetPhase).toHaveBeenCalledWith("ovulation");
  });
});