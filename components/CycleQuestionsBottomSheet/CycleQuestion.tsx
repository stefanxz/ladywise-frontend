import React, { useState } from "react";
import { View, Text } from "react-native";
import { CycleQuestionOptionPill } from "./CycleQuestionOptionPill";
import { CycleQuestionProps } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";

export function CycleQuestion({
  question,
  options,
  onSelect,
}: CycleQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect?.(option);
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
            selected={selected === option}
            onPress={() => handleSelect(option)}
          />
        ))}
      </View>
    </View>
  );
}
