import React, { useState } from "react";
import { View, Text } from "react-native";
import { CycleQuestionOptionPill } from "./CycleQuestionOptionPill";
import { CycleQuestionProps } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";

export function CycleQuestion({
  question,
  options,
  multiSelect = false,
  onSelect,
}: CycleQuestionProps) {
  const [selected, setSelected] = useState<string[] | string | null>(
    multiSelect ? [] : null,
  );

  const handleSelect = (option: string) => {
    if (multiSelect) {
      let newSelection: string[];
      if (option === "None of the above") {
        newSelection = ["None of the above"];
      } else {
        newSelection = Array.isArray(selected) ? [...selected] : [];
        if (selected?.includes("none of the above")) newSelection = [];
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
    if (multiSelect) return (selected as string[])?.includes(option);
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
