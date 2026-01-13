import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import ViewModeDropdown from "./ViewModeDropdown";
import { VIEW_OPTIONS } from "@/components/Diagnostics/types";

describe("ViewModeDropdown", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    View.prototype.measureInWindow = jest.fn((cb: Function) => {
      cb(0, 0, 100, 40);
    });
  });

  it("renders with the correct initial label for daily mode", () => {
    const { getByTestId } = render(
      <ViewModeDropdown value="daily" onChange={mockOnChange} />,
    );
    expect(getByTestId("viewmode-dropdown-label").props.children).toBe("Daily");
  });

  it("renders with the correct initial label for cycle mode", () => {
    const { getByTestId } = render(
      <ViewModeDropdown value="cycle" onChange={mockOnChange} />,
    );
    expect(getByTestId("viewmode-dropdown-label").props.children).toBe(
      "Per Cycle/Monthly",
    );
  });

  it("does not show dropdown menu initially", () => {
    const { queryByTestId } = render(
      <ViewModeDropdown value="daily" onChange={mockOnChange} />,
    );
    expect(queryByTestId("viewmode-dropdown-menu")).toBeNull();
  });

  it("opens the dropdown when button is pressed", () => {
    const { getByTestId, queryByTestId } = render(
      <ViewModeDropdown value="daily" onChange={mockOnChange} />,
    );

    expect(queryByTestId("viewmode-dropdown-menu")).toBeNull();

    fireEvent.press(getByTestId("viewmode-dropdown-button"));

    expect(getByTestId("viewmode-dropdown-menu")).toBeTruthy();
  });

  it("displays all view options when dropdown is open", () => {
    const { getByTestId } = render(
      <ViewModeDropdown value="daily" onChange={mockOnChange} />,
    );

    fireEvent.press(getByTestId("viewmode-dropdown-button"));

    VIEW_OPTIONS.forEach((opt) => {
      expect(getByTestId(`viewmode-option-${opt.value}`)).toBeTruthy();
      expect(
        getByTestId(`viewmode-option-label-${opt.value}`).props.children,
      ).toBe(opt.label);
    });
  });

  it("calls onChange with 'cycle' when cycle option is selected", () => {
    const { getByTestId } = render(
      <ViewModeDropdown value="daily" onChange={mockOnChange} />,
    );

    fireEvent.press(getByTestId("viewmode-dropdown-button"));
    fireEvent.press(getByTestId("viewmode-option-cycle"));

    expect(mockOnChange).toHaveBeenCalledWith("cycle");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("calls onChange with 'daily' when daily option is selected", () => {
    const { getByTestId } = render(
      <ViewModeDropdown value="cycle" onChange={mockOnChange} />,
    );

    fireEvent.press(getByTestId("viewmode-dropdown-button"));
    fireEvent.press(getByTestId("viewmode-option-daily"));

    expect(mockOnChange).toHaveBeenCalledWith("daily");
  });

  it("closes the dropdown after selecting an option", () => {
    const { getByTestId, queryByTestId } = render(
      <ViewModeDropdown value="daily" onChange={mockOnChange} />,
    );

    fireEvent.press(getByTestId("viewmode-dropdown-button"));
    expect(getByTestId("viewmode-dropdown-menu")).toBeTruthy();

    fireEvent.press(getByTestId("viewmode-option-cycle"));
    expect(queryByTestId("viewmode-dropdown-menu")).toBeNull();
  });

  it("closes the dropdown when pressing the backdrop", () => {
    const { getByTestId, queryByTestId } = render(
      <ViewModeDropdown value="daily" onChange={mockOnChange} />,
    );

    fireEvent.press(getByTestId("viewmode-dropdown-button"));
    expect(getByTestId("viewmode-dropdown-menu")).toBeTruthy();

    fireEvent.press(getByTestId("viewmode-dropdown-backdrop"));
    expect(queryByTestId("viewmode-dropdown-menu")).toBeNull();
  });
});
