import InsightsSection from "@/components/InsightsSection/InsightsSection";
import { RiskData } from "@/lib/types/health";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/MainPageHeader/Header"; // Import the new component
import CalendarStrip, {DayData,} from "@/components/CalendarStrip/CalendarStrip";
import PhaseCard from "@/components/PhaseCard/PhaseCard";
import {LinearGradient} from "expo-linear-gradient";


// Import the use theme hook
import { useTheme } from "@/context/ThemeContext";

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

const MOCK_CALENDAR_DAYS: DayData[] = [
  { id: '1', dayNumber: '16', dayLetter: 'F', isCurrentDay: false, isPeriodDay: true },
  { id: '2', dayNumber: '17', dayLetter: 'S', isCurrentDay: false, isPeriodDay: true },
  { id: '3', dayNumber: '18', dayLetter: 'S', isCurrentDay: false, isPeriodDay: true },
  // This one matches the design
  { id: '4', dayNumber: '19', dayLetter: 'M', isCurrentDay: true },
  { id: '5', dayNumber: '20', dayLetter: 'T', isCurrentDay: false },
  { id: '6', dayNumber: '21', dayLetter: 'W', isCurrentDay: false },
  { id: '7', dayNumber: '22', dayLetter: 'T', isCurrentDay: false },
];

const MOCK_CURRENT_PHASE = {
  name: "Ovulation Phase",
  dayOfPhase: "Day 14",
  subtitle: "14 days until next period",
};


const MOCK_USER = {
  name: "Mirela Marcu",
  avatarUrl: ""
}

const fetchRiskData = (): Promise<RiskData[]> => {
  // function promises that it will return, at some point, a RiskData array
  return new Promise(
    (
      resolve // each promise needs to be resolved, by a solver. resolve is that solver function. definition of the function is below; this is a description of the resolver rather than a definition. it just specifies what the function that will be called to resolve is named.
    ) => setTimeout(() => resolve(MOCK_INSIGHTS), 1500) // def of solver: resolve calls the setTimeout function, that calls the resolve function. the resolve function fufills the promise by returning the specified type of data, after 1500 ms go by
  );
};

const home = () => {
  useEffect(() => {}, []);
  const { theme, setPhase } = useTheme();
  const [data, setData] = useState<RiskData[]>(MOCK_INSIGHTS);
  

  const handleHelpPress = () => {
    console.log("Help pressed");
  }

  const handleDayPress = (dayId: string) => {
    console.log("Pressed day: ", dayId);
  }

  const handleLogPeriod = () => {
    console.log("Log Period Pressed");
  };

  const handleCardPress = () => {
    console.log("Phase Card Pressed");
  };

  return (
    
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={{ flex: 1 }} 
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style= {{ flex: 1, backgroundColor: "transparent"}}>

          <View className="flex-1 justify-between">
            <View>
              <Header 
                name={MOCK_USER.name}
                avatarUrl={MOCK_USER.avatarUrl}
                onHelpPress={handleHelpPress}
                theme={theme}
              />

              <Text className="text-base text-gray-500 px-5 mb-5 pt-5">
                August 19th, 2024
              </Text>

              <CalendarStrip
                days={MOCK_CALENDAR_DAYS}
                themeColor={theme.highlight}
                onDayPress={handleDayPress}
              />

              <PhaseCard
                phaseName={MOCK_CURRENT_PHASE.name}
                dayOfPhase={MOCK_CURRENT_PHASE.dayOfPhase}
                subtitle={MOCK_CURRENT_PHASE.subtitle}
                theme={theme}
                onLogPeriodPress={handleLogPeriod}
                onCardPress={handleCardPress}
              />
            </ View>
            <InsightsSection insights={data}></InsightsSection>
          </ View>

      </SafeAreaView>
    </LinearGradient>

  );
};


export default home;
