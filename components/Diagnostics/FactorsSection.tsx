import React from "react";
import { View, Text } from "react-native";
import FactorCard from "./FactorCard";
import { mapBackendListToFactors } from "@/utils/mapBackendToFactors";

interface FactorsSectionProps {
  data: string[];
}

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
          <FactorCard key={`${factor.title}-${index}`} {...factor}/>
        ))}
      </View>
    </View>
  );
}
