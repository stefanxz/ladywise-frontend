import merge from "lodash.merge";
import React, { createContext, useContext, useState } from "react";

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
  reset: () => void;
};

const DEFAULT_ANSWERS: QuestionnaireAnswers = {
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

/**
 * QuestionnaireProvider
 * 
 * Context provider that holds the state of the onboarding questionnaire answers.
 * Allows components to read and update the user's responses across different screens.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The context provider
 */
export function QuestionnaireProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(DEFAULT_ANSWERS);

  const updateAnswers = (patch: Partial<QuestionnaireAnswers>) => {
    setAnswers((prev) => merge({}, prev, patch));
  };

  const reset = () => setAnswers(DEFAULT_ANSWERS);

  return (
    <QuestionnaireContext.Provider value={{ answers, updateAnswers, reset }}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

/**
 * useQuestionnaire
 * 
 * Hook to access the QuestionnaireContext.
 * 
 * @returns {QuestionnaireContextValue} The context value (answers, updateAnswers, reset)
 * @throws {Error} If used outside of a QuestionnaireProvider
 */
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
