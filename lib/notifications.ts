import { api } from './api'; // Imports the axios instance from your existing lib/api.ts
import { NotificationType } from './types/notification';

export interface RegisterTokenRequest {
  token: string;
}

export interface NotificationSettingsResponse {
  preferences: Record<NotificationType, boolean>;
}

export interface UpdateSettingRequest {
  type: NotificationType;
  enabled: boolean;
}

export const registerPushToken = async (token: string) => {
  // Uses your existing axios instance configuration
  const { data } = await api.post<void>('/api/notifications/register-token', {
    token,
  } as RegisterTokenRequest);
  return data;
};

export const getNotificationSettings = async () => {
  const { data } = await api.get<NotificationSettingsResponse>('/api/notifications/settings');
  return data.preferences;
};

export const updateNotificationSetting = async (type: NotificationType, enabled: boolean) => {
  const { data } = await api.patch<void>('/api/notifications/settings', {
    type,
    enabled,
  } as UpdateSettingRequest);
  return data;
};

export const sendTestNotification = async () => {
  // We expect a string response like "Sent test notification..."
  const { data } = await api.post<string>('/api/notifications/force-test');
  return data;
};