import { Switch, Text, View, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
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
import FrequencyOptionPill from "@/components/Settings/FrequencyOptionPill";
import { useToast } from "@/hooks/useToast";

/**
 * Notification settings screen.
 */
export default function NotificationsSettings() {
  const { showToast } = useToast();

  const [questionnaireFrequency, setQuestionnaireFrequency] =
    useState<NotificationFrequency>("DAILY");
  const [phaseFrequency, setPhaseFrequency] =
    useState<NotificationFrequency>("DAILY");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const preferences = await getNotificationSettings();

        if (preferences.CYCLE_QUESTIONNAIRE_REMINDER) {
          setQuestionnaireFrequency(preferences.CYCLE_QUESTIONNAIRE_REMINDER);
        }
        if (preferences.CYCLE_PHASE_UPDATE) {
          setPhaseFrequency(preferences.CYCLE_PHASE_UPDATE);
        }
      } catch (err) {
        showToast("Failed to load notification settings", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdateSetting = useCallback(
    async (type: NotificationType, frequency: NotificationFrequency) => {
      // Optimistically update UI
      const previousQuestionnaireFreq = questionnaireFrequency;
      const previousPhaseFreq = phaseFrequency;

      if (type === "CYCLE_QUESTIONNAIRE_REMINDER") {
        setQuestionnaireFrequency(frequency);
      } else {
        setPhaseFrequency(frequency);
      }

      setIsUpdating(true);
      try {
        await updateNotificationSetting(type, frequency);
      } catch (err) {
        // Revert on error
        if (type === "CYCLE_QUESTIONNAIRE_REMINDER") {
          setQuestionnaireFrequency(previousQuestionnaireFreq);
        } else {
          setPhaseFrequency(previousPhaseFreq);
        }
        showToast("Failed to update setting. Please try again.", "error");
      } finally {
        setIsUpdating(false);
      }
    },
    [questionnaireFrequency, phaseFrequency, showToast],
  );

  const handleTogglePhaseNotifications = useCallback(
    (enabled: boolean) => {
      // Toggle between DAILY and NONE
      const newFrequency: NotificationFrequency = enabled ? "DAILY" : "NONE";
      handleUpdateSetting("CYCLE_PHASE_UPDATE", newFrequency);
    },
    [handleUpdateSetting],
  );

  if (isLoading) {
    return (
      <SettingsPageLayout
        title="Notifications"
        description="Manage how and when you receive updates from LadyWise."
      >
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator size="large" color={Colors.brand} />
          <Text className="text-inactiveText mt-4">Loading settings...</Text>
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
            selected={questionnaireFrequency === "DAILY"}
            onPress={() =>
              handleUpdateSetting("CYCLE_QUESTIONNAIRE_REMINDER", "DAILY")
            }
            disabled={isUpdating}
            testID="freq-daily"
          />
          <FrequencyOptionPill
            label="Monthly"
            selected={questionnaireFrequency === "MONTHLY"}
            onPress={() =>
              handleUpdateSetting("CYCLE_QUESTIONNAIRE_REMINDER", "MONTHLY")
            }
            disabled={isUpdating}
            testID="freq-monthly"
          />
          <FrequencyOptionPill
            label="Off"
            selected={questionnaireFrequency === "NONE"}
            onPress={() =>
              handleUpdateSetting("CYCLE_QUESTIONNAIRE_REMINDER", "NONE")
            }
            disabled={isUpdating}
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
            value={phaseFrequency !== "NONE"}
            onValueChange={handleTogglePhaseNotifications}
            disabled={isUpdating}
            trackColor={{ false: Colors.gray200, true: Colors.lightBrand }}
            thumbColor={
              phaseFrequency !== "NONE" ? Colors.brand : Colors.gray100
            }
            ios_backgroundColor={Colors.gray200}
            testID="phase-notifications-toggle"
          />
        </View>
      </View>
    </SettingsPageLayout>
  );
}
