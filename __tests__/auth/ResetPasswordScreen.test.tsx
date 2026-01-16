import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ResetPasswordScreen from "@/app/(auth)/password_recovery/reset-password";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as api from "@/lib/api";

// Router mock
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

// API mock
jest.mock("@/lib/api", () => ({
  resetPassword: jest.fn(),
}));

// AppBarBackButton mock
jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => null,
}));

describe("ResetPasswordScreen", () => {
  const replaceMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: replaceMock });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ token: "token123" });
  });

  const fillPasswords = (getByTestId: any, p1: string, p2: string) => {
    fireEvent.changeText(getByTestId("new-password-input"), p1);
    fireEvent.changeText(getByTestId("confirm-new-password-input"), p2);
  };

  it("shows error when token is missing", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({});
    const { getByTestId, getByText } = render(<ResetPasswordScreen />);

    fillPasswords(getByTestId, "StrongPass1", "StrongPass1");
    fireEvent.press(getByTestId("reset-password-button"));

    await waitFor(() => {
      expect(
        getByText("Invalid or missing reset token. Please request a new link."),
      ).toBeTruthy();
    });
    expect(api.resetPassword).not.toHaveBeenCalled();
  });

  it("validates weak password", async () => {
    const { getByTestId, getByText } = render(<ResetPasswordScreen />);

    fillPasswords(getByTestId, "weak", "weak");
    fireEvent.press(getByTestId("reset-password-button"));

    await waitFor(() => {
      expect(
        getByText(
          /Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number/,
        ),
      ).toBeTruthy();
    });
    expect(api.resetPassword).not.toHaveBeenCalled();
  });

  it("validates password mismatch", async () => {
    const { getByTestId, getByText } = render(<ResetPasswordScreen />);

    fillPasswords(getByTestId, "StrongPass1", "DifferentPass1");
    fireEvent.press(getByTestId("reset-password-button"));

    await waitFor(() => {
      expect(getByText("Please make sure the passwords match.")).toBeTruthy();
    });
    expect(api.resetPassword).not.toHaveBeenCalled();
  });

  it("submits valid data and navigates to login", async () => {
    (api.resetPassword as jest.Mock).mockResolvedValueOnce({});

    const { getByTestId, queryByText } = render(<ResetPasswordScreen />);

    // Valid passwords
    fillPasswords(getByTestId, "StrongPass1", "StrongPass1");
    fireEvent.press(getByTestId("reset-password-button"));

    await waitFor(() => {
      expect(api.resetPassword).toHaveBeenCalledTimes(1);
      expect(api.resetPassword).toHaveBeenCalledWith({
        token: "token123",
        newPassword: "StrongPass1",
      });

      // No validation errors
      expect(
        queryByText(
          /Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number/,
        ),
      ).toBeNull();
      expect(queryByText("Please make sure the passwords match.")).toBeNull();
      expect(
        queryByText(
          "Invalid or missing reset token. Please request a new link.",
        ),
      ).toBeNull();

      // Navigate to login with passwordReset set to true
      expect(replaceMock).toHaveBeenCalledWith({
        pathname: "/(auth)/login",
        params: { passwordReset: "true" },
      });
    });
  });

  it("clears validation errors when user types", async () => {
    const { getByTestId, queryByText, getByText } = render(<ResetPasswordScreen />);

    // Trigger validation error
    fillPasswords(getByTestId, "weak", "weak");
    fireEvent.press(getByTestId("reset-password-button"));

    await waitFor(() => {
      expect(getByText(/Password must contain at least 8 characters/)).toBeTruthy();
    });

    // Type in new password field
    fireEvent.changeText(getByTestId("new-password-input"), "S");
    
    // Error should be gone
    expect(queryByText(/Password must contain at least 8 characters/)).toBeNull();
  });

  it("clears confirm password error when user types in confirm field", async () => {
    const { getByTestId, queryByText, getByText } = render(<ResetPasswordScreen />);

    // Trigger mismatch error
    fillPasswords(getByTestId, "StrongPass1", "Mismatch");
    fireEvent.press(getByTestId("reset-password-button"));

    await waitFor(() => {
      expect(getByText("Please make sure the passwords match.")).toBeTruthy();
    });

    // Type in confirm field
    fireEvent.changeText(getByTestId("confirm-new-password-input"), "StrongPass1");

    expect(queryByText("Please make sure the passwords match.")).toBeNull();
  });

  it("handles API error during reset", async () => {
    const errorMessage = "Network error";
    (api.resetPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { getByTestId, getByText } = render(<ResetPasswordScreen />);

    fillPasswords(getByTestId, "StrongPass1", "StrongPass1");
    fireEvent.press(getByTestId("reset-password-button"));

    await waitFor(() => {
      expect(getByText(errorMessage)).toBeTruthy();
    });
  });

  it("handles unknown non-Error objects thrown by API", async () => {
    (api.resetPassword as jest.Mock).mockRejectedValueOnce("Unknown error");

    const { getByTestId, getByText } = render(<ResetPasswordScreen />);

    fillPasswords(getByTestId, "StrongPass1", "StrongPass1");
    fireEvent.press(getByTestId("reset-password-button"));

    await waitFor(() => {
      expect(getByText("We couldn't reset your password. Please try again.")).toBeTruthy();
    });
  });
});
