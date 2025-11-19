/**
 * __tests__/lib/questionnaireService.test.ts
 */

import * as auth from "@/lib/auth";
import { 
  markFirstQuestionnaireComplete, 
  checkCycleQuestionnaireAccess 
} from "@/lib/questionnaireService";
import axios from "axios";

jest.mock("axios");
jest.mock("@/lib/auth");

describe("questionnaireService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("markFirstQuestionnaireComplete", () => {
    it("calls completion endpoint with authenticated user", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({ 
        userId: "user123", 
        token: "valid-token" 
      });
      (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      const result = await markFirstQuestionnaireComplete();
      
      expect(result).toEqual({ success: true });
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/first-questionnaire/complete"),
        { userId: "user123" }
      );
    });

    it("throws when no auth data is found", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({ userId: null, token: null });
      await expect(markFirstQuestionnaireComplete()).rejects.toThrow("User not authenticated");
    });
  });

  describe("checkCycleQuestionnaireAccess", () => {
    it("returns access data when API call succeeds", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({ 
        userId: "user123", 
        token: "valid-token" 
      });
      
      const mockResponse = { allowed: true, reason: "completed" };
      (axios.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await checkCycleQuestionnaireAccess();

      expect(result).toEqual(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/cycle-questionnaire/access"),
        { params: { userId: "user123" } }
      );
    });

    it("returns mock { allowed: true } on Network Error (no response)", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({ 
        userId: "user123", 
        token: "valid-token" 
      });

      // FIX: Explicitly tell the mocked isAxiosError to return true
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      // Simulate an error where the server is unreachable (response is undefined)
      const networkError = new Error("Network Error");
      (networkError as any).response = undefined; 

      (axios.get as jest.Mock).mockRejectedValue(networkError);

      const result = await checkCycleQuestionnaireAccess();

      // Should return the fallback defined in your service
      expect(result).toEqual({ allowed: true });
    });

    it("rethrows error on actual Backend Error (e.g. 500 or 403)", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({ 
        userId: "user123", 
        token: "valid-token" 
      });

      // FIX: explicit true here as well just to be safe, though not strictly required if it fails later
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      // Simulate an error where the server DID respond (e.g., Internal Server Error)
      const backendError = new Error("Internal Server Error");
      (backendError as any).response = { status: 500 }; 

      (axios.get as jest.Mock).mockRejectedValue(backendError);

      // Should NOT catch this, should rethrow
      await expect(checkCycleQuestionnaireAccess()).rejects.toThrow("Internal Server Error");
    });

    it("throws when user is not authenticated", async () => {
      (auth.getAuthData as jest.Mock).mockResolvedValue({}); // Missing userId/token
      await expect(checkCycleQuestionnaireAccess()).rejects.toThrow("User not authenticated");
    });
  });
});