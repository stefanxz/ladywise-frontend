//Covers secure toggle, onChangeText, error rendering.
//(PasswordField uses a Pressable with testID ${testID}-toggle and toggles secureTextEntry based on internal show state.)
import { PasswordField } from "@/components/PasswordField/PasswordField";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@expo/vector-icons");

describe("PasswordField", () => {
  it("starts as secure (masked) and toggles visibility", () => {
    const { getByTestId } = render(
      <PasswordField
        label="Password"
        value=""
        onChangeText={() => {}}
        testID="password-input"
      />,
    );

    const input = getByTestId("password-input");
    expect(input).toHaveProp("secureTextEntry", true);

    fireEvent.press(getByTestId("password-input-toggle"));
    expect(input).toHaveProp("secureTextEntry", false);

    fireEvent.press(getByTestId("password-input-toggle"));
    expect(input).toHaveProp("secureTextEntry", true);
  });

  it("calls onChangeText when typing", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <PasswordField
        label="Password"
        value=""
        onChangeText={onChangeText}
        testID="password-input"
      />,
    );
    fireEvent.changeText(getByTestId("password-input"), "Abcd1234");
    expect(onChangeText).toHaveBeenCalledWith("Abcd1234");
  });

  it("shows error text and adds error border style", () => {
    const { getByText, getByTestId } = render(
      <PasswordField
        label="Password"
        value=""
        onChangeText={() => {}}
        error="Too weak"
        testID="password-input"
      />,
    );
    expect(getByText("Too weak")).toBeTruthy();
    expect(getByTestId("password-input")).toHaveProp(
      "className",
      expect.stringContaining("border-red-500"),
    );
  });
});
