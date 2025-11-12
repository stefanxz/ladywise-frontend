import React from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export type CycleQuestionsBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
};

export type CycleQuestionProps = {
  question: string;
  options: string[];
  onSelect: (selected: string) => void;
};

export type CycleQuestionOptionPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};
