import {
  registerPushToken,
  getNotificationSettings,
  updateNotificationSetting,
  sendTestNotification,
} from "@/lib/notifications";
import type { NotificationFrequency } from "@/lib/types/notification";
import { api } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("Notification API Helpers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerPushToken", () => {
    it("posts the token to the correct endpoint", async () => {
      const mockToken = "ExponentPushToken[123]";
      const mockResponse = {
        data: {
          preferences: {
            CYCLE_PHASE_UPDATE: "DAILY",
            CYCLE_QUESTIONNAIRE_REMINDER: "DAILY",
          },
        },
      };
      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await registerPushToken(mockToken);

      expect(api.post).toHaveBeenCalledWith(
        "/api/notifications/register-token",
        { token: mockToken },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getNotificationSettings", () => {
    it("fetches settings and returns preferences", async () => {
      const mockPreferences = {
        CYCLE_PHASE_UPDATE: "DAILY" as NotificationFrequency,
        CYCLE_QUESTIONNAIRE_REMINDER: "MONTHLY" as NotificationFrequency,
      };
      const mockResponse = {
        data: { preferences: mockPreferences },
      };
      (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getNotificationSettings();

      expect(api.get).toHaveBeenCalledWith("/api/notifications/settings");
      expect(result).toEqual(mockPreferences);
    });
  });

  describe("updateNotificationSetting", () => {
    it("patches the setting with correct payload", async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await updateNotificationSetting("CYCLE_PHASE_UPDATE", "NONE");

      expect(api.patch).toHaveBeenCalledWith("/api/notifications/settings", {
        type: "CYCLE_PHASE_UPDATE",
        frequency: "NONE",
      });
    });

    it("patches questionnaire reminder with DAILY frequency", async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await updateNotificationSetting("CYCLE_QUESTIONNAIRE_REMINDER", "DAILY");

      expect(api.patch).toHaveBeenCalledWith("/api/notifications/settings", {
        type: "CYCLE_QUESTIONNAIRE_REMINDER",
        frequency: "DAILY",
      });
    });

    it("patches with MONTHLY frequency", async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await updateNotificationSetting(
        "CYCLE_QUESTIONNAIRE_REMINDER",
        "MONTHLY",
      );

      expect(api.patch).toHaveBeenCalledWith("/api/notifications/settings", {
        type: "CYCLE_QUESTIONNAIRE_REMINDER",
        frequency: "MONTHLY",
      });
    });
  });

  describe("sendTestNotification", () => {
    it("calls the force-test endpoint", async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: "Sent!" });

      const result = await sendTestNotification();

      expect(api.post).toHaveBeenCalledWith("/api/notifications/force-test");
      expect(result).toBe("Sent!");
    });
  });

  // verify API errors are propagated correctly
  describe("Error Handling", () => {
    it("throws error when API call fails", async () => {
      const mockError = new Error("Network Error");
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getNotificationSettings()).rejects.toThrow("Network Error");
    });
  });
});
