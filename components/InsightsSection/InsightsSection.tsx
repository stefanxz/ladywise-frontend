import { RiskData } from "@/lib/types/health";
import React from "react";
import { Text, View } from "react-native";
import RiskCard from "../RiskCard/RiskCard";

interface InsightsSectionProps {
  insights: RiskData[];
}
const InsightsSection = ({ insights }: InsightsSectionProps) => {
  return (
    <View className="p-4 mt-9">
      <Text className="text-xl font-bold mb-4">Your insights</Text>
      <View className="flex-row gap-4">
        {insights.slice(0, 2).map((item: RiskData) => (
          <View key={item.id} className="flex-1">
            <RiskCard {...item} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default InsightsSection;
