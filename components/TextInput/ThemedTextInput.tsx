// This function can be used by all text input fields in the project, including Email and Password
// returns a single React Native TextInput component
import React from "react";
import { TextInput } from "react-native";
//import "../../assets/styles/main.css";
import { ThemedTextInputProps } from "./ThemedTextInput.types";

export function ThemedTextInput({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  secureTextEntry,
  disabled,
  className,
}: ThemedTextInputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry}
      editable={!disabled}
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
