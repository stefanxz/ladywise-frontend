import { Pressable, Text } from "react-native";
import React from "react";

/**
 * A pill-styled button for selecting notification frequency.
 */
export default function FrequencyOptionPill({
  label,
  selected,
  onPress,
  disabled,
  testID,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      className={`px-4 py-2 rounded-full border ${
        selected ? "bg-brand border-brand" : "bg-gray-100 border-gray-200"
      } ${disabled ? "opacity-50" : ""}`}
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
