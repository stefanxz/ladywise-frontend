import React from "react";
import { View } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import CalendarDay from "@/components/Calendar/CalendarDay";

// Mocks and setup

// Mock the themes library
jest.mock("@/lib/themes", () => ({
  themes: {
    menstrual: { highlight: "#E11D48" },
  },
}));

const SELECTION_RED = "rgba(205, 22, 61, 0.9)";
const PERIOD_HIGHLIGHT = "#E11D48";
const THEME_COLOR = "#FCA5A5";

describe("CalendarDay component", () => {
  const MOCK_TODAY = new Date("2023-10-11T12:00:00Z");

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_TODAY);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // setup: Measure Mocking 
  beforeEach(() => {
    jest.spyOn(View.prototype, "measure").mockImplementation((callback) => {
      callback(0, 0, 40, 40, 50, 100);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });


  it("renders nothing visible (placeholder) when date is null", () => {
    const { toJSON } = render(
      <CalendarDay date={null} themeColor={THEME_COLOR} />,
    );
    const tree = toJSON();
    expect(tree?.children).toBeNull();
    expect(tree?.props.className).toContain("w-[14.28%]");
  });

  it("renders the correct day number for a valid date", () => {
    const date = new Date("2023-10-15T12:00:00Z");
    render(<CalendarDay date={date} themeColor={THEME_COLOR} />);
    expect(screen.getByText("15")).toBeTruthy();
  });

  it("renders weekend text color correctly", () => {
    const saturday = new Date("2023-10-14T12:00:00Z");
    render(<CalendarDay date={saturday} themeColor={THEME_COLOR} />);
    const text = screen.getByText("14");
    expect(text.props.className).toContain("text-stone-400");
  });

  it("applies solid border styling for confirmed periods", () => {
    const date = new Date("2023-10-01T12:00:00Z");
    const { toJSON } = render(
      <CalendarDay date={date} isPeriod={true} themeColor={THEME_COLOR} />,
    );
    const tree = toJSON() as any;
    const touchable = tree.children[0];
    expect(touchable.props.style).toEqual(
      expect.objectContaining({
        borderColor: PERIOD_HIGHLIGHT,
        borderWidth: 1.5,
        borderStyle: "solid",
      }),
    );
  });

  it("applies dashed border styling for predictions", () => {
    const date = new Date("2023-10-02T12:00:00Z");
    const { toJSON } = render(
      <CalendarDay date={date} isPrediction={true} themeColor={THEME_COLOR} />,
    );
    const tree = toJSON() as any;
    const touchable = tree.children[0];
    expect(touchable.props.style).toEqual(
      expect.objectContaining({
        borderColor: PERIOD_HIGHLIGHT,
        borderWidth: 1.5,
        borderStyle: "dashed",
      }),
    );
  });

  it('applies special styling for "Today"', () => {
    const { toJSON } = render(
      <CalendarDay date={MOCK_TODAY} themeColor={THEME_COLOR} />,
    );
    const tree = toJSON() as any;
    const touchable = tree.children[0];
    expect(touchable.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: THEME_COLOR,
        borderColor: THEME_COLOR,
        borderWidth: 3,
      }),
    );
  });

  it("calculates coordinates and calls onPress when tapped", () => {
    const mockOnPress = jest.fn();
    const date = new Date("2023-10-15T12:00:00Z");
    
    render(
      <CalendarDay 
        date={date} 
        themeColor={THEME_COLOR} 
        onPress={mockOnPress} 
      />
    );

    // find touchable element wrapped around the text
    const dayButton = screen.getByText("15");
    
    // simulate press
    fireEvent.press(dayButton);

    // expect measure to have been called (implied by the callback running)
    expect(mockOnPress).toHaveBeenCalledWith(
      date,
      expect.objectContaining({ x: 70, y: 100 })
    );
  });
});