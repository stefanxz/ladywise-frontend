import InsightsSection from "@/components/InsightsSection/InsightsSection";
import { RiskData } from "@/lib/types/health";
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

const getLocalYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const generateCalendarDays = (periodDates: string[] = []): DayData[] => {
  const today = new Date();
  const days: DayData[] = [];
  const periodSet = new Set(periodDates); // For fast lookup

  // Generate 7 days (e.g., 3 before, today, 3 after)
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayNumber = date.getDate().toString();
    const dayLetter = date.toLocaleDateString("en-US", { weekday: "narrow" });
    const isCurrentDay = i === 0;
    const dateString = getLocalYYYYMMDD(date); // "YYYY-MM-DD"

    days.push({
      id: dateString,
      dayNumber,
      dayLetter,
      isCurrentDay,
      isPeriodDay: periodSet.has(dateString),
    });
  }
  return days;
};

const formatPhaseName = (phase: CyclePhase): string => {
  if (!phase) return "Loading Phase...";
  // "MENSTRUAL" -> "Menstrual"
  const formatted =
    phase.charAt(0).toUpperCase() + phase.slice(1).toLowerCase();
  // "Menstrual" -> "Menstrual Phase"
  return `${formatted} Phase`;
};

const MOCK_USER = {
  name: "Mirela Marcu",
  avatarUrl: "",
};

const fetchRiskData = (): Promise<RiskData[]> => {
  // function promises that it will return, at some point, a RiskData array
  return new Promise(
    (
      resolve, // each promise needs to be resolved, by a solver. resolve is that solver function. definition of the function is below; this is a description of the resolver rather than a definition. it just specifies what the function that will be called to resolve is named.
    ) => setTimeout(() => resolve(MOCK_INSIGHTS), 1500), // def of solver: resolve calls the setTimeout function, that calls the resolve function. the resolve function fufills the promise by returning the specified type of data, after 1500 ms go by
  );
};

const home = () => {
  const { token, isLoading: isAuthLoading } = useAuth();
  const { theme, setPhase } = useTheme();
  const [data, setData] = useState<RiskData[]>(MOCK_INSIGHTS);

  const [cycleStatus, setCycleStatus] = useState<CycleStatusDTO | null>(null);
  const [calendarDays, setCalendarDays] = useState<DayData[]>(
    generateCalendarDays(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <InsightsSection insights={data}></InsightsSection>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default home;
