import merge from "lodash.merge";
import { createContext, useContext, useState } from "react";

type BooleanAnswer = boolean | null;

type PersonalDetails = {
  age: string;
  weight: string;
  height: string;
};

type FamilyHistory = {
  anemia: BooleanAnswer;
  thrombosis: BooleanAnswer;
};

export type QuestionnaireAnswers = {
  userId: string | null;
  personal: PersonalDetails;
  familyHistory: FamilyHistory;
  anemiaRiskFactors: string[];
  thrombosisRiskFactors: string[];
  usesEstrogenContraception: BooleanAnswer;
  usesBiosensorCup: BooleanAnswer;
};

type QuestionnaireContextValue = {
  answers: QuestionnaireAnswers;
  updateAnswers: (patch: Partial<QuestionnaireAnswers>) => void;
  setUserId: (id: string | null) => void;
  reset: () => void;
};

const DEFAULT_ANSWERS: QuestionnaireAnswers = {
  userId: null,
  personal: { age: "", weight: "", height: "" },
  familyHistory: { anemia: null, thrombosis: null },
  anemiaRiskFactors: [],
  thrombosisRiskFactors: [],
  usesEstrogenContraception: null,
  usesBiosensorCup: null,
};

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(
  null,
);

export function QuestionnaireProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(DEFAULT_ANSWERS);

  const updateAnswers = (patch: Partial<QuestionnaireAnswers>) => {
    setAnswers((prev) => merge({}, prev, patch));
  };

  const setUserId = (id: string | null) => {
    setAnswers((prev) => ({ ...prev, userId: id }));
  };

  const reset = () =>
    setAnswers((prev) => ({
      ...DEFAULT_ANSWERS,
      userId: prev.userId,
    }));

  return (
    <QuestionnaireContext.Provider
      value={{ answers, updateAnswers, setUserId, reset }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error(
      "useQuestionnaire must be used within a QuestionnaireProvider",
    );
  }
  return context;
}

export const QUESTIONNAIRE_TOTAL_STEPS = 5;
