//Covers label, value, onChangeText, error rendering, and error styling.
//(EmailField renders a label, passes props to ThemedTextInput, shows error text and a red border class when error is set.)

import { EmailField } from "@/components/EmailField/EmailField";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@expo/vector-icons");

describe("EmailField", () => {
  it("renders label and placeholder", () => {
    const { getByText, getByPlaceholderText } = render(
      <EmailField
        label="Email"
        value=""
        onChangeText={() => {}}
        placeholder="Your email"
        testID="email-input"
      />,
    );
    expect(getByText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Your email")).toBeTruthy();
  });

  it("calls onChangeText when typing", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <EmailField
        label="Email"
        value=""
        onChangeText={onChangeText}
        placeholder="Your email"
        testID="email-input"
      />,
    );
    fireEvent.changeText(getByTestId("email-input"), "a@b.com");
    expect(onChangeText).toHaveBeenCalledWith("a@b.com");
  });

  it("shows error text and error border style when error provided", () => {
    const { getByText, getByTestId } = render(
      <EmailField
        label="Email"
        value=""
        onChangeText={() => {}}
        error="Invalid email"
        testID="email-input"
      />,
    );
    expect(getByText("Invalid email")).toBeTruthy();
    // RN Testing Library allows prop assertions; className is passed down.
    expect(getByTestId("email-input")).toHaveProp(
      "className",
      expect.stringContaining("border-red-500"),
    );
  });
});
