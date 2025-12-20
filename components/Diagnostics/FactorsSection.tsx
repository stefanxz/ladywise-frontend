import React from "react";
import { View, Text } from "react-native";
import FactorCard from "./FactorCard";
import { mapBackendListToFactors } from "@/utils/mapBackendToFactors";
import { FactorsSectionProps } from "@/components/Diagnostics/types";

/**
 * FactorsSection
 * 
 * Displays a grid of risk factor cards based on backend data. 
 * Shows a message when no factors are present.
 * 
 * @param {FactorsSectionProps} props - Component props
 * @param {any} props.data - Raw backend data containing risk factors
 * @returns {JSX.Element} The rendered factors grid or empty state
 *
 * @example
 * ```tsx
 * <FactorsSection data={diagnosticsData} />
 * ```
 */
export default function FactorsSection({ data }: FactorsSectionProps) {
  const activeFactors = mapBackendListToFactors(data);

  if (activeFactors.length === 0) {
    return (
      <View className="mt-4 p-4 bg-gray-50 rounded-xl">
        <Text className="text-gray-400 text-center font-inter-medium">
          No specific risk factors reported.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      {/* Grid Layout Container */}
      <View className="flex-row flex-wrap justify-between">
        {activeFactors.map((factor, index) => (
          <View key={`${factor.title}-${index}`} className="w-[48%] mb-3">
            <FactorCard {...factor} />
          </View>
        ))}
      </View>
    </View>
  );
}
