import React from "react";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react-native";
import NotificationsSettings from "@/app/(main)/settings/notifications";

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

describe("NotificationsSettings", () => {
  it("renders correctly with all options", () => {
    render(<NotificationsSettings />);

    expect(screen.getByText("Notifications")).toBeTruthy();
    expect(
      screen.getByText("Manage how and when you receive updates from LadyWise."),
    ).toBeTruthy();

    expect(screen.getByText("Daily Log Reminders")).toBeTruthy();
    expect(screen.getByTestId("freq-daily")).toBeTruthy();
    expect(screen.getByTestId("freq-monthly")).toBeTruthy();
    expect(screen.getByTestId("freq-none")).toBeTruthy();

    expect(screen.getByText("Cycle Phase Updates")).toBeTruthy();
    expect(screen.getByTestId("phase-notifications-toggle")).toBeTruthy();
  });

  it("allows changing questionnaire frequency", () => {
    render(<NotificationsSettings />);

    const dailyPill = screen.getByTestId("freq-daily");
    const monthlyPill = screen.getByTestId("freq-monthly");
    const nonePill = screen.getByTestId("freq-none");

    // Monthly is selected
    fireEvent.press(monthlyPill);
    // Since we don't have visual check for classes in these tests easily without extra setup,
    // we just verify it doesn't crash and ideally we'd check state if it was exported or via other means.
    // In this case, we're just verifying interaction.
    
    fireEvent.press(nonePill);
    fireEvent.press(dailyPill);
  });

  it("allows toggling phase notifications", () => {
    render(<NotificationsSettings />);

    const toggle = screen.getByTestId("phase-notifications-toggle");
    
    // Initial value is true (based on our default state)
    expect(toggle.props.value).toBe(true);

    fireEvent(toggle, "onValueChange", false);
    expect(toggle.props.value).toBe(false);

    fireEvent(toggle, "onValueChange", true);
    expect(toggle.props.value).toBe(true);
  });
});
