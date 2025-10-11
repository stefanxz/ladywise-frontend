import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import React from "react";
import { Text, View } from "react-native";

export type EmailFieldProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string | null;
  inputProps?: Partial<React.ComponentProps<typeof ThemedTextInput>>;
  testID?: string;
};

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
      {error ? <Text className="text-red-600 text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
