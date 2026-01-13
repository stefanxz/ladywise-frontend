import React from "react";
import { Dimensions, View, ViewStyle } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/colors";

const screenWidth = Dimensions.get("window").width;

/**
 * Properties for the RiskLineChart component.
 */
type RiskLineChartProps = {
  /** Array of numerical data points to plot. */
  data: number[];
  /** Array of X-axis labels (e.g. days or months). */
  labels: string[];
  /** Number of horizontal segments (grid lines). */
  segments: number;
  /** Formatter function for Y-axis labels. */
  formatYLabel: (value: string) => string;
  /** Chart width in pixels. Defaults to screen width - 80. */
  width?: number;
  /** Chart height in pixels. Defaults to 220. */
  height?: number;
  /** Whether to enable touch interactions. */
  isInteractive?: boolean;
  /** Rotation angle for X-axis labels (e.g., 45 or 90). */
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

  // Create dataset with invisible dummy points to force Y-axis range [1, 3]
  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => `rgba(164, 90, 107, ${opacity})`, // Brand color for line
      },
      {
        data: [1, 3], // Force min 1, max 3
        color: () => "transparent",
        strokeWidth: 0,
        withDots: false,
      },
    ],
  };

  return (
    <View style={containerStyle}>
      <LineChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        fromZero={false} // Allow starting from 1
        withShadow={false}
        segments={segments} // Should be 2 segments to show 1, 2, 3 ticks
        formatYLabel={formatYLabel}
        verticalLabelRotation={verticalLabelRotation}
      />
    </View>
  );
}
