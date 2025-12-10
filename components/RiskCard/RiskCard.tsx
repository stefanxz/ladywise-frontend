import React from "react";
import { Text, View } from "react-native";
import { RiskData } from "@/lib/types/risks";

// We keep 'trend' in the interface for type safety, but we ignore it in render
interface RiskCardProps extends RiskData {
  trend?: string;
}

const riskLevelColorMap: Record<string, string> = {
  Low: "text-green-500",
  Medium: "text-yellow-500",
  High: "text-red-500",
};

const RiskCard = ({ title, level, description }: RiskCardProps) => {
  const dynamicColor = riskLevelColorMap[level] || "text-gray-500";

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm items-center justify-between flex-1">
      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
        {title}
      </Text>
      <View className="flex-row items-center gap-2 mb-2">
        <Text className={`text-2xl font-bold ${dynamicColor}`}>{level}</Text>
      </View>
      <Text className="text-xs text-gray-400 text-center leading-4">
        {description}
      </Text>
    </View>
  );
};

export default RiskCard;
