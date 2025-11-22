import { Pressable, Text } from "react-native";

export default function WhatContributedButton({ onPress }) {
  return (
    <Pressable onPress={onPress} className="mt-4">
      <Text className="text-brand underline text-sm font-inter-medium">
        What contributed?
      </Text>
    </Pressable>
  );
}
