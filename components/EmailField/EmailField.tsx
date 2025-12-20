import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import React from "react";
import { Text, View } from "react-native";
import { EmailFieldProps } from "@/components/EmailField/EmailField.types";

/**
 * EmailField
 * 
 * A specialized text input field for email addresses.
 * Wraps `ThemedTextInput` with a label and error display.
 * 
 * @param {EmailFieldProps} props - Component props
 * @param {string} props.label - Field label
 * @param {string} props.value - Current email value
 * @param {function} props.onChangeText - Callback for text change
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.error] - Error message to display
 * @param {object} [props.inputProps] - Additional props for the input
 * @param {string} [props.testID] - Test ID for automated testing
 * @returns {JSX.Element} The rendered email input field
 */
export function EmailField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  inputProps,
  testID,
}: EmailFieldProps) {
  return (
    <View>
      <Text className="text-gray-700 mb-1 font-extrabold">{label}</Text>
      <ThemedTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="gray"
        secureTextEntry={false}
        {...inputProps}
        className={[
          `h-11 ${error ? "border border-red-500" : ""}`,
          inputProps?.className || "",
        ].join(" ")}
        testID={testID}
      />
      {error ? (
        <Text className="text-red-600 text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
