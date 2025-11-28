import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/colors";

const screenWidth = Dimensions.get("window").width - 80;

type RiskLineChartProps = {
  data: number[];
  labels: string[];
  segments: number;
  formatYLabel: (value: string) => string;
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(164, 90, 107, ${opacity})`,
  labelColor: () => "#374151",
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: Colors.brand,
    fill: Colors.brand,
  },
};

export function RiskLineChart({
  data,
  labels,
  segments,
  formatYLabel,
}: RiskLineChartProps) {
  return (
    <LineChart
      data={{
        labels,
        datasets: [{ data }],
      }}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      bezier
      fromZero
      withShadow={false}
      segments={segments}
      formatYLabel={formatYLabel}
    />
  );
}
