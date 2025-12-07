import React from "react";
import { View, Text } from "react-native";
import { FactorCardProps } from "./types";

/**
 * Displays a single risk factor as a card with an icon, title, value, and
 * description. Designed to be used in a grid layout.
 *
 * @param title - The factor name
 * @param value - The current value
 * @param description - Additional context or interpretation of the value
 * @param IconComponent - Icon component to display
 * @param variant - Visual variant for different factor types
 * @constructor
 */
export default function FactorCard({
  title,
  value,
  description,
  icon: IconComponent,
  variant = "default",
}: FactorCardProps) {
  return (
    <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-3 flex flex-col items-center justify-center">
      <View className="mb-3 flex-row items-center justify-center w-full">
        <IconComponent size={32} color="#80e4c1" />
      </View>

      <Text className="text-[12px] text-gray-400 font-inter-medium text-center mb-1">
        {title}
      </Text>

      <Text className="text-[16px] font-inter-bold text-headingText text-center mb-2">
        {value}
      </Text>

      <Text className="text-[10px] text-gray-400 text-center leading-tight">
        {description}
      </Text>
    </View>
  );
}
