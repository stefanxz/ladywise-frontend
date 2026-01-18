/**
 * Represents the distinct categories of notifications available in the system.
 * - `CYCLE_PHASE_UPDATE`: Alerts triggered when the user enters a new menstrual phase.
 * - `CYCLE_QUESTIONNAIRE_REMINDER`: Periodic prompts to complete the daily health log.
 */
export type NotificationType =
  | "CYCLE_PHASE_UPDATE"
  | "CYCLE_QUESTIONNAIRE_REMINDER";

/**
 * Defines the allowed frequency settings for notification delivery.
 * - `DAILY`: Receive notifications every day (e.g., daily logs).
 * - `MONTHLY`: Receive notifications once per cycle/month.
 * - `NONE`: Disable this notification type completely.
 */
export type NotificationFrequency = "DAILY" | "MONTHLY" | "NONE";

/**
 * Payload for registering a device's push notification token with the backend.
 */
export type RegisterTokenRequest = {
  /** The unique Expo Push Token string. */
  token: string;
};

/**
 * API Response structure containing the user's current notification preferences.
 * Maps each notification type to its configured frequency.
 */
export type NotificationSettingsResponse = {
  preferences: Record<NotificationType, NotificationFrequency>;
};

/**
 * Payload for updating a specific notification setting.
 */
export type UpdateSettingRequest = {
  /** The category of notification to update. */
  type: NotificationType;
  /** The new frequency setting to apply. */
  frequency: NotificationFrequency;
};
