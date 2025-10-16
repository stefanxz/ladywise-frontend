import {
    getFailedLoginCount,
    incrementFailedLoginCount,
    resetFailedLoginCount,
} from "@/utils/asyncStorageHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage for predictable tests
jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};
  return {
    setItem: jest.fn(async (key, value) => {
      store[key] = value;
    }),
    getItem: jest.fn(async (key) => store[key] ?? null),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
});

describe("authStorage helper functions", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("returns 0 when no count is set", async () => {
    const count = await getFailedLoginCount();
    expect(count).toBe(0);
  });

  it("increments failed login count correctly", async () => {
    await incrementFailedLoginCount();
    await incrementFailedLoginCount();
    const count = await getFailedLoginCount();
    expect(count).toBe(2);
  });

  it("resets failed login count to 0", async () => {
    await incrementFailedLoginCount();
    await resetFailedLoginCount();
    const count = await getFailedLoginCount();
    expect(count).toBe(0);
  });
});