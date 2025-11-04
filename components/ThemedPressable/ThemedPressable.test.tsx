//Covers loading, disabled, and press handling
//(ThemedPressable disables itself when disabled or loading is true, and shows ActivityIndicator when loading.)
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

describe("ThemedPressable", () => {
  it("renders label when not loading", () => {
    const { getByText } = render(
      <ThemedPressable label="Go" onPress={() => {}} />,
    );
    expect(getByText("Go")).toBeTruthy();
  });

  it("renders ActivityIndicator when loading and blocks presses", () => {
    const onPress = jest.fn();
    const { queryByText, getByRole } = render(
      <ThemedPressable label="Go" onPress={onPress} loading />,
    );
    expect(queryByText("Go")).toBeNull();
    fireEvent.press(getByRole("button", { hidden: true }) as any);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <ThemedPressable label="Go" onPress={onPress} disabled />,
    );
    fireEvent.press(getByRole("button", { hidden: true }) as any);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("calls onPress when enabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <ThemedPressable label="Go" onPress={onPress} />,
    );
    fireEvent.press(getByRole("button", { hidden: true }) as any);
    expect(onPress).toHaveBeenCalled();
  });
});
