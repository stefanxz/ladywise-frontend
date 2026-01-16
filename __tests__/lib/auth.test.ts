import * as auth from "@/lib/auth";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Mocks ---
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  isAvailableAsync: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// helper to create a fake JWT string
const createMockJwt = (payload: object) => {
  const header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; // {"alg":"HS256","typ":"JWT"}
  // using Buffer to encode base64 for NodeJS environment
  const body = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = "fakeSignature";
  return `${header}.${body}.${signature}`;
};

describe("Auth Library", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Storage Operations (Native/SecureStore)", () => {
    // simulate Native Environment where SecureStore works
    beforeEach(() => {
      (SecureStore.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    });

    it("storeAuthData saves to SecureStore", async () => {
      await auth.storeAuthData("token123", "user123", "test@test.com");

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth_token",
        "token123",
      );
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth_user_id",
        "user123",
      );
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth_email",
        "test@test.com",
      );
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it("getAuthData retrieves from SecureStore", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockImplementation(
        async (key) => {
          if (key === "auth_token") return "token123";
          if (key === "auth_user_id") return "user123";
          if (key === "auth_email") return "test@test.com";
          return null;
        },
      );

      const data = await auth.getAuthData();

      expect(data).toEqual({
        token: "token123",
        userId: "user123",
        email: "test@test.com",
      });
      expect(SecureStore.getItemAsync).toHaveBeenCalledTimes(3);
    });

    it("clearAuthData removes from SecureStore", async () => {
      await auth.clearAuthData();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_user_id");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_email");
    });
  });

  describe("Token Validation (JWT)", () => {
    it("returns NO_TOKEN if data is missing", () => {
      expect(auth.isTokenValid(null)).toBe("NO_TOKEN");
      expect(auth.isTokenValid({ token: null })).toBe("NO_TOKEN");
    });

    it("returns VALID for unexpired token", () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour later
      const token = createMockJwt({ exp: futureTime });

      expect(auth.isTokenValid({ token })).toBe("VALID");
    });

    it("returns EXPIRED for expired token", () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const token = createMockJwt({ exp: pastTime });

      expect(auth.isTokenValid({ token })).toBe("EXPIRED");
    });

    it("returns EXPIRED (or safe fail) for malformed token", () => {
      expect(auth.isTokenValid({ token: "invalid.token.structure" })).toBe(
        "EXPIRED",
      );
    });
  });

  describe("isAuthenticated", () => {
    it("returns true only if token is valid AND user details exist", async () => {
      // mocking getAuthData to return a valid session
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const validToken = createMockJwt({ exp: futureTime });

      // mocking the internal behavior of SecureStore to simulate getAuthData success
      (SecureStore.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (SecureStore.getItemAsync as jest.Mock).mockImplementation(
        async (key) => {
          if (key === "auth_token") return validToken;
          if (key === "auth_user_id") return "123";
          if (key === "auth_email") return "test@test.com";
          return null;
        },
      );

      const result = await auth.isAuthenticated();
      expect(result).toBe(true);
    });

    it("returns false if token is expired", async () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const expiredToken = createMockJwt({ exp: pastTime });

      (SecureStore.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (SecureStore.getItemAsync as jest.Mock).mockImplementation(
        async (key) => {
          if (key === "auth_token") return expiredToken;
          return "some-value";
        },
      );

      const result = await auth.isAuthenticated();
      expect(result).toBe(false);
    });
  });
});
