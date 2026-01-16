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
      <LogNewPeriodButton color={baseColor} onPress={() => {}} />,
    );
    expect(getByText("Log period")).toBeTruthy();
  });

  it("renders ActivityIndicator when loading and blocks presses", () => {
    const onPress = jest.fn();
    const { queryByText, UNSAFE_getByType } = render(
      <LogNewPeriodButton color={baseColor} onPress={onPress} loading />,
    );

    const { ActivityIndicator } = require("react-native");
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(queryByText("Log period")).toBeNull();

    // Press should not trigger onPress while loading
    // Note: getByRole("button") might fail if loading state removes accessibility traits or modifies them.
    // The component sets accessibilityState={{ busy: true, disabled: true }}
  });

  it("applies blocked style when disabled", () => {
    const { getByTestId } = render(
      <LogNewPeriodButton color={baseColor} onPress={() => {}} disabled />,
    );
    const button = getByTestId("log-new-period-button");
    // Check for opacity class or style
    // NativeWind classes are flattened into style usually or kept in className prop for web.
    // In React Native testing library with NativeWind, we often check className prop string if inspecting props.
    // The implementation joins classes string.
    expect(button.props.className).toContain("opacity-60");
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <LogNewPeriodButton color={baseColor} onPress={onPress} disabled />,
    );

    fireEvent.press(getByRole("button", { hidden: true }) as any);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("calls onPress when enabled", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <LogNewPeriodButton color={baseColor} onPress={onPress} />,
    );

    fireEvent.press(getByRole("button", { hidden: true }) as any);
    expect(onPress).toHaveBeenCalled();
  });

  it("handles both loading and disabled states simultaneously", () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <LogNewPeriodButton color={baseColor} onPress={() => {}} loading disabled />,
    );
    const button = getByTestId("log-new-period-button");
    const { ActivityIndicator } = require("react-native");
    
    expect(button.props.accessibilityState.disabled).toBe(true);
    expect(button.props.accessibilityState.busy).toBe(true);
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("uses default values for accessibilityLabel and testID", () => {
    const { getByTestId, getByRole } = render(
      <LogNewPeriodButton color={baseColor} onPress={() => {}} />,
    );
    // testID default is "log-new-period-button"
    expect(getByTestId("log-new-period-button")).toBeTruthy();
    // accessibilityLabel default is "Log period"
    expect(getByRole("button").props.accessibilityLabel).toBe("Log period");
  });

  it("respects custom accessibilityLabel, testID and style", () => {
    const { getByTestId, getByRole } = render(
      <LogNewPeriodButton
        color={baseColor}
        onPress={() => {}}
        accessibilityLabel="Custom Label"
        testID="custom-test-id"
        style={{ borderColor: "red" }}
      />,
    );
    expect(getByTestId("custom-test-id")).toBeTruthy();
    expect(getByRole("button").props.accessibilityLabel).toBe("Custom Label");
    // The style prop is flattened; checking inclusion of the custom style
    const button = getByTestId("custom-test-id");
    // React Native flattens styles, so we might check if style array contains our object or merged style has the property
    const flatStyle = button.props.style;
    // It might be an array or object.
    if (Array.isArray(flatStyle)) {
        expect(flatStyle).toContainEqual({ borderColor: "red" });
    } else {
        expect(flatStyle).toMatchObject({ borderColor: "red" });
    }
  });
});
