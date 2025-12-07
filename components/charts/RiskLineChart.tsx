import React from "react";
import { Dimensions, View, ViewStyle } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/colors";

const screenWidth = Dimensions.get("window").width;

type RiskLineChartProps = {
  data: number[];
  labels: string[];
  segments: number;
  formatYLabel: (value: string) => string;
  width?: number;
  height?: number;
  isInteractive?: boolean;
  verticalLabelRotation?: number;
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
  width = screenWidth - 80,
  height = 220,
  isInteractive = false,
  verticalLabelRotation,
}: RiskLineChartProps) {
  const containerStyle: ViewStyle = {
    borderRadius: 16,
    padding: isInteractive ? 2 : 0,
  };

  return (
    <View style={containerStyle}>
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        fromZero
        withShadow={false}
        segments={segments}
        formatYLabel={formatYLabel}
        verticalLabelRotation={verticalLabelRotation}
      />
    </View>
  );
}
