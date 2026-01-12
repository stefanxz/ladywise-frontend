import React from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export type CycleQuestionsBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  onSave: (answers: DailyCycleAnswers) => Promise<void>;
  initialData: DailyCycleAnswers | null;
  isLoading: boolean;
};

export type CycleQuestionProps = {
  question: string;
  options: string[];
  multiSelect?: boolean;
  onSelect?: (selected: string[] | string) => void;
  resetOption?: string;
  value: string | string[] | null;
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

/**
 * Represents the complete set of answers for a daily cycle log.
 */
export type DailyCycleAnswers = {
  /** Flow level (e.g., Light, Medium, Heavy) or null. */
  flow: string | null;
  /** List of selected symptoms. */
  symptoms: string[];
  /** List of selected risk factors. */
  riskFactors: string[];
  /** Date of the cycle questionnaire being updated (ISO string). */
  date: string;
};
