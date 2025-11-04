// Covers loading, disabled, and press handling
// (LogNewPeriodButton disables itself when disabled or loading is true,
//  and shows ActivityIndicator when loading.)

import LogNewPeriodButton from "@/components/LogNewPeriodButton/LogNewPeriodButton";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

describe("LogNewPeriodButton", () => {
  const baseColor = "#3b82f6";

  it("renders label when not loading", () => {
    const { getByText } = render(
      <LogNewPeriodButton color={baseColor} onPress={() => {}} />
    );
    expect(getByText("Log period ＋")).toBeTruthy();
  });

  it("renders ActivityIndicator when loading and blocks presses", () => {
    const onPress = jest.fn();
    const { queryByText, getByRole } = render(
      <LogNewPeriodButton color={baseColor} onPress={onPress} loading />
    );

    // The label should be replaced by the spinner
    expect(queryByText("Log period ＋")).toBeNull();

    // Press should not trigger onPress while loading
    fireEvent.press(getByRole("button", { hidden: true }) as any);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <LogNewPeriodButton color={baseColor} onPress={onPress} disabled />
    );

    fireEvent.press(getByRole("button", { hidden: true }) as any);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("calls onPress when enabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <LogNewPeriodButton color={baseColor} onPress={onPress} />
    );

    fireEvent.press(getByRole("button", { hidden: true }) as any);
    expect(onPress).toHaveBeenCalled();
  });
});