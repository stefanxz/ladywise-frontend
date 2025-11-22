import { View, Text } from "react-native";
import FactorCard, { FactorCardProps } from "./FactorCard";

export default function FactorsSection({ factors }: { factors: FactorCardProps[] }) {
  return (
    <View className="mt-6">
      <Text className="text-headingText text-lg font-inter-semibold mb-3">
        Factors
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {factors.map((item) => (
          <FactorCard key={item.id} {...item} />
        ))}
      </View>
    </View>
  );
}
