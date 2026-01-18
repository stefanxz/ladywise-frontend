import { Pressable, Text } from "react-native";
import React from "react";

/**
 * Selectable Frequency Option Component
 *
 * Renders a pill-shaped button used for selecting a single option from a set
 * (e.g., Daily, Weekly, None). It provides visual feedback for selected,
 * unselected, and disabled states.
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
