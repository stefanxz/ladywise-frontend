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
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, riskColors } from "@/constants/colors";
import { RiskLineChart } from "@/components/charts/RiskLineChart";
import FactorCard from "@/components/Diagnostics/FactorCard";
import { FactorCardProps } from "@/components/Diagnostics/types";
import { FACTORS_REGISTRY } from "@/constants/factors-registry";

const chartWidth = Dimensions.get("window").width - 80; // Screen padding (20*2) + Card padding (20*2)

const ExtendedDiagnosticsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    risk_factor: string;
    graphData: string;
    currentRisk: string;
  }>();

  const {
    risk_factor,
    graphData: graphDataString,
    currentRisk = "N/A",
  } = params;

  // Format title from risk_factor (e.g., 'anemia-risk' -> 'Anemia Risk')
  const title = risk_factor
    ? risk_factor
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    : "Diagnostics";

  // Safely parse graphData
  const riskData = React.useMemo(() => {
    if (!graphDataString) return { labels: [], data: [] };
    try {
      return JSON.parse(graphDataString);
    } catch (error) {
      console.warn("Failed to parse graphData:", error);
      return { labels: [], data: [] };
    }
  }, [graphDataString]);

  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);
  const [factors, setFactors] = useState<(FactorCardProps & { id: string })[]>(
    [],
  );

  // This should be aligned with the logic in the main diagnostics screen
  const riskLabels: Record<number, string> = {
    0: "Low",
    1: "Medium",
    2: "High",
  };
  const formatRiskTick = (value: string) => {
    const rounded = Math.round(Number(value));
    return riskLabels[rounded] ?? "";
  };

  useEffect(() => {
    // Mock API call to fetch data based on risk_factor
    const fetchInsights = () => {
      console.log(`Fetching data for risk factor: ${risk_factor}`);
      setLoading(true);
      setTimeout(() => {
        // Mock responses based on risk_factor
        if (risk_factor === "anemia-risk") {
          setFactors([
            { ...FACTORS_REGISTRY.tired, value: "Present" },
            { ...FACTORS_REGISTRY.dizziness, value: "Present" },
            { ...FACTORS_REGISTRY.shortness_breath, value: "Absent" },
          ]);
          setInsights(
            "Your anemia risk profile shows some fluctuations. Key factors include reported tiredness and dizziness. Consider discussing these with your healthcare provider.",
          );
        } else if (risk_factor === "thrombosis-risk") {
          setFactors([
            { ...FACTORS_REGISTRY.estrogen_pill, value: "Present" },
            { ...FACTORS_REGISTRY.surgery_injury, value: "Present" },
            {
              ...FACTORS_REGISTRY.family_history_thrombosis,
              value: "Thrombosis",
            },
          ]);
          setInsights(
            "Your thrombosis risk is currently elevated due to factors like estrogen pill usage and recent surgery. It is crucial to monitor for symptoms and consult your doctor.",
          );
        } else {
          setFactors([]);
          setInsights("No data available for this risk factor.");
        }
        setLoading(false);
      }, 1000);
    };

    if (risk_factor) {
      fetchInsights();
    }
  }, [risk_factor]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.headerContainer}>
          <TouchableOpacity
            testID="back-button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={Colors.textHeading} />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-headingText">{title}</Text>
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
            {riskData.data.length > 0 ? (
              <RiskLineChart
                labels={riskData.labels}
                data={riskData.data}
                width={chartWidth}
                height={250}
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
              testID="loading-indicator"
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
          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.brand}
              style={styles.loader}
            />
          ) : (
            <View style={styles.factorsGrid}>
              {factors.map((factor) => (
                <View key={factor.id} style={styles.factorWrapper}>
                  <FactorCard {...factor} />
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.disclaimer}>
          This information is for informational purposes only and does not
          constitute medical advice. Please consult a healthcare professional.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10, // Added slight top padding for breathing room
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
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
    fontSize: 12, // Matching text-xs (12px)
    color: Colors.regularText,
  },
  currentRiskValue: {
    fontSize: 20, // Reduced to 20 (text-xl equivalent)
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
    fontSize: 18, // Matching text-lg (18px)
    fontWeight: "bold",
    color: Colors.textHeading,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  insightsText: {
    fontSize: 14, // Reduced from 16 to 14 (text-sm equivalent)
    lineHeight: 22,
    color: Colors.regularText,
  },
  readMore: {
    fontSize: 14,
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
