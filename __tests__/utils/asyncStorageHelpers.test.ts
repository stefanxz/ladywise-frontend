import {
  incrementFailedLoginCount,
  resetFailedLoginCount,
  getFailedLoginCount,
} from "@/utils/asyncStorageHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

// mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("AsyncStorage Helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {}); 
  });

  describe("incrementFailedLoginCount", () => {
    it("starts at 1 if no previous count exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await incrementFailedLoginCount();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("failedLoginCount", "1");
    });

    it("increments existing count", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("2");

      await incrementFailedLoginCount();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("failedLoginCount", "3");
    });

    it("logs error if storage fails", async () => {
      const error = new Error("Storage full");
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

      await incrementFailedLoginCount();

      expect(console.error).toHaveBeenCalledWith(
        "Error updating failed login count",
        error
      );
    });
  });

  describe("resetFailedLoginCount", () => {
    it("sets count to 0", async () => {
      await resetFailedLoginCount();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("failedLoginCount", "0");
    });

    it("logs error if storage fails", async () => {
      const error = new Error("Storage full");
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);

      await resetFailedLoginCount();

      expect(console.error).toHaveBeenCalledWith(
        "Error resetting failed login count",
        error
      );
    });
  });

  describe("getFailedLoginCount", () => {
    it("returns stored count as number", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("5");
      const result = await getFailedLoginCount();
      expect(result).toBe(5);
    });

    it("returns 0 if value is missing", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await getFailedLoginCount();
      expect(result).toBe(0);
    });

    it("returns 0 and logs error if storage fails", async () => {
      const error = new Error("Read fail");
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

      const result = await getFailedLoginCount();
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        "Error getting failed login count:",
        error
      );
    });
  });
});