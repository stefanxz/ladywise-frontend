import { Switch, Text, View, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { SettingsPageLayout } from "@/components/Settings/SettingsPageLayout";
import { Colors } from "@/constants/colors";
import {
  getNotificationSettings,
  updateNotificationSetting,
} from "@/lib/notifications";
import {
  NotificationFrequency,
  NotificationType,
} from "@/lib/types/notification";
import { useToast } from "@/hooks/useToast";

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
    useState<NotificationFrequency>(NotificationFrequency.DAILY);
  const [phaseNotificationsEnabled, setPhaseNotificationsEnabled] =
    useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settings = await getNotificationSettings();
      if (settings) {
        // Questionnaire settings
        const qFreq = settings[NotificationType.CYCLE_QUESTIONNAIRE_REMINDER];
        if (qFreq) {
          setQuestionnaireFrequency(qFreq);
        }

        // Phase settings
        const pFreq = settings[NotificationType.CYCLE_PHASE_UPDATE];
        if (pFreq) {
          setPhaseNotificationsEnabled(pFreq !== NotificationFrequency.NONE);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notification settings", error);
      showToast("Failed to load settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFrequency = async (freq: NotificationFrequency) => {
    // Optimistic update
    const previousFreq = questionnaireFrequency;
    setQuestionnaireFrequency(freq);
    setIsUpdating(true);

    try {
      await updateNotificationSetting(
        NotificationType.CYCLE_QUESTIONNAIRE_REMINDER,
        freq,
      );
    } catch (error) {
      console.error("Failed to update frequency", error);
      setQuestionnaireFrequency(previousFreq);
      showToast("Failed to update setting", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTogglePhaseNotifications = async (value: boolean) => {
    // Optimistic update
    const previousValue = phaseNotificationsEnabled;
    setPhaseNotificationsEnabled(value);
    setIsUpdating(true);

    const targetFrequency = value
      ? NotificationFrequency.DAILY
      : NotificationFrequency.NONE;

    try {
      await updateNotificationSetting(
        NotificationType.CYCLE_PHASE_UPDATE,
        targetFrequency,
      );
    } catch (error) {
      console.error("Failed to update phase notifications", error);
      setPhaseNotificationsEnabled(previousValue);
      showToast("Failed to update setting", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <SettingsPageLayout
        title="Notifications"
        description="Manage how and when you receive updates from LadyWise."
      >
        <View className="flex-1 justify-center items-center py-10">
          <ActivityIndicator size="large" color={Colors.brand} />
        </View>
      </SettingsPageLayout>
    );
  }

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
            selected={questionnaireFrequency === NotificationFrequency.DAILY}
            onPress={() => handleUpdateFrequency(NotificationFrequency.DAILY)}
            testID="freq-daily"
          />
          <FrequencyOptionPill
            label="Monthly"
            selected={questionnaireFrequency === NotificationFrequency.MONTHLY}
            onPress={() => handleUpdateFrequency(NotificationFrequency.MONTHLY)}
            testID="freq-monthly"
          />
          <FrequencyOptionPill
            label="Off"
            selected={questionnaireFrequency === NotificationFrequency.NONE}
            onPress={() => handleUpdateFrequency(NotificationFrequency.NONE)}
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