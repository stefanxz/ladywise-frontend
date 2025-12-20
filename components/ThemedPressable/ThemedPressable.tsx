import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
//import "../../assets/styles/main.css";
import { cn } from "../../utils/helpers";
import type { ThemedButtonProperties } from "./ThemedPressable.types";

/**
 * ThemedPressable
 *
 * A standardized button component with branding colors.
 * Supports loading state, disabled state, and custom styling.
 *
 * @param {ThemedButtonProperties} props - Component props
 * @param {string} props.label - Button text
 * @param {function} props.onPress - Press handler
 * @param {boolean} [props.disabled] - Whether button is disabled
 * @param {boolean} [props.loading] - Whether to show loading spinner
 * @param {string} [props.className] - Additional container classes
 * @param {string} [props.textClassName] - Additional text classes
 * @param {string} [props.testID] - Test ID
 * @returns {JSX.Element} The rendered button
 */
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
