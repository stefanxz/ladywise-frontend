import { TermsConditionsCheckboxProps } from "@/components/TermsConditionsCheckbox/TermsConditionsCheckbox.types";
import React from "react";
import { Pressable, Text, View } from "react-native";

export function TermsConditionsCheckbox({
  checked,
  onToggle,
  onShowModal,
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
        <Text
          className="font-bold"
          onPress={() => onShowModal && onShowModal()}
        >
          terms and conditions.
        </Text>
      </Text>
    </View>
  );
}
