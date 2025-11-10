import InsightsSection from "@/components/InsightsSection/InsightsSection";
import { RiskData } from "@/lib/types/risks";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/MainPageHeader/Header";
import CalendarStrip, {
  DayData,
} from "@/components/CalendarStrip/CalendarStrip";
import PhaseCard from "@/components/PhaseCard/PhaseCard";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import { getCycleStatus } from "@/lib/api";
import { CycleStatusDTO, CyclePhase } from "@/lib/types/cycle";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { generateCalendarDays, formatPhaseName } from "@/utils/mainPageHelpers";
import { getRiskData } from "@/lib/api";
import { ApiRiskResponse } from "@/lib/types/risks";

type RiskLevel = "Low" | "Medium" | "High";
const mapApiToInsights = (apiData: ApiRiskResponse): RiskData[] => {
  // --- IMPORTANT ---

  const levelMap: { [key: number]: RiskLevel } = {
    0: "Low",
    1: "Medium",
    2: "High",
  };

  const titleMap: { [key: string]: string } = {
    thrombosisRisk: "Thrombosis Risk",
    anemiaRisk: "Anemia Risk",
  };

  const descriptionMap: { [key: string]: string } = {
    thrombosisRisk: "Some factors may raise clotting risk.",
    anemiaRisk: "Iron levels appear sufficient.",
  };

  // Convert object { key1: val1, key2: val2 } into array [ { ...risk1 }, { ...risk2 } ]
  return Object.keys(apiData).map((key) => {
    const typedKey = key as keyof ApiRiskResponse;
    const apiLevel = apiData[typedKey];

    return {
      id: typedKey,
      title: titleMap[typedKey] || "Unknown Risk",
      level: levelMap[apiLevel] || "Low",
      description: descriptionMap[typedKey] || "No description.",
    };
  });
};

const MOCK_INSIGHTS: RiskData[] = [
  {
    id: "1",
    title: "Thrombosis Risk",
    level: "Medium",
    description: "Some factors may raise clotting risk.",
  },
  {
    id: "2",
    title: "Anemia Risk",
    level: "Low",
    description: "Iron levels appear sufficient.",
  },
];

const MOCK_USER = {
  name: "Mirela Marcu",
  avatarUrl: "",
};

async function fetchRiskData(
  token: string,
  userId: string,
): Promise<RiskData[]> {
  try {
    // Fetch the raw API data
    const apiResponse = await getRiskData(token, userId);

    // Map the raw data to the shape your component needs
    const mappedData = mapApiToInsights(apiResponse);

    return mappedData;
  } catch (e) {
    console.error("Error fetching Risk Data: ", e);
    return []; // Return empty array on failure
  }
}
const Home = () => {
  const { token, userId, isLoading: isAuthLoading } = useAuth();
  const { theme, setPhase } = useTheme();
  const [data, setData] = useState<RiskData[]>(MOCK_INSIGHTS);
  const [isLoading, setIsLoading] = useState<boolean>(true); // For risk data
  const [cycleStatus, setCycleStatus] = useState<CycleStatusDTO | null>(null);
  const [calendarDays, setCalendarDays] = useState<DayData[]>(
    generateCalendarDays(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect for fetching risk data
  useEffect(() => {
    const loadData = async () => {
      // We already know token and userId are valid strings here
      try {
        // Pass the credentials from the context
        const riskData = await fetchRiskData(token!, userId!);
        setData(riskData);
        console.log(riskData);
      } catch (error) {
        console.error("[REMOVE IN PROD] error inside useEffect hook!");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // This is the critical guard.
    // Do not attempt to fetch data if auth is loading or if the token is missing.
    if (isAuthLoading || !token || !userId) {
      setIsLoading(false); // Stop the loader, there's nothing to fetch
      return; // Do nothing
    }

    console.log("ATTEMPTING FETCH WITH:", { token, userId });

    loadData();
  }, [token, userId, isAuthLoading]);

  // Effect for fetching cycle data
  useFocusEffect(
    useCallback(() => {
      if (isAuthLoading || !token) {
        console.log("Waiting for auth...");
        return;
      }
      const fetchCycleData = async () => {
        try {
          setLoading(true);
          setError(null);

          const status = await getCycleStatus();

          setCycleStatus(status);

          // Update theme based on backend data
          setPhase(status.currentPhase.toLowerCase() as any);

          // Generate calendar days with period data
          setCalendarDays(generateCalendarDays(status.periodDates));
        } catch (err: any) {
          console.error("Failed to fetch cycle status:", err);

          if (err.response?.status === 404) {
            console.log("No cycle data found (user needs setup).");

            setPhase("neutral" as any);

            setCalendarDays(generateCalendarDays([]));
          } else {
            console.error("Error fetching cycle", err);
            setError(err.message || "Failed to load data.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchCycleData();
    }, [setPhase, token, isAuthLoading]),
  );

  const handleLogPeriod = () => console.log("Log period pressed");
  const handleHelpPress = () => console.log("Help pressed");
  const handleDayPress = (dayId: string) => console.log("Pressed day: ", dayId);
  const handleCardPress = () => console.log("Phase Card Pressed");

  if (loading) {
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator
          size="large"
          color={theme.highlight}
          testID="loading-indicator"
        />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={["#FFFFFF", "#F0F0F0"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text className="text-lg text-red-500 font-bold mb-4">
          Error: {error || "Could not load cycle data."}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <View className="flex-1 justify-between">
          <View className="pt-10">
            <Header
              name={MOCK_USER.name}
              avatarUrl={MOCK_USER.avatarUrl}
              onHelpPress={handleHelpPress}
              theme={theme}
            />

            <Text className="text-base text-gray-500 px-5 mb-5 pt-5">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>

            <CalendarStrip
              days={calendarDays}
              themeColor={theme.highlight}
              onDayPress={handleDayPress}
            />

            <PhaseCard
              phaseName={
                cycleStatus
                  ? formatPhaseName(cycleStatus.currentPhase)
                  : "Hello!"
              }
              dayOfPhase={
                cycleStatus
                  ? `Day ${cycleStatus.currentCycleDay}`
                  : "Ready to start?"
              }
              subtitle={
                cycleStatus
                  ? `${cycleStatus.daysUntilNextEvent} days until ${cycleStatus.nextEvent.toLowerCase()}`
                  : "Log your first period to begin tracking."
              }
              theme={theme}
              onLogPeriodPress={handleLogPeriod}
              onCardPress={() => {}}
            />
          </View>
          <InsightsSection
            isLoading={isLoading}
            insights={data}
          ></InsightsSection>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;
