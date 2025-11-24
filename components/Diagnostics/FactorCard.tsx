import React from "react";
import { View, Text, Image } from "react-native";
import { FactorCardProps } from "./types";

/**
 * Renders a single factor card displaying contributing medical data.
 * Requirement: URF-12.5 (Structured list of contributing data) [cite: 498]
 */
export default function FactorCard({ 
  title, 
  value, 
  description, 
  icon,
  variant = 'default' 
}: FactorCardProps) {
  return (
    // w-[48%] creates the 2-column grid effect with a small gap
    <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-3 flex flex-col items-center justify-center">
      
      {/* Icon Area */}
      <View className="mb-3 flex-row items-center justify-center w-full">
        <Image
          source={icon}
          className="w-8 h-8" 
          resizeMode="contain"
        />
      </View>

      {/* Title (e.g., "Estrogen Pill") */}
      <Text className="text-[12px] text-gray-400 font-inter-medium text-center mb-1">
        {title}
      </Text>

      {/* Value (e.g., "Present" or "Heavy") */}
      <Text className="text-[16px] font-inter-bold text-headingText text-center mb-2">
        {value}
      </Text>

      {/* Description */}
      <Text className="text-[10px] text-gray-400 text-center leading-tight">
        {description}
      </Text>
    </View>
  );
}