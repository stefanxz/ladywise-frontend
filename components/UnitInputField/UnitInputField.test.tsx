//Covers onChangeText, error rendering.
import { UnitInputField } from "@/components/UnitInputField/UnitInputField";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

it("renders label and placeholder", () => {
  const { getByText, getByPlaceholderText } = render(
    <UnitInputField
      unit="kg"
      value=""
      onChangeText={() => {}}
      placeholder="Your weight"
      testID="unit-input"
    />,
  );
  expect(getByText("kg")).toBeTruthy();
  expect(getByPlaceholderText("Your weight")).toBeTruthy();
});

it("calls onChangeText when typing", () => {
  const onChangeText = jest.fn();
  const { getByTestId } = render(
    <UnitInputField
      unit="kg"
      value=""
      onChangeText={onChangeText}
      placeholder="Your weight"
      testID="unit-input"
    />,
  );
  fireEvent.changeText(getByTestId("unit-input"), "30");
  expect(onChangeText).toHaveBeenCalledWith("30");
});

it("renders error message when error prop is provided", () => {
  const { getByText } = render(
    <UnitInputField
      unit="cm"
      value="100"
      onChangeText={() => {}}
      error="Value is too high"
    />,
  );

  expect(getByText("Value is too high")).toBeTruthy();
});
