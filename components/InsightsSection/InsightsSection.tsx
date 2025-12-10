import { RiskData } from "@/lib/types/risks";
import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import RiskCard from "../RiskCard/RiskCard";

interface InsightsSectionProps {
  insights: RiskData[];
  isLoading: boolean;
  isCalculating?: boolean; // New prop to show "AI Analysis in progress"
}

const InsightsSection = ({
  insights,
  isLoading,
  isCalculating,
}: InsightsSectionProps) => {
  const renderContent = () => {
    // 1. Initial Load (Fetching from DB)
    if (isLoading) {
      return (
        <View className="h-24 items-center justify-center bg-gray-50 rounded-xl">
          <ActivityIndicator size="small" color="#0000ff" />
          <Text className="mt-2 text-gray-500 text-sm">
            Loading health profile...
          </Text>
        </View>
      );
    }

    // 2. AI Processing (WebSocket trigger active)
    if (isCalculating) {
      return (
        <View className="h-24 items-center justify-center bg-gray-50 rounded-xl">
          <ActivityIndicator size="small" color="#9333ea" />
          <Text className="mt-2 text-gray-500 text-sm">
            Analyzing latest data...
          </Text>
        </View>
      );
    }

    // 3. Empty State (User has no history or API returned empty)
    if (!insights || insights.length === 0) {
      return (
        <View className="p-6 items-center bg-gray-100 rounded-xl border border-dashed border-gray-300">
          <Text className="text-base font-semibold text-gray-700 mb-1">
            No insights yet
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            Log your daily symptoms to generate your risk profile.
          </Text>
        </View>
      );
    }

    // 4. Data Display
    return (
      <View className="flex-row gap-3">
        {insights.map((item: RiskData) => (
          <View key={item.id} className="flex-1">
            <RiskCard {...item} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="p-4 mt-6">
      <Text className="text-xl font-bold mb-4 text-gray-800">
        Your insights
      </Text>
      {renderContent()}
    </View>
  );
};

export default InsightsSection;
