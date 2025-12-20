import React from "react";
import { Text, View } from "react-native";

/**
 * DividerText
 * 
 * A visual divider with centered text.
 * Used to separate content sections (e.g. "or sign up with").
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The text to display
 * @returns {JSX.Element} The rendered divider
 */
export function DividerText({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row items-center justify-center">
      <View className="h-px bg-gray-300 w-1/4" />
      <Text className="text-gray-400 text-sm mx-3">{children}</Text>
      <View className="h-px bg-gray-300 w-1/4" />
    </View>
  );
}
