export type NotificationType =
  | "CYCLE_PHASE_UPDATE"
  | "CYCLE_QUESTIONNAIRE_REMINDER";

export type NotificationFrequency = "DAILY" | "MONTHLY" | "NONE";

export type RegisterTokenRequest = {
  token: string;
};

export type NotificationSettingsResponse = {
  preferences: Record<NotificationType, NotificationFrequency>;
};

export type UpdateSettingRequest = {
  type: NotificationType;
  frequency: NotificationFrequency;
};
