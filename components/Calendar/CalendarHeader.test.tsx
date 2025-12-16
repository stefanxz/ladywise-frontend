import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import CalendarHeader from "@/components/Calendar/CalendarHeader";

// Mocks and setup

// Mock the console.log to avoid cluttering test output and to verify calls
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

// Mock the theme context to control theme values during tests
const mockTheme = {
  highlight: "#FCA5A5",
  highlightTextColor: "#FFFFFF",
};

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe("CalendarHeader component", () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  // Rendering structure
  it('renders the "Calendar" title correctly', () => {
    render(<CalendarHeader />);
    const title = screen.getByText("Calendar");
    expect(title).toBeTruthy();
    expect(title.props.className).toContain("text-3xl font-bold");
  });

  it("renders all 7 days of the week", () => {
    render(<CalendarHeader />);

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    weekDays.forEach((day) => {
      expect(screen.getByText(day)).toBeTruthy();
    });
  });

  // Visual logic (weekend styling)
  it("applies correct text color for weekdays (Mon-Fri)", () => {
    render(<CalendarHeader />);

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    weekdays.forEach((day) => {
      const dayElement = screen.getByText(day);
      // Expect dark stone color for weekdays
      expect(dayElement.props.className).toContain("text-stone-800");
    });
  });

  it("applies correct text color for weekends (Sat-Sun)", () => {
    render(<CalendarHeader />);

    const weekends = ["Sat", "Sun"];

    weekends.forEach((day) => {
      const dayElement = screen.getByText(day);
      // Expect lighter stone color for weekends
      expect(dayElement.props.className).toContain("text-stone-400");
    });
  });
});
