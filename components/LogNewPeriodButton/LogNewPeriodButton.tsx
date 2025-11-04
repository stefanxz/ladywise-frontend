import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import type { LogNewPeriodButtonProps } from "./LogNewPeriodButton.types";

/**
 * A simple, reusable “Log period +” button.
 *
 * - The button is centered by its parent container.
 * - The background color is dynamic (passed via `color`).
 * - It supports loading and disabled states.
 * - It is fully accessible and test-friendly.
 *
 * Example usage:
 * ```tsx
 * const color = user.isInCycle ? "#e11d48" : "#3b82f6";
 * 
 * <LogNewPeriodButton
 *   color={color}
 *   onPress={() => router.push("/(main)/log-period")}
 * />
 * ```
 */
export default function LogNewPeriodButton({
  color,
  onPress,
  loading,
  disabled,
  accessibilityLabel = "Log period",
  testID = "log-new-period-button",
}: LogNewPeriodButtonProps) {
  // Block any presses when the button is loading or disabled
  const blocked = !!loading || !!disabled;

  return (
    <Pressable
      // Accessibility configuration for screen readers
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: blocked, busy: !!loading }}

      // Interaction
      onPress={onPress}
      disabled={blocked}
      testID={testID}

      // Layout & visuals
      className={[
        "items-center justify-center px-6 py-3 rounded-full shadow-md",
        "active:opacity-95", // visual feedback on press
        blocked ? "opacity-60" : "", // visually dimmed when blocked
      ].join(" ")}

      // Inline style for dynamic color — avoids NativeWind dynamic-class issues
      style={{
        backgroundColor: color,
        minHeight: 20, // ensures vertical balance
      }}

      // Slightly larger touch area than the visible button
      hitSlop={6}

      // Ripple effect for Android feedback
      android_ripple={{ color: "rgba(255,255,255,0.15)" }}
    >
      {/* Show spinner when loading, otherwise show text */}
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text
          className="text-white font-semibold text-base"
            style={{
              position: "relative",
              top: -2,
              lineHeight: 20, // aligns text vertically in the middle
              textAlignVertical: "center",
            }}
          >
          Log period{" "}
          <Text 
            className="text-white text-lg font-extrabold"
              style={{
                lineHeight: 20, // keeps the + symbol aligned with text
                textAlignVertical: "center",
              }}
            >
            ＋
          </Text>
        </Text>
      )}
    </Pressable>
  );
}