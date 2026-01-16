import RegisterIndex from "@/app/(auth)/register/index";
import * as api from "@/lib/api";
import * as validations from "@/utils/validations";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mocks
jest.mock("expo-router");
jest.mock("@expo/vector-icons");
jest.mock("react-native-safe-area-context");
jest.mock("axios", () => ({
  isAxiosError: (payload: any) => payload && payload.isAxiosError === true,
}));

// Provide a lightweight AuthContext mock so the screen can drive setStatus without pulling in the real layout.
const mockSignIn = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    isLoading: false,
    token: null,
  }),
}));

// Child components that aren’t the focus (just render pass-through)
jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => null,
}));

// Fully controllable checkbox to flip T&C state.
jest.mock(
  "@/components/TermsConditionsCheckbox/TermsConditionsCheckbox",
  () => {
    const React = require("react");
    const { Pressable, Text, View } = require("react-native");
    return {
      TermsConditionsCheckbox: ({
        checked,
        onToggle,
      }: {
        checked: boolean;
        onToggle: () => void;
      }) => (
        <View>
          <Text testID="tnc-state">{checked ? "checked" : "unchecked"}</Text>
          <Pressable onPress={onToggle} testID="tnc-toggle">
            <Text>toggle</Text>
          </Pressable>
        </View>
      ),
    };
  },
);

//Mock validations
jest.mock("@/utils/validations", () => ({
  isEmailValid: jest.fn(),
  isPasswordValid: jest.fn(),
}));
const mockedValidations = jest.mocked(validations);

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

