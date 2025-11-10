import Home from "@/app/(main)/home";
import * as api from "@/lib/api";
import { CycleStatusDTO } from "@/lib/types/cycle";
import { render, waitFor, screen } from "@testing-library/react-native";
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

jest.mock("@/components/PhaseCard/PhaseCard", () => ({
  __esModule: true,
  default: ({ phaseName, dayOfPhase, subtitle }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="mock-phase-card">
        <Text>{phaseName}</Text>
        <Text>{dayOfPhase}</Text>
        <Text>{subtitle}</Text>
      </View>
    );
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

  it("shows empty state with neutral theme when API throws a 404", async () => {
    mockedApi.getCycleStatus.mockRejectedValue({
      response: { status: 404 },
    });
    
    const { findByText, queryByText } = render(<Home />);

    // 1. Verify the neutral theme was set
    await waitFor(() => {
      expect(mockSetPhase).toHaveBeenCalledWith("neutral");
    });

    // 2. Verify the correct "empty state" text is shown
    expect(await findByText("Hello!")).toBeTruthy();
    expect(await findByText("Log your first period to begin tracking.")).toBeTruthy();

    expect(screen.getByTestId("mock-header")).toBeTruthy();
    expect(screen.getByTestId("mock-calendar-strip")).toBeTruthy();
    expect(screen.getByTestId("mock-insights-section")).toBeTruthy();

    // 4. Verify the ERROR message is NOT present
    expect(queryByText(/Error:/)).toBeNull();
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

  describe("Task #642: Phase Colors and Day Calculation", () => {
    it("correctly sets Menstrual phase color and Day 1", async () => {
      mockedApi.getCycleStatus.mockResolvedValue({
        ...MOCK_STATUS_DTO,
        currentPhase: "MENSTRUAL",
        currentCycleDay: 1,
        daysUntilNextEvent: 13,
        nextEvent: "NEXT_OVULATION",
      });

      const { findByText } = render(<Home />);

      // Verify correct theme/color was set
      await waitFor(() => {
        expect(mockSetPhase).toHaveBeenCalledWith("menstrual");
      });

      // Verify correct day calculation passed to PhaseCard
      expect(await findByText("Day 1")).toBeTruthy();
      expect(await findByText("Menstrual Phase")).toBeTruthy();
    });

    it("correctly sets Luteal phase color and late cycle day", async () => {
      mockedApi.getCycleStatus.mockResolvedValue({
        ...MOCK_STATUS_DTO,
        currentPhase: "LUTEAL",
        currentCycleDay: 26,
        daysUntilNextEvent: 2,
        nextEvent: "NEXT_PERIOD",
      });

      const { findByText } = render(<Home />);

      // Verify Luteal theme
      await waitFor(() => {
        expect(mockSetPhase).toHaveBeenCalledWith("luteal");
      });

      // Verify Day 26 calculation
      expect(await findByText("Day 26")).toBeTruthy();
      expect(await findByText("Luteal Phase")).toBeTruthy();
    });

    it("correctly handles new cycle wrap-around (Day 2 of next cycle)", async () => {
      // Simulate a user who has entered a new cycle
      mockedApi.getCycleStatus.mockResolvedValue({
        ...MOCK_STATUS_DTO,
        currentPhase: "MENSTRUAL",
        currentCycleDay: 2,
        daysUntilNextEvent: 12,
        nextEvent: "NEXT_OVULATION",
         // Ensure periodDates includes today for visual accuracy in calendar
        periodDates: ["2025-11-08", "2025-11-09", "2025-11-10"],
      });

      const { findByText } = render(<Home />);

      // Should be back to menstrual theme
      await waitFor(() => {
        expect(mockSetPhase).toHaveBeenCalledWith("menstrual");
      });

      // Verify it calculated Day 2 of the NEW cycle
      expect(await findByText("Day 2")).toBeTruthy();
    });
  });
});