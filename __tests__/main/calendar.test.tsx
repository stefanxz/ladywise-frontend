import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import CalendarScreen from "@/app/(main)/calendar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  getCycleStatus,
  getPeriodHistory,
  getPredictions,
  logNewPeriod,
  updatePeriod,
  deletePeriod,
} from "@/lib/api";
import { format, addDays, subDays, startOfDay } from "date-fns";
import { useLocalSearchParams } from "expo-router";

/**
 * Calendar Screen Integration Tests
 * These tests ensure the UI components (buttons, tooltips, calendar grid)
 * correctly trigger the underlying logic hooks
 */

// Setup and mocks
jest.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock("@/context/ToastContext", () => ({
  ToastContext: {
    Provider: ({ children }: any) => children,
  },
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

// Suppress specific "not wrapped in act" warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("not wrapped in act"))
      return;
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

// Context and API mocks
jest.mock("@/context/AuthContext");
jest.mock("@/context/ThemeContext");
jest.mock("@/lib/api");
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

// Calendar helpers (mocked to control FlatList data generation)
jest.mock("@/utils/calendarHelpers", () => {
  const { addDays } = require("date-fns");
  return {
    generateDateSet: jest.fn(() => new Set()),
    
    // We manually parse "YYYY-MM-DD" to (year, month, day) integers
    parseToLocalWithoutTime: jest.fn((dateString) => {
      if (!dateString) return new Date();
      const [year, month, day] = dateString.split("-").map(Number);
      // Month is 0-indexed in JS Date constructor (0 = Jan)
      return new Date(year, month - 1, day);
    }),

    safeFetch: jest.fn((promise) => promise),
    generateMonths: jest.fn((start, count) =>
      Array.from({ length: count }, (_, i) => ({
        id: `month-${i}`,
        date: start ? addDays(start, i * 30) : new Date(),
      })),
    ),
  };
});

// UI components mocks
jest.mock("@/components/Calendar/CalendarHeader", () => "CalendarHeader");
jest.mock("@/components/FloatingAddButton/FloatingAddButton", () => ({
  FloatingAddButton: "FloatingAddButton",
}));

// Button mock
// needed to find the button by text/testID
jest.mock("@/components/LogNewPeriodButton/LogNewPeriodButton", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return ({ onPress }: any) => (
    <TouchableOpacity onPress={onPress} testID="log-period-button">
      <Text>Log New Period</Text>
    </TouchableOpacity>
  );
});

// Tooltip mock
// needed to simulate edit/delete actions
jest.mock("@/components/Calendar/EditDeleteTooltip", () => {
  const { View, TouchableOpacity, Text } = require("react-native");
  return ({ visible, onEditPeriod, onDelete }: any) => {
    if (!visible) return null;
    return (
      <View testID="tooltip-container">
        <TouchableOpacity onPress={onEditPeriod} testID="tooltip-edit">
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} testID="tooltip-delete">
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

// CalendarMonth functional mock
// Renders simple buttons for "Yesterday", "Today", "Tomorrow" to simulate date clicks
jest.mock("@/components/Calendar/CalendarMonth", () => {
  const { TouchableOpacity, Text, View } = require("react-native");
  const { addDays, subDays } = require("date-fns");

  return ({ onPress, today, item }: any) => (
    <View testID={`month-view-${item.id}`}>
      <TouchableOpacity
        testID="day-today"
        onPress={() => onPress(today, { x: 100, y: 100 })}
      >
        <Text>Today</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="day-yesterday"
        onPress={() => onPress(subDays(today, 1), { x: 100, y: 100 })}
      >
        <Text>Yesterday</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="day-tomorrow"
        onPress={() => onPress(addDays(today, 1), { x: 100, y: 100 })}
      >
        <Text>Tomorrow</Text>
      </TouchableOpacity>
    </View>
  );
});

// Spy on Alert to test confirmation dialogs and validation errors
jest.spyOn(Alert, "alert");

beforeEach(() => {
  (useLocalSearchParams as jest.Mock).mockResolvedValue({});
});

// Tests

describe("CalendarScreen", () => {
  const mockToken = "mock-token";
  const mockSetPhase = jest.fn();
  const today = startOfDay(new Date());

  const mockPeriodHistory = [
    {
      id: "period-old",
      startDate: format(subDays(today, 10), "yyyy-MM-dd"),
      endDate: format(subDays(today, 6), "yyyy-MM-dd"),
    },
  ];

  const mockPredictions = [{ startDate: "2025-01-01", endDate: "2025-01-05" }];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup for contexts
    (useAuth as jest.Mock).mockReturnValue({
      token: mockToken,
      isLoading: false,
    });

    (useTheme as jest.Mock).mockReturnValue({
      theme: { highlight: "#FCA5A5" },
      setPhase: mockSetPhase,
    });

    // Setup for the API responses
    (getCycleStatus as jest.Mock).mockResolvedValue({
      currentPhase: "follicular",
    });
    (getPeriodHistory as jest.Mock).mockResolvedValue(mockPeriodHistory);
    (getPredictions as jest.Mock).mockResolvedValue(mockPredictions);
  });

  describe("Initial Rendering", () => {
    it("should fetch data and render list on mount", async () => {
      const { getByTestId } = render(<CalendarScreen />);

      // Wait for hooks to fire data fetching
      await waitFor(() => {
        expect(getPeriodHistory).toHaveBeenCalled();
        expect(getPredictions).toHaveBeenCalled();
      });

      // Check if the list exists
      expect(getByTestId("calendar-list")).toBeTruthy();

      // Check if theme phase was updated
      expect(mockSetPhase).toHaveBeenCalledWith("follicular");
    });
  });

  describe("Logging New Period (Happy Path)", () => {
    it("should allow user to enter log mode, select dates, and save", async () => {
      (logNewPeriod as jest.Mock).mockResolvedValue({ success: true });
      const { getByTestId, getAllByTestId, getByText, queryByText } = render(
        <CalendarScreen />,
      );

      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Enter log mode
      fireEvent.press(getByTestId("log-period-button"));

      await waitFor(() => {
        expect(getByText("Cancel")).toBeTruthy();
        expect(getByText("Save")).toBeTruthy();
      });

      // Select dates (start: yesterday, end: today)
      // Note: we use [0] because FlatList renders multiple months, so multiple "Today" buttons exist
      fireEvent.press(getAllByTestId("day-yesterday")[0]);
      fireEvent.press(getAllByTestId("day-today")[0]);

      // Press save
      fireEvent.press(getByText("Save"));

      // Verify the API payload
      await waitFor(() => {
        expect(logNewPeriod).toHaveBeenCalledWith({
          startDate: format(subDays(today, 1), "yyyy-MM-dd"),
          endDate: format(today, "yyyy-MM-dd"),
        });
      });

      // Verify UI reset
      await waitFor(() => {
        expect(queryByText("Save")).toBeNull();
      });
    });

    it("should handle ongoing period logging", async () => {
      (logNewPeriod as jest.Mock).mockResolvedValue({ success: true });
      const { getByTestId, getAllByTestId, getByText } = render(
        <CalendarScreen />,
      );

      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Open the log mode
      fireEvent.press(getByTestId("log-period-button"));
      await waitFor(() => getByText("Mark as ongoing"));

      // Check the ongoing box
      fireEvent.press(getByText("Mark as ongoing"));

      // Select start date only
      fireEvent.press(getAllByTestId("day-today")[0]);

      // Save
      fireEvent.press(getByText("Save"));

      // Verify payload sends null endDate
      await waitFor(() => {
        expect(logNewPeriod).toHaveBeenCalledWith({
          startDate: format(today, "yyyy-MM-dd"),
          endDate: null,
        });
      });
    });
  });

  describe("Interactions & Validation", () => {
    it("should alert if saving without a start date", async () => {
      const { getByTestId, getByText } = render(<CalendarScreen />);
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      fireEvent.press(getByTestId("log-period-button"));
      await waitFor(() => getByText("Save"));

      // Click save without picking a date
      fireEvent.press(getByText("Save"));

      expect(Alert.alert).toHaveBeenCalledWith(
        "Just a quick check!",
        expect.stringContaining("need a start date"),
      );
      expect(logNewPeriod).not.toHaveBeenCalled();
    });

    it("should prevent selection of future dates", async () => {
      const { getByTestId, getAllByTestId, getByText } = render(
        <CalendarScreen />,
      );
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      fireEvent.press(getByTestId("log-period-button"));
      await waitFor(() => getByText("Save"));

      // Try to click future date
      fireEvent.press(getAllByTestId("day-tomorrow")[0]);

      // Click save
      fireEvent.press(getByText("Save"));

      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe("Editing & Deleting", () => {
    const periodOnToday = [
      {
        id: "period-today",
        startDate: format(today, "yyyy-MM-dd"),
        endDate: format(today, "yyyy-MM-dd"),
      },
    ];

    it("should open tooltip and allow deletion", async () => {
      // Mock that we have a period today
      (getPeriodHistory as jest.Mock).mockResolvedValue(periodOnToday);
      (deletePeriod as jest.Mock).mockResolvedValue({ success: true });

      const { getByTestId, getAllByTestId, queryByTestId } = render(
        <CalendarScreen />,
      );
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Tap on today (existing period)
      fireEvent.press(getAllByTestId("day-today")[0]);

      // Verify Tooltip appears
      await waitFor(() =>
        expect(getByTestId("tooltip-container")).toBeTruthy(),
      );

      // Press Delete
      fireEvent.press(getByTestId("tooltip-delete"));

      // Confirm Alert
      const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const deleteAction = alertButtons.find((b: any) => b.text === "Delete");

      await act(async () => {
        await deleteAction.onPress();
      });

      // Verify API call
      expect(deletePeriod).toHaveBeenCalledWith("period-today");
    });

    it("should open tooltip and enter edit mode", async () => {
      (getPeriodHistory as jest.Mock).mockResolvedValue(periodOnToday);
      (updatePeriod as jest.Mock).mockResolvedValue({ success: true });

      const { getByTestId, getAllByTestId, getByText } = render(
        <CalendarScreen />,
      );
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Tap Period -> Edit
      fireEvent.press(getAllByTestId("day-today")[0]);
      await waitFor(() => expect(getByTestId("tooltip-edit")).toBeTruthy());
      fireEvent.press(getByTestId("tooltip-edit"));

      // Verify we are in Edit Mode (Save button visible)
      await waitFor(() => {
        expect(getByText("Save")).toBeTruthy();
      });

      // Change date to Yesterday
      fireEvent.press(getAllByTestId("day-yesterday")[0]);
      fireEvent.press(getByText("Save"));

      // Verify the update API call
      await waitFor(() => {
        expect(updatePeriod).toHaveBeenCalledWith(
          "period-today",
          expect.objectContaining({
            startDate: format(subDays(today, 1), "yyyy-MM-dd"),
          }),
        );
      });
    });
  });

  describe("Infinite Scroll Integration", () => {
    it("should trigger loading when reaching end of list", async () => {
      const { getByTestId } = render(<CalendarScreen />);
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      const list = getByTestId("calendar-list");

      // Simulate Scroll
      fireEvent(list, "onEndReached");

      // Check if helper was called (via useCalendarPagination hook)
      await waitFor(() => {
        // Called once on init, once on scroll
        expect(
          require("@/utils/calendarHelpers").generateMonths,
        ).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("URL Parameters", () => {
    it("should start in log mode when log-mode=true parameter is present", async () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        "log-mode": "true",
      });

      const { getByText, queryByTestId } = render(<CalendarScreen />);

      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Verify log mode UI is visible on initial render
      expect(getByText("Cancel")).toBeTruthy();
      expect(getByText("Save")).toBeTruthy();
      expect(getByText("Mark as ongoing")).toBeTruthy();

      // Verify the normal mode button is NOT visible
      expect(queryByTestId("log-period-button")).toBeNull();
    });

    it("should start in normal mode when log-mode parameter is absent", async () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({});

      const { getByTestId, queryByText } = render(<CalendarScreen />);

      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Verify normal mode UI is visible
      expect(getByTestId("log-period-button")).toBeTruthy();

      // Verify log mode UI is NOT visible
      expect(queryByText("Mark as ongoing")).toBeNull();
      expect(queryByText("Cancel")).toBeNull();
    });

    it("should start in normal mode when log-mode=false", async () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        "log-mode": "false",
      });

      const { getByTestId, queryByText } = render(<CalendarScreen />);

      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Verify normal mode UI is visible
      expect(getByTestId("log-period-button")).toBeTruthy();

      // Verify log mode UI is NOT visible
      expect(queryByText("Mark as ongoing")).toBeNull();
    });

    it("should allow user to save period when starting from URL parameter", async () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        "log-mode": "true",
      });
      (logNewPeriod as jest.Mock).mockResolvedValue({ success: true });

      const { getAllByTestId, getByText } = render(<CalendarScreen />);

      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // Select dates
      fireEvent.press(getAllByTestId("day-yesterday")[0]);
      fireEvent.press(getAllByTestId("day-today")[0]);

      // Save
      fireEvent.press(getByText("Save"));

      // Verify API was called correctly
      await waitFor(() => {
        expect(logNewPeriod).toHaveBeenCalledWith({
          startDate: format(subDays(today, 1), "yyyy-MM-dd"),
          endDate: format(today, "yyyy-MM-dd"),
        });
      });
    });
  });
  describe("Additional Edge Cases & UI Logic", () => {
    it("should exit log mode and reset UI when Cancel is pressed", async () => {
      const { getByTestId, getByText, queryByText } = render(<CalendarScreen />);
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // enter Log Mode
      fireEvent.press(getByTestId("log-period-button"));

      // verify Cancel button exists
      await waitFor(() => expect(getByText("Cancel")).toBeTruthy());

      fireEvent.press(getByText("Cancel"));

      // checkk UI reset: Save button gone, Log button back
      await waitFor(() => {
        expect(queryByText("Save")).toBeNull();
        expect(getByTestId("log-period-button")).toBeTruthy();
      });
    });

    it("should handle API failure gracefully (stay in log mode)", async () => {
      // mock rejected promise
      (logNewPeriod as jest.Mock).mockRejectedValue(new Error("Network Error"));

      const { getByTestId, getAllByTestId, getByText } = render(
        <CalendarScreen />
      );
      await waitFor(() => expect(getPeriodHistory).toHaveBeenCalled());

      // enter log mode & select date
      fireEvent.press(getByTestId("log-period-button"));
      fireEvent.press(getAllByTestId("day-yesterday")[0]);

      fireEvent.press(getByText("Save"));

      // check we did NOT reset to normal mode 
      await waitFor(() => {
        expect(getByText("Save")).toBeTruthy();
      });
    });

    it("should render the FloatingAddButton ONLY when phase is menstrual", async () => {
      // override the mock to return menstrual phase
      (getCycleStatus as jest.Mock).mockResolvedValue({
        currentPhase: "menstrual",
      });

      const { toJSON } = render(<CalendarScreen />);
      
      await waitFor(() => expect(getCycleStatus).toHaveBeenCalled());

      // check if FloatingAddButton is in the render tree
      const tree = JSON.stringify(toJSON());
      expect(tree).toContain("FloatingAddButton");
    });
    
    it("should NOT render FloatingAddButton when phase is follicular", async () => {
      // override the mock to return follicular phase
      (getCycleStatus as jest.Mock).mockResolvedValue({
        currentPhase: "follicular",
      });

      const { toJSON } = render(<CalendarScreen />);
      await waitFor(() => expect(getCycleStatus).toHaveBeenCalled());

      // check absence
      const tree = JSON.stringify(toJSON());
      expect(tree).not.toContain("FloatingAddButton");
    });
  });
});
