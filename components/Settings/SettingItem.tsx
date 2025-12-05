import { SettingItemProps } from "./SettingItem.types";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

/**
 * Reusable component that renders a single setting item with an icon, label,
 * and chevron. It supports navigation to routes or custom onPress handlers.
 *
 * @example
 * ```tsx
 * <SettingItem
 *    item={{
 *      name: "Profile",
 *      icon: "user",
 *      route: "/profile" as Href,
 *    }}
 *    showDivider={true}
 * />
 * ```
 *
 * @param item - The setting item configuration object
 * @param showDivider - Whether to show a divider line below the item
 *
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
    <View testID="setting-item-container">
      <TouchableOpacity
        className="flex-row items-center justify-between py-4"
        onPress={handlePress}
        testID="setting-item-button"
        accessibilityLabel={`${item.name} setting`}
        accessibilityRole="button"
      >
        <View className="flex-row items-center">
          <Feather
            name={item.icon}
            size={20}
            color="#1F2937"
            testID="setting-item-icon"
          />
          <Text
            className="ml-3 text-base font-medium text-regularText"
            testID="setting-item-label"
          >
            {item.name}
          </Text>
        </View>

        <Feather
          name="chevron-right"
          size={20}
          color="#9CA3AF"
          testID="setting-item-chevron"
        />
      </TouchableOpacity>

      {showDivider && (
        <View
          className="h-[1px] bg-gray-100 w-full"
          testID="setting-item-divider"
        />
      )}
    </View>
  );
}
