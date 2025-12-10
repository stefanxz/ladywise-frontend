import QuestionnaireFinalQuestions from "@/app/onboarding/questionnaire-final-questions";
import { useQuestionnaire } from "@/app/onboarding/QuestionnaireContext";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { submitQuestionnaire } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  submitQuestionnaire: jest.fn(),
}));

jest.mock("@/app/onboarding/QuestionnaireContext");
jest.mock("@/context/AuthContext");

const mockPush = jest.fn();
const mockReplace = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
  replace: mockReplace,
});

describe("QuestionnaireFinalQuestions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      userId: "test-user-id",
    });
  });

  it("renders correctly", () => {
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: {
        usesEstrogenContraception: null,
        usesBiosensorCup: null,
      },
      reset: jest.fn(),
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
    fireEvent.press(screen.getByText("Finish"));

    await waitFor(() => {
      expect(updateAnswers).toHaveBeenCalledWith({
        usesEstrogenContraception: true,
        usesBiosensorCup: false,
      });
      expect(submitQuestionnaire).toHaveBeenCalledWith({
        health: {
          personalDetails: {
            age: 25,
            weight: 60,
            height: 170,
          },
          familyHistory: {
            familyHistoryAnemia: false,
            familyHistoryThrombosis: false,
            anemiaConditions: [],
            thrombosisConditions: [],
          },
          estrogenPill: true,
          biosensorCup: false,
        },
        history: [],
      });
      expect(reset).toHaveBeenCalled();
    });
  });

  it("does not submit if userId is null", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      userId: null,
    });
    (useQuestionnaire as jest.Mock).mockReturnValue({
      answers: { userId: null },
      updateAnswers: jest.fn(),
      reset: jest.fn(),
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
      reset: jest.fn(),
    });
    render(<QuestionnaireFinalQuestions />);

    fireEvent.press(screen.getByTestId("estrogen-yes"));
    fireEvent.press(screen.getByTestId("biosensor-no"));
    fireEvent.press(screen.getByText("Finish"));

    await waitFor(() => {
      expect(screen.getByText("Submission failed")).toBeTruthy();
    });
  });

  it("submits with null values if finish is pressed without answers", async () => {
    const updateAnswers = jest.fn();
    const reset = jest.fn();
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
      reset,
    });
    render(<QuestionnaireFinalQuestions />);

    const finishButton = screen.getByText("Finish");
    fireEvent.press(finishButton);

    await waitFor(() => {
      expect(submitQuestionnaire).toHaveBeenCalledWith(
        expect.objectContaining({
          health: expect.not.objectContaining({
            estrogenPill: expect.anything(),
            biosensorCup: expect.anything(),
          }),
        }),
      );
    });
  });
});
