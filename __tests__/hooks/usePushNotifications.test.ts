import { renderHook, waitFor } from "@testing-library/react-native";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { registerPushToken } from "@/lib/notifications";

jest.mock("expo-notifications");
jest.mock("expo-device");
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      eas: { projectId: "test-project-id" },
    },
  },
}));

jest.mock("@/lib/notifications", () => ({
  registerPushToken: jest.fn(),
}));

describe("usePushNotifications Hook", () => {
  const mockAddNotificationReceivedListener = jest.fn();
  const mockAddNotificationResponseReceivedListener = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Notification Listeners mocks
    mockAddNotificationReceivedListener.mockReturnValue({ remove: mockRemove });
    mockAddNotificationResponseReceivedListener.mockReturnValue({
      remove: mockRemove,
    });

    (Notifications.addNotificationReceivedListener as jest.Mock) =
      mockAddNotificationReceivedListener;
    (Notifications.addNotificationResponseReceivedListener as jest.Mock) =
      mockAddNotificationResponseReceivedListener;

    (Device as any).isDevice = true;
  });

  it("does nothing if user is not authenticated", () => {
    renderHook(() => usePushNotifications(false));

    expect(Notifications.getPermissionsAsync).not.toHaveBeenCalled();
  });

  it("registers token successfully when authenticated and permissions granted", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
      data: "ExponentPushToken[test-token]",
    });

    const { result } = renderHook(() => usePushNotifications(true));

    await waitFor(() => {
      expect(result.current.expoPushToken).toBe(
        "ExponentPushToken[test-token]",
      );
    });

    expect(registerPushToken).toHaveBeenCalledWith(
      "ExponentPushToken[test-token]",
    );
  });

  it("requests permissions if not initially granted", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "undetermined",
    });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
      data: "fake-token",
    });

    renderHook(() => usePushNotifications(true));

    await waitFor(() => {
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(registerPushToken).toHaveBeenCalledWith("fake-token");
    });
  });

  it("does NOT register token if permission is denied", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const { result } = renderHook(() => usePushNotifications(true));

    await waitFor(() => {
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
    });

    expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
    expect(registerPushToken).not.toHaveBeenCalled();
    expect(result.current.expoPushToken).toBeUndefined();
  });

  it("sets up Android notification channel on Android", async () => {
    Platform.OS = "android";
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
      data: "token",
    });

    renderHook(() => usePushNotifications(true));

    await waitFor(() => {
      expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        "default",
        expect.objectContaining({
          importance: Notifications.AndroidImportance.MAX,
        }),
      );
    });
  });

  it("does NOT register token if not on a physical device", async () => {
    (Device as any).isDevice = false; // Simulator

    renderHook(() => usePushNotifications(true));

    // Wait a tick to ensure effect ran
    await waitFor(() =>
      expect(Notifications.getPermissionsAsync).not.toHaveBeenCalled(),
    );

    expect(registerPushToken).not.toHaveBeenCalled();
  });

  it("cleans up listeners on unmount", () => {
    const { unmount } = renderHook(() => usePushNotifications(true));

    unmount();

    expect(mockRemove).toHaveBeenCalledTimes(2); // One for received, one for response
  });
});
