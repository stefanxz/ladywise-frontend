import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { LogNewPeriodButtonProps } from "./LogNewPeriodButton.types";
import { Feather } from "@expo/vector-icons";


/**
 * LogNewPeriodButton
 *
 * A simple, reusable “Log period +” button.
 * The button is centered by its parent container and supports custom coloring.
 * It handles loading and disabled states and provides accessibility support.
 *
 * @param {LogNewPeriodButtonProps} props - Component props
 * @param {string} props.color - Background color of the button
 * @param {function} props.onPress - Callback when pressed
 * @param {boolean} [props.loading] - Whether to show a loading spinner
 * @param {boolean} [props.disabled] - Whether the button is disabled
 * @param {string} [props.accessibilityLabel] - Custom accessibility label
 * @param {string} [props.testID] - Test ID for automated testing
 * @returns {JSX.Element} The rendered button
 */
export default function LogNewPeriodButton({
  color,
  onPress,
  loading,
  disabled,
  accessibilityLabel = "Log period",
  testID = "log-new-period-button",
  style,
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
        "flex-row items-center justify-center px-6 py-3 rounded-full shadow-md",
        "active:opacity-95", // visual feedback on press
        blocked ? "opacity-60" : "", // visually dimmed when blocked
      ].join(" ")}
      // Inline style for dynamic color — avoids NativeWind dynamic-class issues
      style={[
        {
          backgroundColor: color,
          minHeight: 20, // ensures vertical balance
        },
        style,
      ]}
      // Slightly larger touch area than the visible button
      hitSlop={6}
      // Ripple effect for Android feedback
      android_ripple={{ color: "rgba(255,255,255,0.15)" }}
    >
      {/* Show spinner when loading, otherwise show text */}
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <View className="flex-row items-center">
          <Text
            className="text-black font-semibold text-base"
            style={{
              lineHeight: 20, // aligns text vertically in the middle
              includeFontPadding: false, // android fix for vertical alignment            }}
            }}
          >
            Log period
          </Text>
          <Feather
            name="plus"
            size={20}
            color="black"
            style={{ marginLeft: 4, fontWeight: "bold" }}
          />
        </View>
      )}
    </Pressable>
  );
}
