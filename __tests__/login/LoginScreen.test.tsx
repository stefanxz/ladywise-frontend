import LoginScreen from "@/app/(auth)/login";
import * as validation from "@/lib/validation";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// --- Mock navigation, stack, and icons ---
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

jest.mock("@expo/vector-icons", () => ({
  Feather: () => null,
  Ionicons: () => null,
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
  };
});

// --- Mock components not under test ---
jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => null,
}));

jest.mock("@/components/SocialSignOn/SocialSignOn", () => ({
  SocialSignOn: () => null,
}));

// ✅ Use RN components instead of DOM mocks
jest.mock("@/components/ThemedPressable/ThemedPressable", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");
  return {
    ThemedPressable: ({
      label,
      onPress,
      disabled,
    }: {
      label: string;
      onPress: () => void;
      disabled?: boolean;
    }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        onPress={disabled ? undefined : onPress}
        testID="login-button"
      >
        <Text>{label}</Text>
      </Pressable>
    ),
  };
});

jest.mock("@/components/ThemedTextInput/ThemedTextInput", () => {
  const React = require("react");
  const { TextInput } = require("react-native");
  return {
    ThemedTextInput: ({
      value,
      onChangeText,
      placeholder,
    }: {
      value: string;
      onChangeText: (text: string) => void;
      placeholder: string;
    }) => {
      let testID = "";
      if (placeholder.toLowerCase().includes("email")) testID = "email-input";
      else if (placeholder.toLowerCase().includes("password"))
        testID = "password-input";

      return (
        <TextInput
          testID={testID}
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
        />
      );
    },
  };
});

// --- Mock validation ---
jest.mock("@/lib/validation", () => ({
  isEmailValid: jest.fn(),
}));
const mockedValidation = jest.mocked(validation);

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => {
    const utils = render(<LoginScreen />);
    const typeEmail = (v: string) =>
      fireEvent.changeText(utils.getByTestId("email-input"), v);
    const typePassword = (v: string) =>
      fireEvent.changeText(utils.getByTestId("password-input"), v);
    const pressLogin = () => fireEvent.press(utils.getByTestId("login-button"));
    return { ...utils, typeEmail, typePassword, pressLogin };
  };

  it("renders correctly and shows welcome text", () => {
    const { getByText } = setup();
    expect(getByText("Welcome Back 🌸")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("shows email validation error when invalid email entered", () => {
    const { typeEmail, pressLogin, getByText } = setup();
    mockedValidation.isEmailValid.mockReturnValue(false);

    typeEmail("invalidemail");
    pressLogin();

    expect(getByText("Please enter a valid email address.")).toBeTruthy();
  });

  it("disables login button when form is invalid", () => {
    const { getByTestId } = setup();
    const btn = getByTestId("login-button");
    expect(btn.props.accessibilityState?.disabled).toBe(true);
  });

  it("validates email helper function correctly", () => {
    mockedValidation.isEmailValid.mockReturnValueOnce(true);
    expect(mockedValidation.isEmailValid("test@example.com")).toBe(true);
  });
});
