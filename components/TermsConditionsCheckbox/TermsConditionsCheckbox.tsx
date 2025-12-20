import { TermsConditionsCheckboxProps } from "@/components/TermsConditionsCheckbox/TermsConditionsCheckbox.types";
import React from "react";
import { Pressable, Text, View } from "react-native";

/**
 * TermsConditionsCheckbox
 *
 * A checkbox component for agreeing to terms and conditions.
 * Includes a link to open the full terms and conditions modal.
 *
 * @param {TermsConditionsCheckboxProps} props - Component props
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {function} props.onToggle - Callback to toggle state
 * @param {function} props.openSheet - Callback to open the terms modal
 * @returns {JSX.Element} The rendered checkbox with label
 */
export function TermsConditionsCheckbox({
  checked,
  onToggle,
  openSheet,
}: TermsConditionsCheckboxProps) {
  return (
    <View className="flex-row items-center">
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        hitSlop={8}
        className={`h-5 w-5 rounded border items-center justify-center
          ${checked ? "bg-slate-800 border-slate-800" : "bg-white border-slate-300"}`}
        testID="terms-conditions-checkbox"
      >
        {checked ? <Text className="text-white text-xs">✓</Text> : null}
      </Pressable>

      <Text className="ml-2 text-slate-950 text-sm">
        I agree with the{" "}
        <Text className="font-bold" onPress={openSheet}>
          terms and conditions.
        </Text>
      </Text>
    </View>
  );
}
