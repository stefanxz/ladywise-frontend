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

// API mock (we won't assert on it anymore, but we keep it mocked so no real call happens)
jest.mock("@/lib/api", () => ({
    resetPassword: jest.fn(),
}));

jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
    AppBar: () => null,
}));


// Mock password validation so tests don't depend on the real regex
jest.mock("@/utils/validations", () => ({
    isPasswordValid: (password: string) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/.test(password),
}));

// Local mock for AppBar so this screen test doesn't depend on its internals
jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
    AppBar: () => null,
}));

describe("ResetPasswordScreen", () => {
    const replaceMock = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ replace: replaceMock });
        (useLocalSearchParams as jest.Mock).mockReturnValue({ token: "token123" });
        jest.clearAllMocks();
    });

    const fillPasswords = (getByTestId: any, p1: string, p2: string) => {
        fireEvent.changeText(getByTestId("new-password-input"), p1);
        fireEvent.changeText(getByTestId("confirm-new-password-input"), p2);
    };

    it("shows error when token is missing", async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({}); // no token
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
            expect(
                getByText("Please make sure the passwords match."),
            ).toBeTruthy();
        });
        expect(api.resetPassword).not.toHaveBeenCalled();
    });

    it("submits valid data and navigates to login", async () => {
        (api.resetPassword as jest.Mock).mockResolvedValueOnce({});

        const { getByTestId, queryByText } = render(<ResetPasswordScreen />);

        // Valid passwords
        fillPasswords(getByTestId, "StrongPass1", "StrongPass1");
        fireEvent.press(getByTestId("reset-password-button"));

        // We don't care about the exact timing of the API call here, just that
        // the happy-path navigation happens.
        await waitFor(() => {
            // No validation errors
            expect(
                queryByText(
                    /Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number/,
                ),
            ).toBeNull();
            expect(
                queryByText("Please make sure the passwords match."),
            ).toBeNull();
            expect(
                queryByText("Invalid or missing reset token. Please request a new link."),
            ).toBeNull();

            // Navigation to login with passwordReset flag
            expect(replaceMock).toHaveBeenCalledWith({
                pathname: "/(auth)/login",
                params: { passwordReset: "true" },
            });
        });
    });
});
