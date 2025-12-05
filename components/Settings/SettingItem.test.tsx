import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SettingItem } from "./SettingItem";
import { Href, useRouter } from "expo-router";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

describe("SettingItem", () => {
  const mockPush = jest.fn();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const defaultItem = {
    name: "Profile Settings",
    icon: "user" as const,
  };

  it("renders correctly with all elements", () => {
    const { getByTestId, getByText } = render(
      <SettingItem item={defaultItem} showDivider={false} />,
    );

    expect(getByTestId("setting-item-container")).toBeTruthy();
    expect(getByTestId("setting-item-button")).toBeTruthy();
    expect(getByTestId("setting-item-icon")).toBeTruthy();
    expect(getByTestId("setting-item-label")).toBeTruthy();
    expect(getByTestId("setting-item-chevron")).toBeTruthy();
    expect(getByText("Profile Settings")).toBeTruthy();
  });

  it("shows divider when showDivider is true", () => {
    const { getByTestId } = render(
      <SettingItem item={defaultItem} showDivider={true} />,
    );

    expect(getByTestId("setting-item-divider")).toBeTruthy();
  });

  it("does not show divider when showDivider is false", () => {
    const { queryByTestId } = render(
      <SettingItem item={defaultItem} showDivider={false} />,
    );

    expect(queryByTestId("setting-item-divider")).toBeNull();
  });

  it("navigates to route when item has route property", () => {
    const itemWithRoute = {
      ...defaultItem,
      route: "/profile" as Href,
    };

    const { getByTestId } = render(
      <SettingItem item={itemWithRoute} showDivider={false} />,
    );

    fireEvent.press(getByTestId("setting-item-button"));

    expect(mockPush).toHaveBeenCalledWith("/profile");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("calls onPress handler when item has onPress property", () => {
    const itemWithOnPress = {
      ...defaultItem,
      onPress: mockOnPress,
    };

    const { getByTestId } = render(
      <SettingItem item={itemWithOnPress} showDivider={false} />,
    );

    fireEvent.press(getByTestId("setting-item-button"));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("prioritizes route over onPress when both are provided", () => {
    const itemWithBoth = {
      ...defaultItem,
      route: "/settings" as const,
      onPress: mockOnPress,
    };

    const { getByTestId } = render(
      <SettingItem item={itemWithBoth} showDivider={false} />,
    );

    fireEvent.press(getByTestId("setting-item-button"));

    expect(mockPush).toHaveBeenCalledWith("/settings");
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("renders correct icon name", () => {
    const itemWithIcon = {
      name: "Notifications",
      icon: "bell" as const,
    };

    const { getByTestId } = render(
      <SettingItem item={itemWithIcon} showDivider={false} />,
    );

    const icon = getByTestId("setting-item-icon");
    expect(icon.props.name).toBe("bell");
  });

  it("has correct accessibility properties", () => {
    const { getByTestId } = render(
      <SettingItem item={defaultItem} showDivider={false} />,
    );

    const button = getByTestId("setting-item-button");
    expect(button.props.accessibilityLabel).toBe("Profile Settings setting");
    expect(button.props.accessibilityRole).toBe("button");
  });
});