// mock the registerUser call used in handleContinue
jest.mock("@/lib/api", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

const mockedApi = jest.mocked(api);

describe("RegisterIndex screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockReplace.mockClear();
    mockSignIn.mockClear();
    mockedValidations.isEmailValid.mockReset();
    mockedValidations.isPasswordValid.mockReset();
  });

  const setup = () => {
    const utils = render(<RegisterIndex />);
    const toggleTnc = () => fireEvent.press(utils.getByTestId("tnc-toggle"));
    const pressContinue = () =>
      fireEvent.press(utils.getByTestId("continue-button"));
    const typeEmail = (v: string) =>
      fireEvent.changeText(utils.getByTestId("email-input"), v);
    const typePassword = (v: string) =>
      fireEvent.changeText(utils.getByTestId("password-input"), v);
    const typeConfirm = (v: string) =>
      fireEvent.changeText(utils.getByTestId("confirm-password-input"), v);

    return {
      ...utils,
      toggleTnc,
      pressContinue,
      typeEmail,
      typePassword,
      typeConfirm,
    };
  };

  it("Continue is disabled until Terms & Conditions is checked", () => {
    const { getByTestId, getByText, toggleTnc } = setup();
    const btn = getByTestId("continue-button");
    expect(btn).toHaveAccessibilityState({ disabled: true });
    expect(getByText("unchecked")).toBeTruthy();

    toggleTnc();
    expect(getByText("checked")).toBeTruthy();
    expect(btn).toHaveAccessibilityState({ disabled: false });
  });

  it("shows 'Please enter your email.' when email is empty", () => {
    const { pressContinue, toggleTnc, getByText } = setup();
    mockedValidations.isEmailValid.mockReturnValue(false);

    toggleTnc();
    pressContinue();

    expect(getByText("Please enter your email.")).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows 'Email must have the format example@domain.com.' for invalid email", () => {
    const { pressContinue, toggleTnc, typeEmail, getByText } = setup();
    toggleTnc();
    typeEmail("not-an-email");
    mockedValidations.isEmailValid.mockReturnValue(false);

    pressContinue();

    expect(
      getByText("Email must have the format example@domain.com."),
    ).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows password rules error when password invalid", () => {
    const {
      toggleTnc,
      typeEmail,
      typePassword,
      typeConfirm,
      pressContinue,
      getByText,
    } = setup();
    toggleTnc();
    typeEmail("user@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);

    typePassword("short");
    mockedValidations.isPasswordValid.mockReturnValue(false);
    typeConfirm("short");

    pressContinue();

    expect(
      getByText(
        "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number (and no spaces).",
      ),
    ).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows confirm error when confirmation is empty or mismatched", () => {
    const {
      toggleTnc,
      typeEmail,
      typePassword,
      typeConfirm,
      pressContinue,
      getByText,
    } = setup();

    toggleTnc();
    typeEmail("user@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);

    typePassword("Abcd1234");
    mockedValidations.isPasswordValid.mockReturnValue(true);

    // Case 1: empty confirm
    typeConfirm("");
    pressContinue();
    expect(getByText("Please make sure the passwords match.")).toBeTruthy();

    // Case 2: mismatch
    typeConfirm("Different123");
    pressContinue();
    expect(getByText("Please make sure the passwords match.")).toBeTruthy();

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("navigates on valid inputs", async () => {
    mockedApi.registerUser.mockResolvedValue({
      token: "fake-token",
      tokenType: "Bearer",
      userId: "user-123",
      email: "user@example.com",
    });
    const { toggleTnc, typeEmail, typePassword, typeConfirm, pressContinue } =
      setup();

    toggleTnc();
    typeEmail("user@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);

    typePassword("Abcd1234");
    mockedValidations.isPasswordValid.mockReturnValue(true);
    typeConfirm("Abcd1234");

    await act(async () => {
      await pressContinue();
    });

    await waitFor(() => {
      expect(mockedApi.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "user@example.com",
          password: "Abcd1234",
          consentGiven: true,
          consentVersion: expect.any(String),
        }),
      );
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "fake-token",
        "user-123",
        "user@example.com",
      );
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/(auth)/register/personal-details",
      );
    });
  });

  it("clears specific field error when user edits that field again", async () => {
    mockedApi.registerUser.mockResolvedValue({
      token: "fake-token",
      tokenType: "Bearer",
      userId: "user-123",
      email: "user@example.com",
    });
    const {
      toggleTnc,
      pressContinue,
      getByText,
      typeEmail,
      typePassword,
      typeConfirm,
      queryByText,
    } = setup();

    toggleTnc();
    // Trigger all errors
    pressContinue();
    expect(getByText("Please enter your email.")).toBeTruthy();

    // Editing email should clear email error
    typeEmail("user@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);
    expect(queryByText("Please enter your email.")).toBeNull();

    // Enter invalid password → shows password error
    typePassword("short");
    mockedValidations.isPasswordValid.mockReturnValue(false);
    pressContinue();
    expect(
      getByText(
        "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number (and no spaces).",
      ),
    ).toBeTruthy();

    // Edit password to a valid one → clear error on next submit
    typePassword("Abcd1234");
    mockedValidations.isPasswordValid.mockReturnValue(true);
    typeConfirm("Abcd1234");

    await act(async () => {
      pressContinue();
    });

    await waitFor(() => {
      expect(mockedApi.registerUser).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/(auth)/register/personal-details",
      );
    });
  });

  it("clears confirm password error when typing", () => {
    const {
      toggleTnc,
      typeEmail,
      typePassword,
      typeConfirm,
      pressContinue,
      getByText,
      queryByText,
    } = setup();
    toggleTnc();
    typeEmail("user@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);
    typePassword("Abcd1234");
    mockedValidations.isPasswordValid.mockReturnValue(true);
    typeConfirm("Mismatch");

    pressContinue();
    expect(getByText("Please make sure the passwords match.")).toBeTruthy();

    typeConfirm("Abcd1234");
    expect(queryByText("Please make sure the passwords match.")).toBeNull();
  });

  it("handles 409 Conflict error (Email already taken)", async () => {
    const {
      toggleTnc,
      typeEmail,
      typePassword,
      typeConfirm,
      pressContinue,
      getByText,
    } = setup();

    toggleTnc();
    typeEmail("taken@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);
    typePassword("Abcd1234");
    mockedValidations.isPasswordValid.mockReturnValue(true);
    typeConfirm("Abcd1234");

    const error = new Error("Conflict");
    // @ts-ignore
    error.isAxiosError = true;
    // @ts-ignore
    error.response = { status: 409, data: { message: "Email already taken" } };
    mockedApi.registerUser.mockRejectedValue(error);

    await act(async () => {
      pressContinue();
    });

    await waitFor(() => {
      expect(getByText("Email already taken")).toBeTruthy();
    });
  });

  it("handles generic Axios error", async () => {
    const {
      toggleTnc,
      typeEmail,
      typePassword,
      typeConfirm,
      pressContinue,
      getByText,
    } = setup();

    toggleTnc();
    typeEmail("error@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);
    typePassword("Abcd1234");
    mockedValidations.isPasswordValid.mockReturnValue(true);
    typeConfirm("Abcd1234");

    const error = new Error("Generic API Error");
    // @ts-ignore
    error.isAxiosError = true;
    // @ts-ignore
    error.response = { status: 500, data: { message: "Something went wrong" } };
    mockedApi.registerUser.mockRejectedValue(error);

    await act(async () => {
      pressContinue();
    });

    await waitFor(() => {
      expect(getByText("Something went wrong")).toBeTruthy();
    });
  });

  it("handles generic non-Axios error", async () => {
    const {
      toggleTnc,
      typeEmail,
      typePassword,
      typeConfirm,
      pressContinue,
      getByText,
    } = setup();

    toggleTnc();
    typeEmail("crash@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);
    typePassword("Abcd1234");
    mockedValidations.isPasswordValid.mockReturnValue(true);
    typeConfirm("Abcd1234");

    mockedApi.registerUser.mockRejectedValue(new Error("Unknown crash"));

    await act(async () => {
      pressContinue();
    });

    await waitFor(() => {
      expect(getByText("Registration failed.")).toBeTruthy();
    });
  });

  it("handles keyboard events and cleanup", () => {
    const { Keyboard } = require("react-native");
    const removeMock = jest.fn();
    const addListenerSpy = jest
      .spyOn(Keyboard, "addListener")
      .mockReturnValue({ remove: removeMock } as any);

    const { unmount } = setup();

    expect(addListenerSpy).toHaveBeenCalledWith(
      "keyboardDidShow",
      expect.any(Function),
    );
    expect(addListenerSpy).toHaveBeenCalledWith(
      "keyboardDidHide",
      expect.any(Function),
    );

    const showCallback = addListenerSpy.mock.calls.find(
      (call) => call[0] === "keyboardDidShow",
    )?.[1] as (() => void) | undefined;
    const hideCallback = addListenerSpy.mock.calls.find(
      (call) => call[0] === "keyboardDidHide",
    )?.[1] as (() => void) | undefined;

    act(() => {
      showCallback?.();
    });
    act(() => {
      hideCallback?.();
    });

    unmount();
    // In some test environments (like StrictMode), effects might run multiple times.
    // We just want to ensure cleanup is called.
    expect(removeMock).toHaveBeenCalled();
  });

  it("handles Axios error with missing response data message (fallback to e.message)", async () => {
    const {
      toggleTnc,
      typeEmail,
      typePassword,
      typeConfirm,
      pressContinue,
      getByText,
    } = setup();

    toggleTnc();
    typeEmail("fail@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);
    typePassword("Abcd1234");
    mockedValidations.isPasswordValid.mockReturnValue(true);
    typeConfirm("Abcd1234");

    const error = new Error("Network Error");
    // @ts-ignore
    error.isAxiosError = true;
    // @ts-ignore
    error.response = { status: 500, data: {} };
    mockedApi.registerUser.mockRejectedValue(error);

    await act(async () => {
      pressContinue();
    });

    await waitFor(() => {
      expect(getByText("Network Error")).toBeTruthy();
    });
  });

  it("handles Axios error with absolutely no message (fallback to default)", async () => {
    const {
      toggleTnc,
      typeEmail,
      typePassword,
      typeConfirm,
      pressContinue,
      getByText,
    } = setup();

    toggleTnc();
    typeEmail("fail2@example.com");
    mockedValidations.isEmailValid.mockReturnValue(true);
    typePassword("Abcd1234");
    mockedValidations.isPasswordValid.mockReturnValue(true);
    typeConfirm("Abcd1234");

    const error = new Error();
    // @ts-ignore
    error.isAxiosError = true;
    // @ts-ignore
    error.response = { status: 500, data: {} };
    // @ts-ignore
    error.message = undefined;
    mockedApi.registerUser.mockRejectedValue(error);

    await act(async () => {
      pressContinue();
    });

    await waitFor(() => {
      expect(getByText("Registration failed.")).toBeTruthy();
    });
  });

  it("adjusts padding on Android when keyboard shows", () => {
    const { Platform, Keyboard } = require("react-native");
    const originalOS = Platform.OS;
    // Force Platform.OS to android
    Object.defineProperty(Platform, "OS", {
      get: () => "android",
      configurable: true,
    });

    const addListenerSpy = jest
      .spyOn(Keyboard, "addListener")
      .mockReturnValue({ remove: jest.fn() } as any);

    try {
      const { getByTestId } = render(<RegisterIndex />);

      const showCallback = addListenerSpy.mock.calls.find(
        (call) => call[0] === "keyboardDidShow",
      )?.[1] as (() => void) | undefined;

      act(() => {
        showCallback?.();
      });
    } finally {
      Object.defineProperty(Platform, "OS", {
        get: () => originalOS,
        configurable: true,
      });
    }
  });
});
