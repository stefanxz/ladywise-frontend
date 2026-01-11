import { Switch, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { SettingsPageLayout } from "@/components/Settings/SettingsPageLayout";
import { Colors } from "@/constants/colors";

type NotificationFrequency = "DAILY" | "MONTHLY" | "NONE";

/**
 * FrequencyOptionPill
 *
 * A pill-styled button for selecting notification frequency.
 */
function FrequencyOptionPill({
  label,
  selected,
  onPress,
  testID,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      className={`px-4 py-2 rounded-full border ${
        selected ? "bg-brand border-brand" : "bg-gray-100 border-gray-200"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? "text-white" : "text-regularText"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * NotificationsSettings
 *
 * Screen for managing push notification preferences.
 *
 * @returns {JSX.Element} The rendered notifications settings screen
 */
export default function NotificationsSettings() {
  const [questionnaireFrequency, setQuestionnaireFrequency] =
    useState<NotificationFrequency>("DAILY");
  const [phaseNotificationsEnabled, setPhaseNotificationsEnabled] =
    useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateFrequency = async (freq: NotificationFrequency) => {
    setIsUpdating(true);
    setQuestionnaireFrequency(freq);
    try {
      // TODO: Backend integration
      // await updateNotificationSetting("CYCLE_QUESTIONNAIRE_REMINDER", freq);
    } catch (error) {
      console.error("Failed to update frequency", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTogglePhaseNotifications = async (value: boolean) => {
    setIsUpdating(true);
    setPhaseNotificationsEnabled(value);
    try {
      // TODO: Backend integration
      // await updateNotificationSetting("CYCLE_PHASE_UPDATE", value ? "DAILY" : "NONE");
    } catch (error) {
      console.error("Failed to update phase notifications", error);
      setPhaseNotificationsEnabled(!value);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SettingsPageLayout
      title="Notifications"
      description="Manage how and when you receive updates from LadyWise."
    >
      {/* Cycle Questionnaire Reminder Section */}
      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-6">
        <Text className="text-lg font-bold text-headingText mb-2">
          Daily Log Reminders
        </Text>
        <Text className="text-sm text-inactiveText mb-6 leading-5">
          Choose how often you want to be reminded to track your symptoms, flow,
          and daily health data.
        </Text>

        <View className="flex-row flex-wrap gap-2">
          <FrequencyOptionPill
            label="Daily"
            selected={questionnaireFrequency === "DAILY"}
            onPress={() => handleUpdateFrequency("DAILY")}
            testID="freq-daily"
          />
          <FrequencyOptionPill
            label="Monthly"
            selected={questionnaireFrequency === "MONTHLY"}
            onPress={() => handleUpdateFrequency("MONTHLY")}
            testID="freq-monthly"
          />
          <FrequencyOptionPill
            label="Off"
            selected={questionnaireFrequency === "NONE"}
            onPress={() => handleUpdateFrequency("NONE")}
            testID="freq-none"
          />
        </View>
      </View>

      {/* Phase Notifications Section */}
      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-6">
        <Text className="text-lg font-bold text-headingText mb-2">
          Cycle Phase Updates
        </Text>
        <Text className="text-sm text-inactiveText mb-4 leading-5">
          Get notified when your cycle enters a new phase (e.g., Follicular,
          Ovulation, Luteal) to stay in tune with your body.
        </Text>

        <View className="flex-row items-center justify-between py-2">
          <Text className="text-base font-medium text-headingText">
            Enable Notifications
          </Text>

          <Switch
            value={phaseNotificationsEnabled}
            onValueChange={handleTogglePhaseNotifications}
            disabled={isUpdating}
            trackColor={{ false: Colors.gray200, true: Colors.lightBrand }}
            thumbColor={
              phaseNotificationsEnabled ? Colors.brand : Colors.gray100
            }
            ios_backgroundColor={Colors.gray200}
            testID="phase-notifications-toggle"
          />
        </View>
      </View>
    </SettingsPageLayout>
  );
}
