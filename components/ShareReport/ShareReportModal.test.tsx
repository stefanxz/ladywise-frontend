import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import ShareReportModal from "./ShareReportModal";
import { useAuth } from "@/context/AuthContext";
import { shareReport } from "@/lib/api";

// Mock dependencies
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  shareReport: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockShareReport = shareReport as jest.Mock;

describe("ShareReportModal", () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    reportType: "FULL_REPORT" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ token: "fake-token" });
  });

  it("renders correctly when visible", () => {
    render(<ShareReportModal {...defaultProps} />);

    expect(screen.getByText("Share Full Report")).toBeTruthy();
    expect(screen.getByTestId("clinician-email-input")).toBeTruthy();
    expect(screen.getByTestId("send-button")).toBeTruthy();
    expect(screen.getByTestId("cancel-button")).toBeTruthy();
  });

  it("renders correct title for thrombosis report", () => {
    render(<ShareReportModal {...defaultProps} reportType="THROMBOSIS_ONLY" />);
    expect(screen.getByText("Share Thrombosis Report")).toBeTruthy();
  });

  it("renders correct title for anemia report", () => {
    render(<ShareReportModal {...defaultProps} reportType="ANEMIA_ONLY" />);
    expect(screen.getByText("Share Anemia Report")).toBeTruthy();
  });

  it("shows validation error for empty email", async () => {
    render(<ShareReportModal {...defaultProps} />);

    fireEvent.press(screen.getByTestId("send-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeTruthy();
      expect(
        screen.getByText("Please enter a clinician email address."),
      ).toBeTruthy();
    });
  });

  it("shows validation error for invalid email format", async () => {
    render(<ShareReportModal {...defaultProps} />);

    fireEvent.changeText(
      screen.getByTestId("clinician-email-input"),
      "invalid-email",
    );
    fireEvent.press(screen.getByTestId("send-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeTruthy();
      expect(
        screen.getByText("Please enter a valid email address."),
      ).toBeTruthy();
    });
  });

  it("displays loading state during submission", async () => {
    mockShareReport.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ShareReportModal {...defaultProps} />);

    fireEvent.changeText(
      screen.getByTestId("clinician-email-input"),
      "doctor@example.com",
    );
    fireEvent.press(screen.getByTestId("send-button"));

    await waitFor(() => {
      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  it("shows success message on successful send", async () => {
    mockShareReport.mockResolvedValue(
      "Report successfully sent to doctor@example.com",
    );

    render(<ShareReportModal {...defaultProps} />);

    fireEvent.changeText(
      screen.getByTestId("clinician-email-input"),
      "doctor@example.com",
    );
    fireEvent.press(screen.getByTestId("send-button"));

    await waitFor(() => {
      expect(screen.getByTestId("success-message")).toBeTruthy();
      expect(
        screen.getByText("Report successfully sent to doctor@example.com"),
      ).toBeTruthy();
    });
  });

  it("shows error message on API failure", async () => {
    mockShareReport.mockRejectedValue(new Error("Network error"));

    render(<ShareReportModal {...defaultProps} />);

    fireEvent.changeText(
      screen.getByTestId("clinician-email-input"),
      "doctor@example.com",
    );
    fireEvent.press(screen.getByTestId("send-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeTruthy();
      expect(screen.getByText("Network error")).toBeTruthy();
    });
  });

  it("calls onClose when cancel button is pressed", () => {
    const onClose = jest.fn();
    render(<ShareReportModal {...defaultProps} onClose={onClose} />);

    fireEvent.press(screen.getByTestId("cancel-button"));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls shareReport with correct payload", async () => {
    mockShareReport.mockResolvedValue("Success");

    render(
      <ShareReportModal
        {...defaultProps}
        reportType="THROMBOSIS_ONLY"
        graphImageBase64="base64image"
        insightSummary="Test insight"
      />,
    );

    fireEvent.changeText(
      screen.getByTestId("clinician-email-input"),
      "doctor@example.com",
    );
    fireEvent.press(screen.getByTestId("send-button"));

    await waitFor(() => {
      expect(mockShareReport).toHaveBeenCalledWith("fake-token", {
        clinicianEmail: "doctor@example.com",
        reportType: "THROMBOSIS_ONLY",
        graphImageBase64: "base64image",
        insightSummary: "Test insight",
      });
    });
  });

  it("hides send button after successful submission", async () => {
    mockShareReport.mockResolvedValue("Success");

    render(<ShareReportModal {...defaultProps} />);

    fireEvent.changeText(
      screen.getByTestId("clinician-email-input"),
      "doctor@example.com",
    );
    fireEvent.press(screen.getByTestId("send-button"));

    // First wait for success message to appear
    await waitFor(() => {
      expect(screen.getByTestId("success-message")).toBeTruthy();
    });

    // Then verify the send button is gone and Close button is shown
    expect(screen.queryByTestId("send-button")).toBeNull();
    expect(screen.getByText("Close")).toBeTruthy();
  });
});
