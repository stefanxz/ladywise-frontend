import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PasswordRecovery from "@/app/(auth)/password_recovery";
import * as api from "@/lib/api";
import { useRouter } from "expo-router";

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
    requestPasswordReset: jest.fn(),
}));

jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
    AppBar: () => null,
}));

describe("PasswordRecovery screen", () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
        jest.clearAllMocks();
    });

    it("shows validation error for empty email", async () => {
        const { getByTestId, getByText } = render(<PasswordRecovery />);

        fireEvent.press(getByTestId("continue-button"));

        await waitFor(() => {
            expect(getByText("Please enter your email.")).toBeTruthy();
        });
        expect(api.requestPasswordReset).not.toHaveBeenCalled();
    });

    it("shows validation error for invalid email", async () => {
        const { getByTestId, getByText } = render(<PasswordRecovery />);

        fireEvent.changeText(getByTestId("email-input"), "invalid-email");
        fireEvent.press(getByTestId("continue-button"));

        await waitFor(() => {
            expect(
                getByText("Email must have the format example@domain.com."),
            ).toBeTruthy();
        });
        expect(api.requestPasswordReset).not.toHaveBeenCalled();
    });

    it("submits valid email and navigates to info screen", async () => {
        (api.requestPasswordReset as jest.Mock).mockResolvedValueOnce({});

        const { getByTestId } = render(<PasswordRecovery />);

        fireEvent.changeText(getByTestId("email-input"), "  user@example.com  ");
        fireEvent.press(getByTestId("continue-button"));

        await waitFor(() => {
            expect(api.requestPasswordReset).toHaveBeenCalledWith({
                email: "user@example.com",
            });
            expect(pushMock).toHaveBeenCalledWith(
                "/(auth)/password_recovery/mail-sent-info",
            );
        });
    });

    it("shows generic error when API fails", async () => {
        (api.requestPasswordReset as jest.Mock).mockRejectedValueOnce(
            new Error("Network error"),
        );

        const { getByTestId, getByText } = render(<PasswordRecovery />);

        fireEvent.changeText(getByTestId("email-input"), "user@example.com");
        fireEvent.press(getByTestId("continue-button"));

        await waitFor(() => {
            expect(getByText("Something went wrong. Please try again.")).toBeTruthy();
        });
    });
});
