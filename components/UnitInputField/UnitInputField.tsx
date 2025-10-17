// In a new file, e.g., components/UnitInputField/UnitInputField.tsx

import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import React from "react";
import { Text, View } from "react-native";

// Define the component's props
export interface UnitInputFieldProps {
  unit: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string | null;
  testID?: string;
}

export function UnitInputField({
  unit,
  value,
  onChangeText,
  placeholder,
  error,
  testID,
}: UnitInputFieldProps) {
  return (
    // This outer View groups the label and the input field
    <View>
 
      {/* 1. Create a container View. This is the key to the whole technique. */}
      <View className="relative h-11">

        {/* 2. Place your ThemedTextInput inside. Add right-padding to make space! */}
        <ThemedTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="lightGrey"
          className={`h-11 pr-12 ${error ? "border border-red-500" : ""}`} // Padding on the right
          testID={testID}
        />

        {/* 3. Place the unit Text on top using absolute positioning. */}
        <View className="absolute right-0 top-0 bottom-0 justify-center pr-4">
          <Text className="text-regularText font-inter-regular">{unit}</Text>
        </View>

      </View>
      
      {/* Optional: Display an error message */}
      {error ? (
        <Text className="text-red-600 text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
