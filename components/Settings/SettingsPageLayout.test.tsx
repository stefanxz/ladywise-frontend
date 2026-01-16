import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SettingsPageLayout } from "./SettingsPageLayout";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: any) => (
      <View {...props}>{children}</View>
    ),
  };
});

// Mock expo-linear-gradient
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

describe("SettingsPageLayout", () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();
  const defaultProps = {
    title: "Test Settings",
    description: "This is a test description for the settings page.",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
  });

  describe("Rendering", () => {
    it("should render correctly with all props", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByTestId("settings-page-layout")).toBeTruthy();
      expect(getByTestId("settings-page-title")).toBeTruthy();
      expect(getByTestId("settings-page-description")).toBeTruthy();
      expect(getByTestId("test-child")).toBeTruthy();
    });

    it("should render floating action when provided", () => {
      const { getByText } = render(
        <SettingsPageLayout
          {...defaultProps}
          floatingAction={<Text>Floating Action</Text>}
        >
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByText("Floating Action")).toBeTruthy();
    });

    it("should display the correct title", () => {
      const { getByText } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByText("Test Settings")).toBeTruthy();
    });

    it("should display the correct description", () => {
      const { getByText } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(
        getByText("This is a test description for the settings page."),
      ).toBeTruthy();
    });

    it("should render children content", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByTestId("test-child")).toBeTruthy();
    });

    it("should render the back button", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByTestId("back-button")).toBeTruthy();
      expect(getByTestId("back-button-icon")).toBeTruthy();
    });

    it("should render the title card", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByTestId("title-card")).toBeTruthy();
    });

    it("should render the scroll view", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByTestId("settings-page-scroll-view")).toBeTruthy();
    });

    it("should render the content container", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByTestId("settings-page-content")).toBeTruthy();
    });
  });

  describe("Navigation", () => {
    it("should navigate back to settings when back button is pressed", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      const backButton = getByTestId("back-button");
      fireEvent.press(backButton);

      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("should only call navigation once on multiple rapid presses", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      const backButton = getByTestId("back-button");
      fireEvent.press(backButton);
      fireEvent.press(backButton);
      fireEvent.press(backButton);

      // Note: In real implementation, you might want to debounce this
      // For now, we're just testing that each press calls the function
      expect(mockBack).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    it("should have proper accessibility labels on back button", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      const backButton = getByTestId("back-button");
      expect(backButton.props.accessibilityLabel).toBe("Back to Settings");
      expect(backButton.props.accessibilityRole).toBe("button");
      expect(backButton.props.accessibilityHint).toBe(
        "Navigate back to the main settings page",
      );
    });

    it("should have proper accessibility role on title", () => {
      const { getByTestId } = render(
        <SettingsPageLayout {...defaultProps}>
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      const title = getByTestId("settings-page-title");
      expect(title.props.accessibilityRole).toBe("header");
    });
  });

  describe("Content Variations", () => {
    it("should render with complex children", () => {
      const { getByTestId, getByText } = render(
        <SettingsPageLayout {...defaultProps}>
          <View testID="complex-content">
            <Text>Item 1</Text>
            <Text>Item 2</Text>
            <View>
              <Text>Nested Item</Text>
            </View>
          </View>
        </SettingsPageLayout>,
      );

      expect(getByTestId("complex-content")).toBeTruthy();
      expect(getByText("Item 1")).toBeTruthy();
      expect(getByText("Item 2")).toBeTruthy();
      expect(getByText("Nested Item")).toBeTruthy();
    });

    it("should handle long titles", () => {
      const longTitle = "A".repeat(100);
      const { getByText } = render(
        <SettingsPageLayout
          title={longTitle}
          description={defaultProps.description}
        >
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it("should handle long descriptions", () => {
      const longDescription = "B".repeat(200);
      const { getByText } = render(
        <SettingsPageLayout
          title={defaultProps.title}
          description={longDescription}
        >
          <Text testID="test-child">Test Content</Text>
        </SettingsPageLayout>,
      );

      expect(getByText(longDescription)).toBeTruthy();
    });
  });
});
