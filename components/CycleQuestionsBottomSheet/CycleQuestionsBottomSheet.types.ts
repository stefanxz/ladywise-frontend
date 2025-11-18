import React from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export type CycleQuestionsBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  onSave: (answers: Record<number, string | string[]>) => Promise<void>;
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
