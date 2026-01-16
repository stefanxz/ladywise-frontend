import QuestionnaireAnemiaRisk from "@/app/onboarding/questionnaire-anemia-risk";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/onboarding/QuestionnaireContext");

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe("QuestionnaireAnemiaRisk", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { anemiaRiskFactors: [] },
    });
    render(<QuestionnaireAnemiaRisk />);
    expect(screen.getByText("Health background Anemia risk 🩸")).toBeTruthy();
    expect(screen.getByText("Iron deficiency")).toBeTruthy();
  });

  it("selects and deselects options", () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { anemiaRiskFactors: [] },
      updateAnswers: jest.fn(),
    });
    render(<QuestionnaireAnemiaRisk />);
    const ironDeficiency = screen.getByTestId(
      "multiselect-option-iron-deficiency",
    );
    fireEvent.press(ironDeficiency);
  });

  it('handles "None of the above" correctly', () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { anemiaRiskFactors: [] },
      updateAnswers: jest.fn(),
    });
    render(<QuestionnaireAnemiaRisk />);
    const ironDeficiency = screen.getByTestId(
      "multiselect-option-iron-deficiency",
    );
    const none = screen.getByTestId("multiselect-option-none");

    fireEvent.press(ironDeficiency);
    fireEvent.press(none);
  });

  it("calls updateAnswers and navigates on continue", () => {
    const updateAnswers = jest.fn();
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { anemiaRiskFactors: [] },
      updateAnswers,
    });
    render(<QuestionnaireAnemiaRisk />);

    const ironDeficiency = screen.getByTestId(
      "multiselect-option-iron-deficiency",
    );
    fireEvent.press(ironDeficiency);

    fireEvent.press(screen.getByText("Continue"));

    expect(updateAnswers).toHaveBeenCalledWith({
      anemiaRiskFactors: ["iron-deficiency"],
    });
    expect(mockPush).toHaveBeenCalledWith("./questionnaire-thrombosis-risk");
  });

  it("disables continue until an option is selected", () => {
    const updateAnswers = jest.fn();
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { anemiaRiskFactors: [] },
      updateAnswers,
    });
    render(<QuestionnaireAnemiaRisk />);

    const continueButton = screen.getByTestId("themed-pressable");
    expect(continueButton.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(screen.getByTestId("multiselect-option-iron-deficiency"));
    expect(continueButton.props.accessibilityState.disabled).toBe(false);

    fireEvent.press(screen.getByText("Continue"));
    expect(updateAnswers).toHaveBeenCalled();
  });

  it("handles skipping", () => {
    const updateAnswers = jest.fn();
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { anemiaRiskFactors: [] },
      updateAnswers,
    });
    render(<QuestionnaireAnemiaRisk />);

    fireEvent.press(screen.getByText("Skip"));

    expect(updateAnswers).toHaveBeenCalledWith({
      anemiaRiskFactors: [],
    });
    expect(mockPush).toHaveBeenCalledWith("./questionnaire-thrombosis-risk");
  });

  it("deselects an already selected option", () => {
    render(<QuestionnaireAnemiaRisk />);
    const option = screen.getByTestId("multiselect-option-iron-deficiency");
    
    // Select
    fireEvent.press(option);
    expect(option.props.accessibilityState.selected).toBe(true);
    
    // Deselect (hits 'if (exists)' branch)
    fireEvent.press(option);
    expect(option.props.accessibilityState.selected).toBe(false);
  });
});
