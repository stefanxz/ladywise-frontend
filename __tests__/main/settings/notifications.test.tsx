import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import NotificationsSettings from "@/app/(main)/settings/notifications";
import {
  getNotificationSettings,
  updateNotificationSetting,
} from "@/lib/notifications";
import { NotificationFrequency } from "@/lib/types/notification";

// Mock the notification API
jest.mock("@/lib/notifications", () => ({
  getNotificationSettings: jest.fn(),
  updateNotificationSetting: jest.fn(),
}));

// Mock SettingsPageLayout
jest.mock("@/components/Settings/SettingsPageLayout", () => ({
  SettingsPageLayout: (props: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="settings-page-layout">
        <Text>{props.title}</Text>
        <Text>{props.description}</Text>
        {props.children}
      </View>
    );
  },
}));

const mockGetSettings = getNotificationSettings as jest.Mock;
const mockUpdateSetting = updateNotificationSetting as jest.Mock;

const defaultPreferences: Record<string, NotificationFrequency> = {
  CYCLE_QUESTIONNAIRE_REMINDER: "DAILY",
  CYCLE_PHASE_UPDATE: "DAILY",
};

describe("NotificationsSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSettings.mockResolvedValue(defaultPreferences);
    mockUpdateSetting.mockResolvedValue(undefined);
  });

  describe("Loading State", () => {
    it("shows loading indicator while fetching settings", async () => {
      // Keep the promise pending
      mockGetSettings.mockImplementation(() => new Promise(() => {}));

      render(<NotificationsSettings />);

      expect(screen.getByText("Loading settings...")).toBeTruthy();
    });
  });

  describe("Render", () => {
    it("renders correctly with all options after loading", async () => {
      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      expect(screen.getByText("Notifications")).toBeTruthy();
      expect(
        screen.getByText(
          "Manage how and when you receive updates from LadyWise.",
        ),
      ).toBeTruthy();

      expect(screen.getByText("Daily Log Reminders")).toBeTruthy();
      expect(screen.getByTestId("freq-daily")).toBeTruthy();
      expect(screen.getByTestId("freq-monthly")).toBeTruthy();
      expect(screen.getByTestId("freq-none")).toBeTruthy();

      expect(screen.getByText("Cycle Phase Updates")).toBeTruthy();
      expect(screen.getByTestId("phase-notifications-toggle")).toBeTruthy();
    });

    it("fetches notification settings on mount", async () => {
      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(mockGetSettings).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Error Handling", () => {
    it("displays error message when fetching settings fails", async () => {
      mockGetSettings.mockRejectedValueOnce(new Error("Network error"));

      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load notification settings"),
        ).toBeTruthy();
      });
    });

    it("displays error and reverts state when update fails", async () => {
      mockUpdateSetting.mockRejectedValueOnce(new Error("Update failed"));

      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      const monthlyPill = screen.getByTestId("freq-monthly");
      await act(async () => {
        fireEvent.press(monthlyPill);
      });

      await waitFor(() => {
        expect(
          screen.getByText("Failed to update setting. Please try again."),
        ).toBeTruthy();
      });
    });
  });

  describe("Questionnaire Frequency", () => {
    it("allows changing to monthly frequency", async () => {
      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      const monthlyPill = screen.getByTestId("freq-monthly");
      await act(async () => {
        fireEvent.press(monthlyPill);
      });

      expect(mockUpdateSetting).toHaveBeenCalledWith(
        "CYCLE_QUESTIONNAIRE_REMINDER",
        "MONTHLY",
      );
    });

    it("allows changing to none (off)", async () => {
      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      const nonePill = screen.getByTestId("freq-none");
      await act(async () => {
        fireEvent.press(nonePill);
      });

      expect(mockUpdateSetting).toHaveBeenCalledWith(
        "CYCLE_QUESTIONNAIRE_REMINDER",
        "NONE",
      );
    });

    it("allows changing to daily frequency", async () => {
      mockGetSettings.mockResolvedValueOnce({
        ...defaultPreferences,
        CYCLE_QUESTIONNAIRE_REMINDER: "MONTHLY",
      });

      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      const dailyPill = screen.getByTestId("freq-daily");
      await act(async () => {
        fireEvent.press(dailyPill);
      });

      expect(mockUpdateSetting).toHaveBeenCalledWith(
        "CYCLE_QUESTIONNAIRE_REMINDER",
        "DAILY",
      );
    });

    it("initializes with correct frequency from backend", async () => {
      mockGetSettings.mockResolvedValueOnce({
        ...defaultPreferences,
        CYCLE_QUESTIONNAIRE_REMINDER: "MONTHLY",
      });

      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      // Pressing MONTHLY shouldn't trigger an update since it's already selected
      // We verify by checking the API was called with the expected value when changing
      const dailyPill = screen.getByTestId("freq-daily");
      await act(async () => {
        fireEvent.press(dailyPill);
      });

      expect(mockUpdateSetting).toHaveBeenCalledWith(
        "CYCLE_QUESTIONNAIRE_REMINDER",
        "DAILY",
      );
    });
  });

  describe("Phase Notifications Toggle", () => {
    it("initializes toggle as enabled when frequency is DAILY", async () => {
      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      const toggle = screen.getByTestId("phase-notifications-toggle");
      expect(toggle.props.value).toBe(true);
    });

    it("initializes toggle as disabled when frequency is NONE", async () => {
      mockGetSettings.mockResolvedValueOnce({
        ...defaultPreferences,
        CYCLE_PHASE_UPDATE: "NONE",
      });

      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      const toggle = screen.getByTestId("phase-notifications-toggle");
      expect(toggle.props.value).toBe(false);
    });

    it("disables phase notifications (sets to NONE) when toggled off", async () => {
      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      const toggle = screen.getByTestId("phase-notifications-toggle");
      await act(async () => {
        fireEvent(toggle, "onValueChange", false);
      });

      expect(mockUpdateSetting).toHaveBeenCalledWith(
        "CYCLE_PHASE_UPDATE",
        "NONE",
      );
    });

    it("enables phase notifications (sets to DAILY) when toggled on", async () => {
      mockGetSettings.mockResolvedValueOnce({
        ...defaultPreferences,
        CYCLE_PHASE_UPDATE: "NONE",
      });

      render(<NotificationsSettings />);

      await waitFor(() => {
        expect(screen.queryByText("Loading settings...")).toBeNull();
      });

      const toggle = screen.getByTestId("phase-notifications-toggle");
      await act(async () => {
        fireEvent(toggle, "onValueChange", true);
      });

      expect(mockUpdateSetting).toHaveBeenCalledWith(
        "CYCLE_PHASE_UPDATE",
        "DAILY",
      );
    });
  });
});
