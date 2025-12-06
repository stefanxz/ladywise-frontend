import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SettingsPageLayoutProps } from "@/components/Settings/SettingsPageLayout.types";
import { Colors } from "@/constants/colors";

/**
 * Reusable Layout component for settings pages. This layout provides a
 * consistent structure with a back button, title, description, and
 * content area.
 *
 * @example
 * ```tsx
 * <SettingsPageLayout
 *    title="Notifications"
 *    description="Manage your notification preferences and alert settings"
 * >
 *    <NotificationSettings />
 * </SettingsPageLayout>
 * ```
 *
 * @param title - The heading text displayed at the top of the settings page
 * @param description - Descriptive text shown below the titl
 * @param children - The main content of the settings page
 *
 */
export function SettingsPageLayout({
  title,
  description,
  children,
}: SettingsPageLayoutProps) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background" testID="settings-page-layout">
      <View
        className="absolute top-10 left-0 w-full z-10 px-4 pt-10 pb-6"
        pointerEvents="box-none"
      >
        <View
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center shadow-sm"
          testID="back-button-container"
        >
          <TouchableOpacity
            onPress={() => router.back()}
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
        <View className="pt-10 pb-6" aria-hidden={true}>
          <View className="h-20" />
        </View>

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
    </View>
  );
}
