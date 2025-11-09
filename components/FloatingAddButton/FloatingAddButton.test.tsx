import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FloatingAddButton } from "./FloatingAddButton";

jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return {
    Ionicons: (props: any) => <Text testID="icon" {...props} />,
  };
});

describe("FloatingAddButton", () => {
  describe("rendering", () => {
    it("renders correctly with default props", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} />,
      );

      const button = getByTestId("floating-add-button");
      expect(button).toBeTruthy();
    });

    it("renders with custom size", () => {
      const mockOnPress = jest.fn();
      const customSize = 72;
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} size={customSize} />,
      );

      const button = getByTestId("floating-add-button");
      expect(button.props.style).toMatchObject({
        width: customSize,
        height: customSize,
      });
    });

    it("renders with custom button color", () => {
      const mockOnPress = jest.fn();
      const customColor = "#F9ACAC";
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} buttonColor={customColor} />,
      );

      const button = getByTestId("floating-add-button");
      expect(button.props.style.backgroundColor).toBe(customColor);
    });

    it("renders with default colors when not specified", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} />,
      );

      const button = getByTestId("floating-add-button");
      expect(button.props.style.backgroundColor).toBe("#3b82f6");
      expect(button.props.style.opacity).toBe(1);
    });

    it("renders icon with correct size ratio", () => {
      const mockOnPress = jest.fn();
      const size = 60;
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} size={size} />,
      );

      const icon = getByTestId("icon");
      expect(icon.props.size).toBe(size * 0.6);
    });

    it("renders icon with custom text color", () => {
      const mockOnPress = jest.fn();
      const customTextColor = "#271411";
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} textColor={customTextColor} />,
      );

      const icon = getByTestId("icon");
      expect(icon.props.color).toBe(customTextColor);
      expect(icon.props.name).toBe("add");
    });
  });

  describe("user interactions", () => {
    it("calls onPress when button is pressed", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} />,
      );

      const button = getByTestId("floating-add-button");
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} disabled={true} />,
      );

      const button = getByTestId("floating-add-button");
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it("calls onPress multiple times for multiple presses", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} />,
      );

      const button = getByTestId("floating-add-button");
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe("disabled state", () => {
    it("has reduced opacity when disabled", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} disabled={true} />,
      );

      const button = getByTestId("floating-add-button");
      expect(button.props.style.opacity).toBe(0.5);
    });

    it("has full opacity when not disabled", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} disabled={false} />,
      );

      const button = getByTestId("floating-add-button");
      expect(button.props.style.opacity).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("handles very small size values", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} size={20} />,
      );

      const button = getByTestId("floating-add-button");
      expect(button.props.style.width).toBe(20);
      expect(button.props.style.height).toBe(20);
    });

    it("handles very large size values", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton onPress={mockOnPress} size={200} />,
      );

      const button = getByTestId("floating-add-button");
      expect(button.props.style.width).toBe(200);
      expect(button.props.style.height).toBe(200);
    });

    it("handles all custom props together", () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <FloatingAddButton
          onPress={mockOnPress}
          size={64}
          buttonColor="#FF5733"
          textColor="#FFFFFF"
          disabled={false}
        />,
      );

      const button = getByTestId("floating-add-button");
      const icon = getByTestId("icon");

      expect(button.props.style).toMatchObject({
        width: 64,
        height: 64,
        backgroundColor: "#FF5733",
        opacity: 1,
      });
      expect(icon.props.color).toBe("#FFFFFF");
      expect(icon.props.size).toBe(64 * 0.6);
    });
  });
});
