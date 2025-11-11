import QuestionnaireFinalQuestions from "@/app/onboarding/questionnaire-final-questions";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { submitQuestionnaire } from "@/lib/api";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  submitQuestionnaire: jest.fn(),
}));

jest.mock("@/app/onboarding/QuestionnaireContext");

const mockPush = jest.fn();
const mockReplace = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
  replace: mockReplace,
});

describe("QuestionnaireFinalQuestions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: {
        usesEstrogenContraception: null,
        usesBiosensorCup: null,
      },
    });
    render(<QuestionnaireFinalQuestions />);
    expect(screen.getByText("A few final questions ✨")).toBeTruthy();
    expect(
      screen.getByText("Do you use contraception that contains estrogen?"),
    ).toBeTruthy();
  });

  it("submits answers on finish", async () => {
    const updateAnswers = jest.fn();
    const reset = jest.fn();
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: {
        userId: "test-user-id",
        personal: { age: "25", weight: "60", height: "170" },
        familyHistory: { anemia: false, thrombosis: false },
        anemiaRiskFactors: [],
        thrombosisRiskFactors: [],
        usesEstrogenContraception: null,
        usesBiosensorCup: null,
      },
      updateAnswers,
      reset,
    });
    (submitQuestionnaire as jest.Mock).mockResolvedValue({});
    render(<QuestionnaireFinalQuestions />);

    fireEvent.press(screen.getByTestId("estrogen-yes"));
    fireEvent.press(screen.getByTestId("biosensor-no"));
    await fireEvent.press(screen.getByText("Finish"));

    await waitFor(() => {
      expect(updateAnswers).toHaveBeenCalledWith({
        usesEstrogenContraception: true,
        usesBiosensorCup: false,
      });
      expect(submitQuestionnaire).toHaveBeenCalledWith({
        userId: "test-user-id",
        age: 25,
        weightKg: 60,
        heightCm: 170,
        familyHistory: { anemia: false, thrombosis: false },
        anemiaRiskFactors: [],
        thrombosisRiskFactors: [],
        usesEstrogenContraception: true,
        usesBiosensorCup: false,
      });
      expect(reset).toHaveBeenCalled();
    });
  });

  it("does not submit if userId is null", async () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { userId: null },
      updateAnswers: jest.fn(),
    });
    render(<QuestionnaireFinalQuestions />);

    fireEvent.press(screen.getByTestId("estrogen-yes"));
    fireEvent.press(screen.getByTestId("biosensor-no"));
    fireEvent.press(screen.getByText("Finish"));

    await waitFor(() => {
      expect(submitQuestionnaire).not.toHaveBeenCalled();
    });
  });

  it("handles submission error", async () => {
    (submitQuestionnaire as jest.Mock).mockRejectedValueOnce(
      new Error("Submission failed"),
    );
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: {
        userId: "test-user-id",
        personal: { age: "25", weight: "60", height: "170" },
        familyHistory: { anemia: false, thrombosis: false },
        anemiaRiskFactors: [],
        thrombosisRiskFactors: [],
        usesEstrogenContraception: null,
        usesBiosensorCup: null,
      },
      updateAnswers: jest.fn(),
    });
    render(<QuestionnaireFinalQuestions />);

    fireEvent.press(screen.getByTestId("estrogen-yes"));
    fireEvent.press(screen.getByTestId("biosensor-no"));
    fireEvent.press(screen.getByText("Finish"));

    await waitFor(() => {
      expect(screen.getByText("Submission failed")).toBeTruthy();
    });
  });

  it("shows error messages if finish is pressed without answers", async () => {
    const updateAnswers = jest.fn();
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: {
        usesEstrogenContraception: null,
        usesBiosensorCup: null,
        userId: "test-user-id",
        personal: { age: "25", weight: "60", height: "170" },
        familyHistory: { anemia: false, thrombosis: false },
        anemiaRiskFactors: [],
        thrombosisRiskFactors: [],
      },
      updateAnswers,
    });
    render(<QuestionnaireFinalQuestions />);

    const finishButton = screen.getByText("Finish");

    fireEvent.press(finishButton);

    expect(screen.getAllByText("Please select an answer.")).toHaveLength(2);
    expect(submitQuestionnaire).not.toHaveBeenCalled();

    fireEvent.press(screen.getByTestId("estrogen-yes"));

    expect(screen.queryAllByText("Please select an answer.")).toHaveLength(1);

    fireEvent.press(screen.getByTestId("biosensor-no"));

    expect(screen.queryByText("Please select an answer.")).toBeNull();

    fireEvent.press(finishButton);

    await waitFor(() => {
      expect(submitQuestionnaire).toHaveBeenCalled();
    });
  });
});