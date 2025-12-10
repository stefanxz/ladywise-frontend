import React from "react";
import { Text, View } from "react-native";
import { RiskData } from "@/lib/types/risks";

interface RiskCardProps extends RiskData {
  trend?: string; // "increasing" | "declining" | "stable"
}

const riskLevelColorMap: Record<string, string> = {
  Low: "text-green-500",
  Medium: "text-yellow-500",
  High: "text-red-500",
};

const getTrendIcon = (trend?: string) => {
  switch (trend?.toLowerCase()) {
    case "increasing":
      return "↗️";
    case "declining":
      return "↘️";
    case "worsening":
      return "↗️";
    case "improving":
      return "↘️";
    case "stable":
      return "→";
    default:
      return "";
  }
};

const RiskCard = ({ title, level, description, trend }: RiskCardProps) => {
  const dynamicColor = riskLevelColorMap[level] || "text-gray-500";
  const trendIcon = getTrendIcon(trend);

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm items-center justify-between flex-1">
      {/* Title */}
      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
        {title}
      </Text>

      {/* Level & Trend */}
      <View className="flex-row items-center gap-2 mb-2">
        <Text className={`text-2xl font-bold ${dynamicColor}`}>{level}</Text>
        {trend && <Text className="text-lg">{trendIcon}</Text>}
      </View>

      {/* Description */}
      <Text className="text-xs text-gray-400 text-center leading-4">
        {description}
      </Text>
    </View>
  );
};

export default RiskCard;
