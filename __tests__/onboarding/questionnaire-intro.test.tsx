/**
 * @file questionnaire-intro.test.tsx
 * @description Unit test for the QuestionnaireIntro screen.
 * Verifies that the screen renders correctly, navigates to the questionnaire page,
 * and handles back navigation (Hardware back, Swipe back, AppBar back) correctly.
 */

import QuestionnaireIntro from "@/app/onboarding/questionnaire-intro";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { BackHandler } from "react-native";

// mock dependencies 
jest.mock("expo-router");
jest.mock("@expo/vector-icons");

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// mock AppBar to expose the onBackPress prop for testing
jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => {
  const { Pressable, Text } = require("react-native");
  return {
    AppBar: ({ onBackPress }: { onBackPress?: () => void }) => (
      <Pressable onPress={onBackPress} testID="app-bar-back">
        <Text>AppBar</Text>
      </Pressable>
    ),
  };
});

jest.mock("@/components/ThemedPressable/ThemedPressable", () => ({
  ThemedPressable: ({
    label,
    onPress,
  }: {
    label: string;
    onPress: () => void;
  }) => {
    const { Pressable, Text } = require("react-native");
    return (
      <Pressable onPress={onPress} testID="continue-button">
        <Text>{label}</Text>
      </Pressable>
    );
  },
}));

// mock Navigation to capture event listeners
const mockAddListener = jest.fn();
// capture effect cleanups
const effectCleanups: (() => void)[] = [];

jest.mock("@react-navigation/native", () => ({
  // mock useFocusEffect to execute the callback immediately so listeners are attached
  useFocusEffect: jest.fn((callback) => {
    const cleanup = callback();
    if (typeof cleanup === 'function') {
      effectCleanups.push(cleanup);
    }
  }),
  useNavigation: jest.fn(() => ({
    goBack: jest.fn(),
    addListener: mockAddListener,
  })),
}));

const { __getMocks } = jest.requireMock("expo-router");
const router = __getMocks();

describe("QuestionnaireIntro screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // clear cleanups
    effectCleanups.length = 0;
    // default mock implementation for addListener to return a teardown function
    mockAddListener.mockReturnValue(jest.fn());
  });

  it("renders all key UI elements", () => {
    const { getByText } = render(<QuestionnaireIntro />);

    expect(getByText("Let's personalize")).toBeTruthy();
    expect(getByText("LadyWise")).toBeTruthy();
    expect(getByText("Continue")).toBeTruthy();
  });

  it("navigates to the questionnaire screen on Continue", () => {
    const { getByTestId } = render(<QuestionnaireIntro />);
    fireEvent.press(getByTestId("continue-button"));
    expect(router.push).toHaveBeenCalledWith(
      "/onboarding/questionnaire-personal-details",
    );
  });

  it("redirects to personal details register screen when AppBar back is pressed", () => {
    const { getByTestId } = render(<QuestionnaireIntro />);
    
    // simulate pressing the AppBar back button
    fireEvent.press(getByTestId("app-bar-back"));

    // should use replace instead of back to ensure correct stack reset
    expect(router.replace).toHaveBeenCalledWith("/(auth)/register/personal-details");
  });

  it("intercepts Android Hardware Back press and redirects", () => {
    // spy on BackHandler
    const addEventListenerSpy = jest.spyOn(BackHandler, "addEventListener");
    const mockRemove = jest.fn();
    addEventListenerSpy.mockReturnValue({ remove: mockRemove } as any);

    render(<QuestionnaireIntro />);

    // find the registered 'hardwareBackPress' call
    const hardwareBackCall = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === "hardwareBackPress"
    );

    expect(hardwareBackCall).toBeDefined();
    const hardwareBackCallback = hardwareBackCall![1]; 
    const result = hardwareBackCallback();

    expect(result).toBe(true);
    expect(router.replace).toHaveBeenCalledWith("/(auth)/register/personal-details");
  });

  it("prevents double redirection if back is pressed multiple times", () => {
    // spy on BackHandler
    const addEventListenerSpy = jest.spyOn(BackHandler, "addEventListener");
    const mockRemove = jest.fn();
    addEventListenerSpy.mockReturnValue({ remove: mockRemove } as any);

    render(<QuestionnaireIntro />);

    // find the registered 'hardwareBackPress' call
    const hardwareBackCall = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === "hardwareBackPress"
    );

    expect(hardwareBackCall).toBeDefined();
    const hardwareBackCallback = hardwareBackCall![1]; 
    
    // First press
    hardwareBackCallback();
    expect(router.replace).toHaveBeenCalledTimes(1);

    // Second press (should be blocked by ref)
    hardwareBackCallback();
    expect(router.replace).toHaveBeenCalledTimes(1);
  });

  it("intercepts Navigation 'beforeRemove' (swipe back) and redirects", () => {
    render(<QuestionnaireIntro />);

    // find the registered 'beforeRemove' callback passed to navigation.addListener
    const beforeRemoveCallback = mockAddListener.mock.calls.find(
      (call) => call[0] === "beforeRemove"
    )[1];

    expect(beforeRemoveCallback).toBeDefined();

    // create mock event object for a "GO_BACK" action
    const mockEvent = {
      data: { action: { type: "GO_BACK" } },
      preventDefault: jest.fn(),
    };

    // trigger the event
    beforeRemoveCallback(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith("/(auth)/register/personal-details");
  });

  it("ignores 'beforeRemove' events that are not back actions (e.g., NAVIGATE)", () => {
    render(<QuestionnaireIntro />);

    const beforeRemoveCallback = mockAddListener.mock.calls.find(
      (call) => call[0] === "beforeRemove"
    )[1];

    // event type that isn't GO_BACK, POP, or POP_TO_TOP
    const mockEvent = {
      data: { action: { type: "NAVIGATE" } },
      preventDefault: jest.fn(),
    };

    beforeRemoveCallback(mockEvent);

    // should allow default behavior
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    // should NOT redirect
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("cleans up rerouting ref on unmount (triggers effect cleanup)", () => {
    render(<QuestionnaireIntro />);
    
    // Simulate unmount by calling captured cleanups
    effectCleanups.forEach(cleanup => cleanup());
  });
});
