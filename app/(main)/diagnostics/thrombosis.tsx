import React, { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// FACTORS
import FactorsSection from "./components/FactorsSection";
import { thrombosisFactorsMock } from "./components/thrombosisFactorsMock";

// MODAL + DATA
import ContributedModal from "./components/ContributedModal";
import { contributedMock } from "./components/contributedMock";

export default function ThrombosisScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* HEADER */}
        <Text className="text-headingText font-inter-semibold text-2xl mb-4">
          Thrombosis Risk
        </Text>

        {/* RISK TREND SECTION (Placeholder for now) */}
        <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6 h-[230px]">
          {/* Add chart component later */}
        </View>

        {/* INSIGHTS SECTION */}
        <Text className="text-lg font-inter-semibold text-headingText mb-2">
          Insights
        </Text>

        <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6">
          <Text className="text-gray-700 text-sm leading-relaxed">
            Your risk of thrombosis has remained low for two months in a row.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>

          <Pressable className="mt-2">
            <Text className="text-brand text-sm font-inter-medium">
              Read more
            </Text>
          </Pressable>
        </View>

        {/* FACTORS SECTION */}
        <FactorsSection factors={thrombosisFactorsMock} />

        {/* WHAT CONTRIBUTED BUTTON */}
        <Pressable
          onPress={() => setIsModalOpen(true)}
          className="mt-4 mb-10"
        >
          <Text className="text-sm text-brand underline">
            What contributed?
          </Text>
        </Pressable>
      </ScrollView>

      {/* CONTRIBUTED MODAL */}
      <ContributedModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={contributedMock}
      />
    </SafeAreaView>
  );
}
