import React from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export type CycleQuestionsBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  onSave: (answers: DailyCycleAnswers) => Promise<void>;
};

export type CycleQuestionProps = {
  question: string;
  options: string[];
  multiSelect?: boolean;
  onSelect?: (selected: string[] | string) => void;
  resetOption?: string;
};

export type CycleQuestionOptionPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export type QuestionConfig = {
  key: keyof DailyCycleAnswers;
  question: string;
  options: string[];
  multiSelect?: boolean;
};

export type DailyCycleAnswers = {
  flow: string | null;
  symptoms: string[];
  riskFactors: string[];
  date: string; // date of the cycle questionnaire being updated, NOT the day on which the user updates it
};
