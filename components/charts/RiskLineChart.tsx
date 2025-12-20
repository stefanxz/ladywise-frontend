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

/**
 * RiskLineChart
 * 
 * A line chart visualizing risk trends over time.
 * Uses `react-native-chart-kit` for rendering.
 * 
 * @param {RiskLineChartProps} props - Component props
 * @param {number[]} props.data - Array of numerical data points
 * @param {string[]} props.labels - Array of X-axis labels
 * @param {number} props.segments - Number of horizontal segments
 * @param {function} props.formatYLabel - Formatter for Y-axis labels
 * @param {number} [props.width] - Chart width
 * @param {number} [props.height] - Chart height
 * @param {boolean} [props.isInteractive] - Whether to enable interactivity
 * @param {number} [props.verticalLabelRotation] - Rotation angle for labels
 * @returns {JSX.Element} The rendered line chart
 */
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
