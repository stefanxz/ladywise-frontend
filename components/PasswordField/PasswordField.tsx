import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { PasswordFieldProps } from "@/components/PasswordField/PasswordField.types";

/**
 * PasswordField
 *
 * A specialized text input for passwords with a visibility toggle.
 *
 * @param {PasswordFieldProps} props - Component props
 * @param {string} props.label - Field label
 * @param {string} props.value - Current password value
 * @param {function} props.onChangeText - Callback for text change
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.testID] - Test ID
 * @returns {JSX.Element} The rendered password input
 */
export function PasswordField({
  label,
  value,
  onChangeText,
  placeholder = "Your password",
  error,
  testID,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <View>
      <Text className="text-gray-700 mb-1 font-extrabold">{label}</Text>
      <View className="relative h-11">
        <ThemedTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="gray"
          className={`h-11 pr-10 ${error ? "border border-red-500" : ""}`}
          secureTextEntry={!show}
          testID={testID}
        />
        <View className="absolute right-0 top-0 bottom-0 justify-center pr-3">
          <Pressable
            onPress={() => setShow((v) => !v)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`${show ? "Hide" : "Show"} ${label.toLowerCase()}`}
            testID={`${testID}-toggle`}
          >
            <Feather
              name={show ? "eye-off" : "eye"}
              size={20}
              color="#6B7280"
            />
          </Pressable>
        </View>
      </View>
      {error ? (
        <Text className="text-red-600 text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
