import { Switch, Text, View } from "react-native";
import React, { useState } from "react";
import { SettingsPageLayout } from "@/components/Settings/SettingsPageLayout";
import { Colors } from "@/constants/colors";

/**
 * NotificationsSettings
 *
 * Screen for managing push notification preferences.
 *
 * @returns {JSX.Element} The rendered notifications settings screen
 */
export default function NotificationsSettings() {
  const [menstrualCycleNotifications, setMenstrualCycleNotifications] =
    useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleMenstrualNotifications = async (value: boolean) => {
    setIsUpdating(true);
    setMenstrualCycleNotifications(value);

    try {
      // TODO: Backend integration
      // await updateNotificationPreferences({
      //   menstrualCycleNotifications: value,
      // });
    } catch (error) {
      setMenstrualCycleNotifications(!value);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SettingsPageLayout
      title="Notifications"
      description="Manage your notification preferences."
    >
      {/* Notification Settings Card */}
      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-6">
        <Text className="text-lg font-bold text-headingText mb-2">
          Menstrual Cycle Predictions
        </Text>
        <Text className="text-sm text-inactiveText mb-4 leading-5">
          Receive notifications about your predicted menstrual cycle dates to
          help you plan ahead and stay prepared.
        </Text>

        <View className="flex-row items-center justify-between py-3">
          <View className="flex-1 pr-4">
            <Text className="text-base font-medium text-headingText">
              Cycle Reminders
            </Text>
            <Text className="text-xs text-inactiveText mt-1">
              Get notified before your predicted cycle starts
            </Text>
          </View>

          <Switch
            value={menstrualCycleNotifications}
            onValueChange={handleToggleMenstrualNotifications}
            disabled={isUpdating}
            trackColor={{ false: Colors.gray200, true: Colors.lightBrand }}
            thumbColor={
              menstrualCycleNotifications ? Colors.brand : Colors.gray100
            }
            ios_backgroundColor={Colors.gray200}
            testID="menstrual-cycle-toggle"
          />
        </View>
      </View>
    </SettingsPageLayout>
  );
}
