import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
//import "../../assets/styles/main.css";
import type { ThemedButtonProperties } from "./ThemedPressable.types";

const cn = (...xs: Array<string | false | undefined | null>) =>
  xs.filter(Boolean).join(" ");

export function ThemedPressable({
  label,
  onPress,
  disabled,
  loading,
  className,
  textClassName,
}: ThemedButtonProperties) {
  const isBlocked = Boolean(disabled) || Boolean(loading);

  return (
    <Pressable
      disabled={isBlocked}
      onPress={isBlocked ? undefined : onPress}
      className={cn(
        "h-11 px-4 rounded-xl items-center justify-center",
        "bg-black active:opacity-90",
        isBlocked && "opacity-60",
        className
      )}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text className={cn("text-white font-medium", textClassName)}>{label}</Text>
      )}
    </Pressable>
  );
}
