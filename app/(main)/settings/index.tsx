import { useAuth } from "@/context/AuthContext";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import React from "react";
import { accountSettings, otherSettings } from "@/constants/settings";
import { SettingItem } from "@/components/Settings/SettingItem";

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    // auth layout should redirect automatically
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pt-10 w-full">
        <Text className="text-3xl font-bold text-headingText mb-6">
          Settings
        </Text>

        {/* Account Settings */}
        <View>
          <Text className="text-sm text-inactiveText pb-2 font-bold">
            Account Settings
          </Text>

          <View className="bg-white rounded-2xl shadow-sm px-4 mb-6">
            {accountSettings.map((item, index, array) => (
              <SettingItem
                key={item.name}
                item={item}
                showDivider={index < array.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Other Settings */}
        <View>
          <Text className="text-sm text-inactiveText pb-2 font-bold">
            Other Settings
          </Text>

          <View className="bg-white rounded-2xl shadow-sm px-4 mb-6">
            {otherSettings.map((item, index, array) => (
              <SettingItem
                key={item.name}
                item={item}
                showDivider={index < array.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Log Out */}
        <ThemedPressable
          label="Log Out"
          onPress={handleLogout}
          testID="log-out-button"
          loading={false}
          disabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
