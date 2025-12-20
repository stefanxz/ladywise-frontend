// This function can be used by all text input fields in the project, including Email and Password
// returns a single React Native ThemedTextInput component
import React from "react";
import { TextInput } from "react-native";
//import "../../assets/styles/main.css";
import { ThemedTextInputProps } from "./ThemedTextInput.types";

/**
 * ThemedTextInput
 *
 * A standardized text input component with common styling.
 *
 * @param {ThemedTextInputProps} props - Component props
 * @param {string} props.value - Input value
 * @param {function} props.onChangeText - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.placeholderTextColor] - Color of placeholder
 * @param {boolean} [props.secureTextEntry] - Whether to hide text (password)
 * @param {boolean} [props.disabled] - Whether input is editable
 * @param {string} [props.className] - Additional classes
 * @param {string} [props.testID] - Test ID
 * @returns {JSX.Element} The rendered text input
 */
export function ThemedTextInput({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  secureTextEntry,
  disabled,
  className,
  testID,
}: ThemedTextInputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry}
      editable={!disabled}
      testID={testID}
      className={[
        "h-11 px-3 rounded-xl border border-gray-300 bg-white",
        "text-gray-900",
        "focus:border-gray-900",
        disabled ? "opacity-60" : "",
        className || "",
      ].join(" ")}
    />
  );
}
