import React from "react";
import { View, Text, Image } from "react-native";

export default function FactorRow({ id, title, value, source, icon }) {
  return (
    <View className="flex-row items-center py-3">
      <Image
        source={icon}
        style={{ width: 22, height: 22 }}
        resizeMode="contain"
      />

      <View className="ml-3 flex-1">
        <Text className="text-[15px] font-inter-semibold text-headingText">
          {title}
        </Text>

        <Text className="text-[13px] text-primary font-inter-medium">
          {value}
        </Text>

        {source && (
          <Text className="text-[12px] text-gray-500 mt-0.5">
            Source: {source}
          </Text>
        )}
      </View>
    </View>
  );
}