import { RiskData } from "@/lib/types/risks";
import React from "react";
import { Text, View, ActivityIndicator } from "react-native"; // Import ActivityIndicator
import RiskCard from "../RiskCard/RiskCard";

interface InsightsSectionProps {
  insights: RiskData[];
  isLoading: boolean;
}

// Destructure BOTH props: { insights, isLoading }
const InsightsSection = ({ insights, isLoading }: InsightsSectionProps) => {
  const renderContent = () => {
    // 1. Handle the loading state
    if (isLoading) {
      return (
        <View className="flex-row gap-4 h-24 items-center justify-center">
          <ActivityIndicator size="small" testID="loading-indicator" />
        </View>
      );
    }

    // 2. Handle the empty state (after loading)
    if (insights.length === 0) {
      return (
        <View className="flex-row gap-4 h-24 items-center">
          <Text className="text-gray-500">No insights available.</Text>
        </View>
      );
    }

    // 3. Handle the data state
    return (
      <View className="flex-row gap-4">
        {insights.slice(0, 2).map((item: RiskData) => (
          <View key={item.id} className="flex-1">
            <RiskCard {...item} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="p-4 mt-9">
      <Text className="text-xl font-bold mb-4">Your insights</Text>
      {renderContent()}
    </View>
  );
};

export default InsightsSection;
