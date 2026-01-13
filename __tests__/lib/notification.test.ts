import {
  registerPushToken,
  getNotificationSettings,
  updateNotificationSetting,
  sendTestNotification,
} from "@/lib/notifications";
import { NotificationType } from "@/lib/types/notification";
import { api } from "@/lib/api";

// Mock the axios instance
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
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { success: true },
      });

      await registerPushToken(mockToken);

      expect(api.post).toHaveBeenCalledWith(
        "/api/notifications/register-token",
        {
          token: mockToken,
        },
      );
    });
  });

  describe("getNotificationSettings", () => {
    it("fetches settings and returns preferences", async () => {
      const mockResponse = {
        data: {
          preferences: { [NotificationType.CYCLE_PHASE_UPDATE]: true },
        },
      };
      (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getNotificationSettings();

      expect(api.get).toHaveBeenCalledWith("/api/notifications/settings");
      expect(result).toEqual({ [NotificationType.CYCLE_PHASE_UPDATE]: true });
    });
  });

  describe("updateNotificationSetting", () => {
    it("patches the setting with correct payload", async () => {
      (api.patch as jest.Mock).mockResolvedValueOnce({ data: {} });

      await updateNotificationSetting(
        NotificationType.CYCLE_PHASE_UPDATE,
        false,
      );

      expect(api.patch).toHaveBeenCalledWith("/api/notifications/settings", {
        type: NotificationType.CYCLE_PHASE_UPDATE, // Uses Enum for robustness
        enabled: false,
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