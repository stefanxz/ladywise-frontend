/**
 * __tests__/lib/api-questionnaire.test.ts
 */

import * as auth from "@/lib/auth";
import {
  markFirstQuestionnaireComplete,
  checkCycleQuestionnaireAccess,
} from "@/lib/api";

jest.mock("axios", () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockInstance),
      isAxiosError: jest.fn(),
      post: jest.fn(),
      get: jest.fn(),
    },
    create: jest.fn(() => mockInstance),
    isAxiosError: jest.fn(),
  };
});

jest.mock("@/lib/auth");

// Helper to access the mock instance easily in tests
const mockAxios = require("axios").default;
const mockApi = mockAxios.create();

describe("Questionnaire API Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.create.mockReturnValue(mockApi);
  });

  describe("markFirstQuestionnaireComplete", () => {
    it("calls completion endpoint with authenticated user", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({
        userId: "user123",
        token: "valid-token",
      });
      mockApi.post.mockResolvedValue({ data: { success: true } });

      const result = await markFirstQuestionnaireComplete();

      expect(result).toEqual({ success: true });
      expect(mockApi.post).toHaveBeenCalledWith(
        expect.stringContaining("/first-questionnaire/complete"),
        expect.objectContaining({ userId: "user123" }),
      );
    });

    it("throws when no auth data is found", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({
        userId: null,
        token: null,
      });
      await expect(markFirstQuestionnaireComplete()).rejects.toThrow(
        "User not authenticated",
      );
    });
  });

  describe("checkCycleQuestionnaireAccess", () => {
    it("returns access data when API call succeeds", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({
        userId: "user123",
        token: "valid-token",
      });

      const mockResponse = { allowed: true, reason: "completed" };
      mockApi.get.mockResolvedValue({ data: mockResponse });

      const result = await checkCycleQuestionnaireAccess();

      expect(result).toEqual(mockResponse);
      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringContaining("/cycle-questionnaire/access"),
        expect.objectContaining({ params: { userId: "user123" } }),
      );
    });

    it("returns mock { allowed: true } on Network Error (no response)", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({
        userId: "user123",
        token: "valid-token",
      });

      // Explicitly tell the mocked isAxiosError to return true
      mockAxios.isAxiosError.mockReturnValue(true);

      // Simulate an error where the server is unreachable (response is undefined)
      const networkError = new Error("Network Error");
      (networkError as any).response = undefined;

      mockApi.get.mockRejectedValue(networkError);

      const result = await checkCycleQuestionnaireAccess();

      expect(result).toEqual({ allowed: true });
    });

    it("rethrows error on actual Backend Error (e.g. 500 or 403)", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({
        userId: "user123",
        token: "valid-token",
      });

      mockAxios.isAxiosError.mockReturnValue(true);

      const backendError = new Error("Internal Server Error");
      (backendError as any).response = { status: 500 };

      mockApi.get.mockRejectedValue(backendError);

      await expect(checkCycleQuestionnaireAccess()).rejects.toThrow(
        "Internal Server Error",
      );
    });

    it("throws when user is not authenticated", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({}); // Missing userId/token
      await expect(checkCycleQuestionnaireAccess()).rejects.toThrow(
        "User not authenticated",
      );
    });
  });
});
