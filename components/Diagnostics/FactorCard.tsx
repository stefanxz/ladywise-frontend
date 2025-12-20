import React from "react";
import { View, Text } from "react-native";
import { FactorCardProps } from "./types";

/**
 * FactorCard
 *
 * Displays a single risk factor as a card with an icon, title, value, and
 * description. Designed to be used in a grid layout.
 *
 * @param {FactorCardProps} props - Component props
 * @param {string} props.title - The factor name
 * @param {string} props.value - The current value
 * @param {string} props.description - Additional context or interpretation of the value
 * @param {React.ComponentType<any>} props.icon - Icon component to display
 * @param {string} [props.variant="default"] - Visual variant for different factor types
 * @returns {JSX.Element} The rendered factor card
 */
export default function FactorCard({
  title,
  value,
  description,
  icon: IconComponent,
  variant = "default",
}: FactorCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
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
