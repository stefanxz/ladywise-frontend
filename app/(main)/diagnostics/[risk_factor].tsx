import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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
import { FactorCardProps, ViewMode } from "@/components/Diagnostics/types";
import ShareReportModal from "@/components/ShareReport/ShareReportModal";
import { RISK_LABELS } from "@/constants/diagnostics";
import type { ReportType } from "@/lib/types/reports";
import { RiskNum } from "@/lib/types/diagnostics";
import { formatDateUTC } from "@/utils/helpers";
import { useRiskData } from "@/hooks/useRiskData";
import { parseFactorsFromKeywords } from "@/utils/mapBackendToFactors";
import ViewModeDropdown from "@/components/Diagnostics/ViewModeDropdown";

const chartWidth = Dimensions.get("window").width - 80; // Screen padding (20*2) + Card padding (20*2)

/**
 * ExtendedDiagnosticsScreen
 *
 * Detailed view for a specific risk factor (e.g., Anemia or Thrombosis).
 * Displays a trend graph, current risk level, factors contributing to the risk, and insights.
 * Allows sharing of the risk report.
 *
 * @returns {JSX.Element} The rendered extended diagnostics screen
 */
const ExtendedDiagnosticsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    risk_factor: string;
    graphData: string;
    currentRisk: string;
  }>();

  const { risk_factor } = params;

  // Format title from risk_factor (e.g., 'anemia-risk' -> 'Anemia Risk')
  const title = risk_factor
    ? risk_factor
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Diagnostics";

  const [insights, setInsights] = useState("");
  const [factors, setFactors] = useState<(FactorCardProps & { id: string })[]>(
    [],
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [view, setView] = useState<ViewMode>("daily");

  const { history, loading } = useRiskData(risk_factor, view);

  // This should be aligned with the logic in the main diagnostics screen
  const formatRiskTick = (value: string) => {
    const rounded = Math.round(Number(value)) as RiskNum;
    return RISK_LABELS[rounded] ?? "";
  };

  useEffect(() => {
    if (!loading && history.length > 0) {
      const latest = history[history.length - 1];
      let summary: string | null | undefined = "";
      let keys: string[] | null | undefined = [];

      if (risk_factor === "anemia-risk") {
        summary = latest.anemiaSummary;
        keys = latest.anemiaKeyInputs;
      } else if (risk_factor === "thrombosis-risk") {
        summary = latest.thrombosisSummary;
        keys = latest.thrombosisKeyInputs;
      }

      setInsights(summary ?? "No specific insights available for this date.");
      const parsedFactors = parseFactorsFromKeywords(keys, risk_factor);
      setFactors(parsedFactors);
    } else if (!loading && history.length === 0) {
      setInsights("No data available.");
      setFactors([]);
    }
  }, [history, loading, risk_factor]);

  /* Derived Data for Graph */
  const riskData = React.useMemo(() => {
    if (!history.length) return { labels: [], data: [] };

    // Filter history to exclude "Unknown" (0) risks for the graph
    const filteredHistory = history.filter((h) => {
      if (risk_factor === "anemia-risk") return (h.anemiaRisk ?? 0) > 0;
      if (risk_factor === "thrombosis-risk") return (h.thrombosisRisk ?? 0) > 0;
      return false;
    });

    const labels = filteredHistory.map((item) => formatDateUTC(item.date));

    let data: number[] = [];
    if (risk_factor === "anemia-risk") {
      data = filteredHistory.map((h) => h.anemiaRisk ?? 0);
    } else if (risk_factor === "thrombosis-risk") {
      data = filteredHistory.map((h) => h.thrombosisRisk ?? 0);
    }

    return { labels, data };
  }, [history, risk_factor]);

  const currentRiskLevel = React.useMemo(() => {
    if (!riskData.data.length) return 0 as RiskNum;
    return riskData.data[riskData.data.length - 1] as RiskNum;
  }, [riskData.data]);

  const currentRisk = React.useMemo(() => {
    if (!riskData.data.length) return "N/A"; // Or "Unknown" if user prefers
    return RISK_LABELS[currentRiskLevel] ?? "N/A";
  }, [currentRiskLevel, riskData.data.length]);

  // Determine report type based on risk_factor
  const reportType: ReportType = React.useMemo(() => {
    if (risk_factor === "thrombosis-risk") return "THROMBOSIS_ONLY";
    if (risk_factor === "anemia-risk") return "ANEMIA_ONLY";
    return "FULL_REPORT";
  }, [risk_factor]);

  // Capture chart as Base64 when opening share modal
  const handleSharePress = async () => {
    setShowShareModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 40 }}>
        <Stack.Screen options={{ headerShown: false }} />

        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            testID="back-button"
            onPress={() => router.back()}
            className="mr-4"
          >
            <Feather name="arrow-left" size={24} color={Colors.textHeading} />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-headingText">{title}</Text>
        </View>

        {/* Card 1: Risk Trend */}
        <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-xs text-regularText">Current Risk</Text>
              <Text
                className="text-xl font-bold"
                style={{
                  color: riskColors[currentRiskLevel] ?? Colors.textHeading,
                }}
              >
                {currentRisk}
              </Text>
            </View>
            <ViewModeDropdown value={view} onChange={setView} />
          </View>
          <View className="items-center">
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
              <Text className="text-center text-inactiveText mt-5">
                No data available for this period.
              </Text>
            )}
          </View>
          {currentRisk === "High" && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
              <View className="flex-row items-center">
                <Feather name="alert-circle" size={18} color="#DC2626" />
                <Text className="text-sm font-semibold text-red-700 ml-2">
                  High Risk Detected
                </Text>
              </View>
              <Text className="text-sm text-red-600 mt-1">
                Your current risk level is high. We recommend contacting your
                healthcare provider or clinician to discuss your health status.
              </Text>
            </View>
          )}
        </View>

        {/* Card 2: Insights */}
        <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold text-headingText mb-4">
            Insights
          </Text>
          {loading ? (
            <ActivityIndicator
              testID="loading-indicator"
              size="large"
              color={Colors.brand}
              className="my-5"
            />
          ) : (
            <View>
              <Text
                className="text-sm leading-snug text-regularText"
                numberOfLines={isExpanded ? undefined : 4}
                onTextLayout={(e) => {
                  const lineCount = e.nativeEvent.lines.length;

                  if (!isExpanded) {
                    // Only set it to true if lines > 4
                    const shouldShow = lineCount >= 4;
                    setShowReadMore(shouldShow);
                  }
                }}
              >
                {insights}
              </Text>
              {showReadMore && (
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                  <Text className="text-sm text-red-600 mt-2 font-semibold">
                    {isExpanded ? "Show less" : "Read more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Section: Factors */}
        <Text className="text-xl font-bold text-headingText mb-2 mt-4">
          Factors
        </Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.brand}
            className="my-5"
          />
        ) : (
          <View className="flex-row flex-wrap -mx-2">
            {factors.map((factor) => (
              <View key={factor.id} className="w-1/2 p-2 mb-3">
                <FactorCard {...factor} />
              </View>
            ))}
          </View>
        )}

        <Text className="text-xs text-inactiveText text-center px-5 mb-6 mt-6">
          This information is for informational purposes only and does not
          constitute medical advice. Please consult a healthcare professional.
        </Text>

        {/* Share Insights Button */}
        <TouchableOpacity
          testID="share-insights-button"
          onPress={handleSharePress}
          className="bg-gray-200 rounded-xl py-3 px-6 flex-row items-center justify-center self-center mb-2"
        >
          <Text className="text-headingText font-medium text-sm mr-2">
            Share insights
          </Text>
          <Feather name="arrow-right" size={16} color="#1F2937" />
        </TouchableOpacity>

        {/* Terms notice */}
        <Text className="text-xs text-inactiveText text-center px-5 mb-10">
          By sharing your data, you agree with our Terms and Conditions.
          LifeSense Group is not responsible for your data from here on.
        </Text>

        {/* Share Report Modal */}
        <ShareReportModal
          visible={showShareModal}
          onClose={() => setShowShareModal(false)}
          reportType={reportType}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExtendedDiagnosticsScreen;
