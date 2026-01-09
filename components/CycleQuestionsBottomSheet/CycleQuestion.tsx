import React, { useState } from "react";
import { View, Text } from "react-native";
import { CycleQuestionOptionPill } from "./CycleQuestionOptionPill";
import { CycleQuestionProps } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";

/**
 * CycleQuestion
 *
 * Renders a single question with multiple selectable options.
 * Supports both single-select and multi-select behavior.
 * Multi-select questions can include a "None of the above" option that clears other selections.
 *
 * @param {CycleQuestionProps} props - Component props
 * @param {string} props.question - The text of the question
 * @param {string[]} props.options - Array of string options for this question
 * @param {boolean} [props.multiSelect] - Whether the question allows multiple selections
 * @param {function} [props.onSelect] - Callback that returns the currently selected value(s)
 * @param {string} [props.resetOption] - Resets chosen answers and selects the reset option
 * @param {string | string[] | null} value - Data value passed down by parent
 * @returns {JSX.Element} The rendered question component
 */
export function CycleQuestion({
  question,
  options,
  multiSelect = false,
  onSelect,
  resetOption = "None of the above",
  value,
}: CycleQuestionProps) {
  const handleSelect = (option: string) => {
    if (multiSelect) {
      let newSelection: string[] = Array.isArray(value) ? [...value] : [];

      if (option === resetOption) {
        newSelection = [resetOption];
      } else {
        // If "None" was selected previously, clear it when selecting a real symptom
        if (newSelection.includes(resetOption)) {
          newSelection = [];
        }

        if (newSelection.includes(option)) {
          newSelection = newSelection.filter((o) => o !== option);
        } else {
          newSelection.push(option);
        }
      }
      onSelect?.(newSelection);
    } else {
      // Single select: if they tap the same one, maybe deselect it?
      // Or just set the new one.
      onSelect?.(option);
    }
  };

  const isSelected = (option: string) => {
    if (multiSelect) {
      return Array.isArray(value) && value.includes(option);
    }
    return value === option;
  };

  return (
    <View className="mb-6">
      <Text className="text-[16px] font-inter-semibold text-headingText mb-3">
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
