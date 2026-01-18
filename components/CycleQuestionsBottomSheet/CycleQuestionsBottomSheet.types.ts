import React from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

/**
 * Props for the CycleQuestionsBottomSheet component.
 */
export type CycleQuestionsBottomSheetProps = {
  /** Reference to the bottom sheet modal, allowing parent control (open/close). */
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  /** Callback function executed when the user saves their answers. */
  onSave: (answers: DailyCycleAnswers) => Promise<void>;
  /**
   * Initial data to populate the questionnaire with.
   * Used when editing an existing entry.
   */
  initialData: DailyCycleAnswers | null;
  /** Whether a save operation is currently in progress. */
  isLoading: boolean;
};

/**
 * Configuration for a single question within the cycle questionnaire.
 */
export type CycleQuestionProps = {
  /** The text of the question to display. */
  question: string;
  /** List of available answer options. */
  options: string[];
  /** Whether multiple options can be selected. Defaults to false. */
  multiSelect?: boolean;
  /** Callback when an option is selected or deselected. */
  onSelect?: (selected: string[] | string) => void;
  /**
   * An option value that, when selected, clears all other selections (e.g., "None").
   * Only applicable in multi-select mode.
   */
  resetOption?: string;
  /** The current selected value(s). */
  value: string | string[] | null;
};

/**
 * Props for an individual option pill in the questionnaire.
 */
export type CycleQuestionOptionPillProps = {
  /** The display text for the option. */
  label: string;
  /** Whether this option is currently selected. */
  selected: boolean;
  /** Callback when the pill is pressed. */
  onPress: () => void;
};

/**
 * Structural definition for a question, used to map data keys to UI configuration.
 */
export type QuestionConfig = {
  /** The key in the `DailyCycleAnswers` object that this question updates. */
  key: keyof DailyCycleAnswers;
  /** The text of the question. */
  question: string;
  /** List of available answer options. */
  options: string[];
  /** Whether multiple options can be selected. */
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
