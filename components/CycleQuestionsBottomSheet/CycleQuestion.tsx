import React, { useState } from "react";
import { View, Text } from "react-native";
import { CycleQuestionOptionPill } from "./CycleQuestionOptionPill";
import { CycleQuestionProps } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";

/**
 * Renders a single question with multiple selectable options.
 * Supports both single-select and multi-select behavior.
 * Multi-select questions can include a "None of the above" option that clears other selections.
 *
 * Props:
 * @param question - The text of the question
 * @param options - Array of string options for this question
 * @param multiSelect - Whether the question allows multiple selections
 * @param onSelect - Callback that returns the currently selected value(s)
 * @param resetOption - Resets chosen answers and selects the reset option
 */
export function CycleQuestion({
  question,
  options,
  multiSelect = false,
  onSelect,
  resetOption = "None of the above",
}: CycleQuestionProps) {
  const [selected, setSelected] = useState<string[] | string | null>(
    multiSelect ? [] : null,
  );

  const handleSelect = (option: string) => {
    if (multiSelect) {
      let newSelection: string[];
      if (option === resetOption) {
        newSelection = [resetOption];
      } else {
        newSelection = Array.isArray(selected) ? [...selected] : [];
        if (selected?.includes(resetOption)) newSelection = [];
        if (newSelection.includes(option)) {
          newSelection = newSelection.filter((o) => o !== option);
        } else {
          newSelection.push(option);
        }
      }
      setSelected(newSelection);
      onSelect?.(newSelection);
    } else {
      setSelected(option);
      onSelect?.(option);
    }
  };

  const isSelected = (option: string) => {
    if (multiSelect) return (selected as string[]).includes(option);
    return selected === option;
  };

  return (
    <View className="mb-6">
      <Text className="text-[16px] font-semibold text-headingText mb-3">
        {question}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option: string) => (
          <CycleQuestionOptionPill
            key={option}
            label={option}
            selected={isSelected(option)}
            onPress={() => handleSelect(option)}
          />
        ))}
      </View>
    </View>
  );
}
