/**
 * Supported notification types for user preferences.
 * Must match backend enum: nl.tue.ladywise_backend.notification.model.NotificationType
 */
export enum NotificationType {
  CYCLE_PHASE_UPDATE = "CYCLE_PHASE_UPDATE",
  CYCLE_QUESTIONNAIRE_REMINDER = "CYCLE_QUESTIONNAIRE_REMINDER",
}

/**
 * Frequency of notifications.
 * Must match backend enum: nl.tue.ladywise_backend.notification.model.NotificationFrequency
 */
export enum NotificationFrequency {
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
  NONE = "NONE",
}