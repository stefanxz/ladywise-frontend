import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Colors, riskColors } from "@/constants/colors";
import { RiskLineChart } from "@/components/charts/RiskLineChart";import FactorCard from "@/components/Diagnostics/FactorCard";
import { FactorCardProps } from "@/components/Diagnostics/types";
import { FACTORS_REGISTRY } from "@/constants/factors-registry";

// Mock data for factors - using a selection from the registry
const mockFactors: (FactorCardProps & { id: string })[] = [
  {
    ...FACTORS_REGISTRY.estrogen_pill,
    value: "Present",
  },
  {
    ...FACTORS_REGISTRY.surgery_injury,
    value: "Present",
  },
  {
    ...FACTORS_REGISTRY.shortness_breath,
    value: "Absent",
  },
  {
    ...FACTORS_REGISTRY.dizziness,
    value: "Present",
  },
  {
    ...FACTORS_REGISTRY.family_history_thrombosis,
    value: "Thrombosis",
  },
  {
    ...FACTORS_REGISTRY.tired,
    value: "Absent",
  },
];

const chartWidth = Dimensions.get("window").width - 80; // Screen padding (20*2) + Card padding (20*2)

const ExtendedDiagnosticsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    conditionId: string;
    title: string;
    graphData: string; // Received as string, needs parsing
    currentRisk: string;
  }>();

  const {
    conditionId,
    title = "Diagnostics",
    graphData: graphDataString,
    currentRisk = "N/A",
  } = params;

  // Safely parse graphData
  const parsedGraphData = graphDataString
    ? JSON.parse(graphDataString)
    : { labels: [], data: [] };

  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);

  // This should be aligned with the logic in the main diagnostics screen
  const riskLabels: Record<number, string> = { 0: "Low", 1: "Medium", 2: "High" };
  const formatRiskTick = (value: string) => {
    const rounded = Math.round(Number(value));
    return riskLabels[rounded] ?? "";
  };

  useEffect(() => {
    // Mock API call
    const fetchInsights = () => {
      console.log(`Fetching insights for condition: ${conditionId}`);
      setLoading(true);
      setTimeout(() => {
        const mockResponse =
          "Based on your recent symptoms and medical history, your risk profile shows a slight increase. Key contributing factors include your current medication and a family history of similar conditions. Maintaining a healthy lifestyle and regular check-ups is advised to manage these risks effectively.";
        setInsights(mockResponse);
        setLoading(false);
      }, 1000);
    };

    if (conditionId) {
      fetchInsights();
    }
  }, [conditionId]);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title }} />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.push("/(main)/diagnostics")}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={Colors.textHeading} />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>{title}</Text>
      </View>

      {/* Card 1: Risk Trend */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.currentRiskLabel}>Current Risk</Text>
            <Text style={styles.currentRiskValue}>{currentRisk}</Text>
          </View>
          <TouchableOpacity style={styles.timeframeButton}>
            <Text style={styles.timeframeButtonText}>Monthly</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.graphContainer}>
          {parsedGraphData.data.length > 0 ? (
            <RiskLineChart
              labels={parsedGraphData.labels}
              data={parsedGraphData.data}
              width={chartWidth}
              height={250} // Increased height for rotated labels
              segments={2}
              formatYLabel={formatRiskTick}
              verticalLabelRotation={30}
            />
          ) : (
            <Text style={styles.noDataText}>No graph data available.</Text>
          )}
        </View>
      </View>

      {/* Card 2: Insights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Insights</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.brand}
            style={styles.loader}
          />
        ) : (
          <View>
            <Text style={styles.insightsText} numberOfLines={4}>
              {insights}
            </Text>
            <TouchableOpacity>
              <Text style={styles.readMore}>Read more</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Card 3: Factors */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Factors</Text>
        <View style={styles.factorsGrid}>
          {mockFactors.map((factor) => (
            <View key={factor.id} style={styles.factorWrapper}>
              <FactorCard {...factor} />
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.disclaimer}>
        This information is for informational purposes only and does not
        constitute medical advice. Please consult a healthcare professional.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textHeading,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  currentRiskLabel: {
    fontSize: 14,
    color: Colors.regularText,
  },
  currentRiskValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.brand,
  },
  timeframeButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  timeframeButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.regularText,
  },
  graphContainer: {
    alignItems: "center",
  },
  noDataText: {
    textAlign: "center",
    color: Colors.inactiveTab,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textHeading,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  insightsText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.regularText,
  },
  readMore: {
    color: riskColors[2], // High risk color
    marginTop: 8,
    fontWeight: "600",
  },
  factorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8, // Counteract padding on children
  },
  factorWrapper: {
    width: "50%",
    padding: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.inactiveTab,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
});

export default ExtendedDiagnosticsScreen;
