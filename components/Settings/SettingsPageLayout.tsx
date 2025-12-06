import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SettingsPageLayoutProps } from "@/components/Settings/SettingsPageLayout.types";
import { Colors } from "@/constants/colors";

/**
 * Reusable layout component for settings page that provides a consistent design
 * with a back button, title card, and content area.
 *
 * @example
 * ```tsx
 *<SettingsPageLayout
 *    title="Profile"
 *    description="Manage your personal information and preferences."
 * >
 *    <View className="bg-white rounded-2xl shadow-sm px-4">
 *      <Text>Settings go here</Text>
 *    </View>
 * </SettingsPageLayout>
 * ```
 *
 * @param title - The title displayed in the header card
 * @param description - A brief description shown below the title
 * @param children - The settings content to display below the title header
 */
export function SettingsPageLayout({
  title,
  description,
  children,
}: SettingsPageLayoutProps) {
  const router = useRouter();

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "bottom"]}
      testID="settings-page-layout"
    >
      {/* Back to settings page navigation - outside ScrollView */}
      <View className="px-4 pt-10 pb-6">
        <View
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
          testID="back-button-container"
        >
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="flex-row items-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID="back-button"
            accessibilityLabel="Back to Settings"
            accessibilityRole="button"
            accessibilityHint="Navigate back to the main settings page"
          >
            <Feather
              name="chevron-left"
              size={28}
              color={Colors.textHeading}
              testID="back-button-icon"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 w-full"
        testID="settings-page-scroll-view"
      >
        {/* Title and Description Card */}
        <View
          className="bg-white rounded-2xl shadow-sm px-4 mb-6"
          testID="title-card"
        >
          <View className="py-6">
            <Text
              className="text-2xl font-bold text-headingText mb-2"
              testID="settings-page-title"
              accessibilityRole="header"
            >
              {title}
            </Text>
            <Text
              className="text-sm text-inactiveText leading-5"
              testID="settings-page-description"
            >
              {description}
            </Text>
          </View>
        </View>

        {/* Settings Content */}
        <View className="pb-6" testID="settings-page-content">
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
