import { SettingItemProps } from "./SettingItem.types";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

/**
 * TODO: docs
 * TODO: tests
 * @param item
 * @param showDivider
 * @constructor
 */
export function SettingItem({ item, showDivider }: SettingItemProps) {
  const router = useRouter();

  const handlePress = () => {
    if (item.route) {
      router.push(item.route);
    } else if (item.onPress) {
      item.onPress();
    }
  };

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center justify-between py-4"
        onPress={handlePress}
      >
        <View className="flex-row items-center">
          <Feather name={item.icon} size={20} color="#1F2937" />
          <Text className="ml-3 text-base font-medium text-regularText">
            {item.name}
          </Text>
        </View>

        <Feather name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {showDivider && <View className="h-[1px] bg-gray-100 w-full" />}
    </View>
  );
}
