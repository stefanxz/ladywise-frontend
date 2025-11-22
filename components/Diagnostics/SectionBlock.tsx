import { View, Text } from "react-native";

export default function SectionBlock({ title, children }) {
  return (
    <View className="mb-6">
      <Text className="text-[16px] font-inter-semibold text-headingText mb-2">
        {title}
      </Text>

      <View className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        {children}
      </View>
    </View>
  );
}
