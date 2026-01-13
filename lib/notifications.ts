import { api } from "./api";
import {
  NotificationFrequency,
  NotificationSettingsResponse,
  NotificationType,
  RegisterTokenRequest,
  UpdateSettingRequest,
} from "@/lib/types/notification";

/**
 * Registers the device's push notification token with the backend.
 *
 * @param {string} token - The Expo push token
 * @returns {Promise<void>}
 */
export const registerPushToken = async (token: string) => {
  // Uses your existing axios instance configuration
  const { data } = await api.post<void>("/api/notifications/register-token", {
    token,
  } as RegisterTokenRequest);
  return data;
};

/**
 * Retrieves current notification preferences.
 *
 * @returns {Promise<Record<NotificationType, boolean>>} Map of preferences
 */
export const getNotificationSettings = async () => {
  const { data } = await api.get<NotificationSettingsResponse>(
    "/api/notifications/settings",
  );
  return data.preferences;
};

/**
 * Updates a specific notification preference.
 *
 * @param {NotificationType} type - The notification type to update
 * @param {NotificationType} frequency - The frequency of notifications
 * @returns {Promise<void>}
 */
export const updateNotificationSetting = async (
  type: NotificationType,
  frequency: NotificationFrequency,
) => {
  const { data } = await api.patch<void>("/api/notifications/settings", {
    type,
    frequency,
  } as UpdateSettingRequest);
  return data;
};

/**
 * Triggers a test notification for the current user.
 *
 * @returns {Promise<string>} Status message
 */
export const sendTestNotification = async () => {
  // We expect a string response like "Sent test notification..."
  const { data } = await api.post<string>("/api/notifications/force-test");
  return data;
};
