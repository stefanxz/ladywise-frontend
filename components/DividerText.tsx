import React from "react";
import { Text, View } from "react-native";

export function DividerText({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row items-center justify-center">
      <View className="h-px bg-gray-300 w-1/4" />
      <Text className="text-gray-400 text-sm mx-3">{children}</Text>
      <View className="h-px bg-gray-300 w-1/4" />
    </View>
  );
}
