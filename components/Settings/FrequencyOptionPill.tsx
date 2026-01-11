import { Pressable, Text } from "react-native";
import React from "react";

/**
 * FrequencyOptionPill
 *
 * A pill-styled button for selecting notification frequency.
 */
export default function FrequencyOptionPill({
  label,
  selected,
  onPress,
  testID,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      className={`px-4 py-2 rounded-full border ${
        selected ? "bg-brand border-brand" : "bg-gray-100 border-gray-200"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? "text-white" : "text-regularText"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
