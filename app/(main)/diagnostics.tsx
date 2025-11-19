import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { isAxiosError } from "axios";

import { useAuth } from "@/context/AuthContext";
import { getRiskHistory } from "@/lib/api";
import type { RiskHistoryPoint } from "@/lib/types/risks";
import { Colors } from "@/constants/colors";

const screenWidth = Dimensions.get("window").width - 32;

const riskLabels: Record<0 | 1 | 2, string> = {
  0: "Low",
  1: "Medium",
  2: "High",
};

const flowLabels: Record<0 | 1 | 2 | 3, string> = {
  0: "None",
  1: "Light",
  2: "Normal",
  3: "Heavy",
};

export default function DiagnosticsScreen() {
  const { token, userId } = useAuth();

  const [history, setHistory] = useState<RiskHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !userId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getRiskHistory(token, userId);
        setHistory(data);
      } catch (err: unknown) {
        console.error("Failed to load risk history", err);

        if (isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 401) {
            setError("Your session has expired. Please log in again.");
          } else if (status === 404) {
            setError("We couldn’t find any diagnostic history yet.");
          } else {
            setError("We couldn’t load your diagnostic data.");
          }
        } else {
          setError("We couldn’t load your diagnostic data.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, userId]);

  const formatRiskTick = (value: string) => {
    const rounded = Math.round(Number(value)) as 0 | 1 | 2;
    return riskLabels[rounded] ?? "";
  };

  const formatFlowTick = (value: string) => {
    const rounded = Math.round(Number(value)) as 0 | 1 | 2 | 3;
    return flowLabels[rounded] ?? "";
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-6">
        <Text className="text-lg text-regularText text-center">{error}</Text>
      </View>
    );
  }

  if (!history.length) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-6">
        <Text className="text-lg text-regularText text-center">
          No diagnostic data available yet.
        </Text>
      </View>
    );
  }

  const labels = history.map((item) =>
    new Date(item.recordedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  );

  const thrombosisData = history.map((item) => item.thrombosisRisk);
  const anemiaData = history.map((item) => item.anemiaRisk);
  const flowData = history.map((item) => item.menstrualFlow);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(164, 90, 107, ${opacity})`, // brand-ish
    labelColor: () => "#374151",
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: Colors.brand,
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-4 pt-10">
        <Text className="text-3xl font-bold text-headingText mb-6">
          Diagnostics
        </Text>

        {/* Thrombosis */}
        <Text className="text-xl font-semibold text-headingText mb-2">
          Thrombosis Risk
        </Text>
        <LineChart
          data={{
            labels,
            datasets: [{ data: thrombosisData }],
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          fromZero
          formatYLabel={formatRiskTick}
        />

        {/* Anemia */}
        <Text className="text-xl font-semibold text-headingText mt-10 mb-2">
          Anemia Risk
        </Text>
        <LineChart
          data={{
            labels,
            datasets: [{ data: anemiaData }],
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          fromZero
          formatYLabel={formatRiskTick}
        />

        {/* Menstrual Flow */}
        <Text className="text-xl font-semibold text-headingText mt-10 mb-2">
          Menstrual Flow
        </Text>
        <LineChart
          data={{
            labels,
            datasets: [{ data: flowData }],
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          fromZero
          formatYLabel={formatFlowTick}
        />

        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
