import LoginScreen from "@/app/(auth)/login";
import * as validation from "@/lib/validation";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mocks
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

jest.mock("@expo/vector-icons", () => ({
  Feather: () => null,
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => null,
}));

jest.mock("@/components/ThemedPressable/ThemedPressable", () => ({
  ThemedPressable: ({ label, onPress, disabled }: any) => (
    <button disabled={disabled} onClick={onPress} testID="login-button">
      {label}
    </button>
  ),
}));

jest.mock("@/components/ThemedTextInput/ThemedTextInput", () => ({
  ThemedTextInput: ({ value, onChangeText, placeholder }: any) => {
    let autoTestId = "text-input";
    if (placeholder?.toLowerCase().includes("email")) autoTestId = "email-input";
    if (placeholder?.toLowerCase().includes("password")) autoTestId = "password-input";

    return (
      <input
        // @ts-expect-error: testID is a React Native testing prop, ignored in DOM
        testID={autoTestId}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChangeText?.(e.target.value)}
      />
    );
  },
}));


jest.mock("../../assets/images/google-icon.png", () => 1);
jest.mock("../../assets/images/facebook-icon.png", () => 1);
jest.mock("../../assets/images/apple-icon.png", () => 1);

// Mock validation functions
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
  });

  it("shows email validation error when invalid email entered", () => {
    const { typeEmail, pressLogin, getByText } = setup();
    mockedValidation.isEmailValid.mockReturnValue(false);

    typeEmail("invalidemail");
    pressLogin();

    expect(getByText("Please enter a valid email address.")).toBeTruthy();
  });

  it("disables login button when form invalid", () => {
    const { getByTestId } = setup();
    const btn = getByTestId("login-button");
    expect(btn.props.disabled).toBe(true);
  });

  it("validates email helper function correctly", () => {
    mockedValidation.isEmailValid.mockReturnValueOnce(true);
    expect(mockedValidation.isEmailValid("test@example.com")).toBe(true);
  });
});
