import React from "react";
import { View, Text, Image } from "react-native";

export default function FactorCard({ title, value, description, icon }) {
  return (
    <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4">
      <Image
        source={icon}
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
      />

      <Text className="mt-2 text-[15px] font-inter-semibold text-headingText">
        {title}
      </Text>

      <Text className="text-[13px] text-primary font-inter-medium mt-0.5">
        {value}
      </Text>

      <Text className="text-[12px] text-gray-500 mt-1">{description}</Text>
    </View>
  );
}