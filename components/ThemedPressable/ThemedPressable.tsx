import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
//import "../../assets/styles/main.css";
import { cn } from "../../utils/helpers";
import type { ThemedButtonProperties } from "./ThemedPressable.types";

export function ThemedPressable({
  label,
  onPress,
  disabled,
  loading,
  className,
  textClassName,
  testID,
}: ThemedButtonProperties) {
  const isBlocked = Boolean(disabled) || Boolean(loading);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isBlocked }}
      disabled={isBlocked}
      onPress={onPress}
      testID={testID ?? "themed-pressable"}
      className={cn(
        "h-11 px-4 rounded-2xl items-center justify-center",
        "bg-[#a45a6b] active:opacity-90",
        isBlocked && "opacity-60",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text
          className={cn("text-background font-inter-semibold", textClassName)}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
