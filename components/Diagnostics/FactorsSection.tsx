import React from "react";
import { View, Text } from "react-native";
import FactorCard from "./FactorCard";
import { mapBackendToFactors } from "./mapBackendToFactors";

interface FactorsSectionProps {
  /** The raw data object from your API / Context */
  data: Record<string, any>;
}

export default function FactorsSection({ data }: FactorsSectionProps) {
  // Convert raw data to UI cards
  const activeFactors = mapBackendToFactors(data);

  // If no factors are present, you might want to render nothing or a generic message
  if (activeFactors.length === 0) {
    return (
      <View className="mt-4 p-4 bg-gray-50 rounded-xl">
        <Text className="text-gray-400 text-center font-inter-medium">
          No specific risk factors reported for this period.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <Text className="text-[16px] font-inter-bold text-headingText mb-3">
        Factors
      </Text>

      {/* Grid Layout Container */}
      <View className="flex-row flex-wrap justify-between">
        {activeFactors.map((factor, index) => (
          <FactorCard
            key={`${factor.title}-${index}`} // Unique key
            {...factor} // Spreads: title, value, description, icon, variant
          />
        ))}
      </View>
    </View>
  );
}