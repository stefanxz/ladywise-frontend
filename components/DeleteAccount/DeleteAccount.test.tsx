import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import DeleteAccountModal from "./DeleteAccount";

describe("DeleteAccountModal", () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal when visible is true", () => {
    render(<DeleteAccountModal {...defaultProps} />);

    expect(screen.getByText("Delete account")).toBeOnTheScreen();
    expect(
      screen.getByText(
        "This action is permanent. Your profile, data, and all associated content will be deleted. This cannot be undone.",
      ),
    ).toBeOnTheScreen();
  });

  it("does not render the modal when visible is false", () => {
    render(<DeleteAccountModal {...defaultProps} visible={false} />);

    expect(screen.queryByText("Delete account")).not.toBeOnTheScreen();
  });

  it("renders with custom title and message", () => {
    render(
      <DeleteAccountModal
        {...defaultProps}
        title="Custom Title"
        message="Custom message text"
      />,
    );

    expect(screen.getByText("Custom Title")).toBeOnTheScreen();
    expect(screen.getByText("Custom message text")).toBeOnTheScreen();
  });

  it("calls onCancel when cancel button is pressed", () => {
    render(<DeleteAccountModal {...defaultProps} />);

    const cancelButton = screen.getByLabelText("Cancel delete account");
    fireEvent.press(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when backdrop is pressed", () => {
    render(<DeleteAccountModal {...defaultProps} />);

    const backdrop = screen.getByLabelText(
      "Close delete account dialog backdrop",
    );
    fireEvent.press(backdrop);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when delete button is pressed", async () => {
    render(<DeleteAccountModal {...defaultProps} />);

    const deleteButton = screen.getByLabelText("Confirm delete account");
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it("shows loading indicator during async onConfirm", async () => {
    const onConfirm = jest.fn(
      (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    render(<DeleteAccountModal {...defaultProps} onConfirm={onConfirm} />);

    const deleteButton = screen.getByLabelText("Confirm delete account");

    fireEvent.press(deleteButton);

    // Loading indicator should appear
    await waitFor(() => {
      expect(screen.getByTestId("activity-indicator")).toBeOnTheScreen();
    });

    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByTestId("activity-indicator")).not.toBeOnTheScreen();
    });
  });

  it("disables buttons while loading", async () => {
    const onConfirm = jest.fn(
      (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    render(<DeleteAccountModal {...defaultProps} onConfirm={onConfirm} />);

    const deleteButton = screen.getByLabelText("Confirm delete account");
    const cancelButton = screen.getByLabelText("Cancel delete account");

    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(deleteButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });

  it("prevents multiple onConfirm calls when already loading", async () => {
    const onConfirm = jest.fn(
      (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    render(<DeleteAccountModal {...defaultProps} onConfirm={onConfirm} />);

    const deleteButton = screen.getByLabelText("Confirm delete account");

    // Press multiple times rapidly
    fireEvent.press(deleteButton);
    fireEvent.press(deleteButton);
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it("displays error message when onConfirm throws an error", async () => {
    const errorMessage = "Network error occurred";
    const onConfirm = jest.fn(
      (): Promise<void> => Promise.reject(new Error(errorMessage)),
    );

    render(<DeleteAccountModal {...defaultProps} onConfirm={onConfirm} />);

    const deleteButton = screen.getByLabelText("Confirm delete account");
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeOnTheScreen();
    });

    // Modal should stay open
    expect(screen.getByText("Delete account")).toBeOnTheScreen();
  });

  it("displays default error message when error has no message", async () => {
    const onConfirm = jest.fn((): Promise<void> => Promise.reject({}));

    render(<DeleteAccountModal {...defaultProps} onConfirm={onConfirm} />);

    const deleteButton = screen.getByLabelText("Confirm delete account");
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong while deleting the account."),
      ).toBeOnTheScreen();
    });
  });

  it("clears previous error when confirming again", async () => {
    const onConfirm = jest
      .fn()
      .mockRejectedValueOnce(new Error("First error"))
      .mockResolvedValueOnce(undefined);

    const { rerender } = render(
      <DeleteAccountModal {...defaultProps} onConfirm={onConfirm} />,
    );

    const deleteButton = screen.getByLabelText("Confirm delete account");

    // First attempt - fails
    fireEvent.press(deleteButton);
    await waitFor(() => {
      expect(screen.getByText("First error")).toBeOnTheScreen();
    });

    // Second attempt - succeeds
    fireEvent.press(deleteButton);
    await waitFor(() => {
      expect(screen.queryByText("First error")).not.toBeOnTheScreen();
    });
  });

  it("handles synchronous onConfirm", () => {
    const onConfirm = jest.fn();
    render(<DeleteAccountModal {...defaultProps} onConfirm={onConfirm} />);

    const deleteButton = screen.getByLabelText("Confirm delete account");
    fireEvent.press(deleteButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("renders warning icon", () => {
    render(<DeleteAccountModal {...defaultProps} />);

    expect(screen.getByText("!")).toBeOnTheScreen();
  });
});
