/**
 * @file api.test.ts
 * Tests for lib/api.ts 
 */

import * as apiModule from "@/lib/api";
import * as authModule from "@/lib/auth";
import { RegisterPayload, LoginPayload, UserPayload } from "@/lib/types/payloads";
import { PeriodLogRequest } from "@/lib/types/period";
import { api } from "@/lib/api";


// mock axios module 
jest.mock("axios", () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    defaults: { 
      headers: { 
        common: {} 
      } 
    },
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  return {
    // return the factory that produces mock instance
    create: jest.fn(() => mockInstance),
    isAxiosError: jest.fn((payload) => !!payload?.isAxiosError),
    defaults: { headers: { common: {} } },
  };
});

jest.mock("@/lib/auth", () => ({
  getAuthData: jest.fn(),
}));


describe("API Library", () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // General API Tests 
  // ==========================================

  describe("Authentication", () => {
    it("registerUser posts to /api/auth/register", async () => {
      const payload: RegisterPayload = { 
        email: "test@test.com", 
        password: "pw", 
        consentGiven: true, 
        consentVersion: "v1" 
      };
      
      // spy/mock the implementation on the imported 'api' object
      (api.post as jest.Mock).mockResolvedValue({ data: { token: "abc" } });

      const res = await apiModule.registerUser(payload);
      
      expect(api.post).toHaveBeenCalledWith("/api/auth/register", payload);
      expect(res).toEqual({ token: "abc" });
    });

    it("loginUser posts to /api/auth/login", async () => {
      const payload: LoginPayload = { email: "test@test.com", password: "pw" };
      (api.post as jest.Mock).mockResolvedValue({ data: { token: "abc" } });

      const res = await apiModule.loginUser(payload);
      expect(api.post).toHaveBeenCalledWith("/api/auth/login", payload);
      expect(res).toEqual({ token: "abc" });
    });

    it("setAuthToken sets and removes headers", () => {
      // we must cast headers.common to any to avoid TS errors
      const commonHeaders = api.defaults.headers.common as any;

      apiModule.setAuthToken("xyz");
      expect(commonHeaders["Authorization"]).toBe("Bearer xyz");

      apiModule.setAuthToken(null);
      expect(commonHeaders["Authorization"]).toBeUndefined();
    });
  });

  describe("User Management", () => {
    it("updateUser patches /api/users/updateUser", async () => {
      const payload: UserPayload = { id: "1", email: "e", firstName: "A", lastName: "B" };
      (api.patch as jest.Mock).mockResolvedValue({ data: payload });

      const res = await apiModule.updateUser(payload);
      expect(api.patch).toHaveBeenCalledWith("/api/users/updateUser", payload);
      expect(res).toEqual(payload);
    });

    it("getUserById fetches /api/users/:id", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { id: "123" } });
      await apiModule.getUserById("token", "123");
      expect(api.get).toHaveBeenCalledWith("/api/users/123", expect.objectContaining({
        headers: { Authorization: "Bearer token" }
      }));
    });

    it("deleteCurrentUser calls DELETE /api/users/me", async () => {
      (api.delete as jest.Mock).mockResolvedValue({});
      await apiModule.deleteCurrentUser();
      expect(api.delete).toHaveBeenCalledWith("/api/users/me");
    });
  });

  describe("Health Data", () => {
    it("getUserHealth fetches /api/health", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { weight: 60 } });
      const res = await apiModule.getUserHealth();
      expect(api.get).toHaveBeenCalledWith("/api/health");
      expect(res).toEqual({ weight: 60 });
    });

    it("submitQuestionnaire posts to /api/questionnaire", async () => {
      // @ts-ignore - partial mock
      const payload = { health: { personalDetails: { age: 25 } } };
      (api.post as jest.Mock).mockResolvedValue({ data: { id: "q1" } });
      
      const res = await apiModule.submitQuestionnaire(payload as any);
      expect(api.post).toHaveBeenCalledWith("/api/questionnaire", payload);
      expect(res).toEqual({ id: "q1" });
    });
  });

  describe("Period & Cycle", () => {
    it("getPeriodHistory fetches /api/cycle/history", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [] });
      await apiModule.getPeriodHistory();
      expect(api.get).toHaveBeenCalledWith("/api/cycle/history");
    });

    it("getDailyEntry fetches /api/periods/entries/:date", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { flow: "LIGHT" } });
      await apiModule.getDailyEntry("2024-01-01");
      expect(api.get).toHaveBeenCalledWith("/api/periods/entries/2024-01-01");
    });

    it("logNewPeriod posts to /api/periods", async () => {
      const payload: PeriodLogRequest = { startDate: "2024-01-01", endDate: null };
      (api.post as jest.Mock).mockResolvedValue({ data: { id: "p1" } });
      await apiModule.logNewPeriod(payload);
      expect(api.post).toHaveBeenCalledWith("/api/periods", payload);
    });

    it("updatePeriod puts to /api/periods/:id", async () => {
        const payload: PeriodLogRequest = { startDate: "2024-01-01", endDate: "2024-01-05" };
        (api.put as jest.Mock).mockResolvedValue({ data: { id: "p1" } });
        await apiModule.updatePeriod("p1", payload);
        expect(api.put).toHaveBeenCalledWith("/api/periods/p1", payload);
    });

    it("deletePeriod calls DELETE /api/periods/:id", async () => {
        (api.delete as jest.Mock).mockResolvedValue({ data: "ok" });
        await apiModule.deletePeriod("p1");
        expect(api.delete).toHaveBeenCalledWith("/api/periods/p1");
    });
  });

  describe("Risks & Reports", () => {
    it("getRiskData fetches /api/users/:id/risks", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { anemiaRisk: 1 } });
      await apiModule.getRiskData("token", "u1");
      expect(api.get).toHaveBeenCalledWith("/api/users/u1/risks", expect.anything());
    });

    it("shareReport posts to /api/reports/share", async () => {
      // @ts-ignore
      const payload = { clinicianEmail: "doc@test.com", reportType: "FULL" };
      (api.post as jest.Mock).mockResolvedValue({ data: "Sent" });
      
      const res = await apiModule.shareReport("token", payload as any);
      expect(api.post).toHaveBeenCalledWith("/api/reports/share", payload, expect.anything());
      expect(res).toBe("Sent");
    });
  });

  // ==========================================
  // Questionnaire specific logic tests 
  // ==========================================

  describe("Questionnaire Logic (Legacy Tests)", () => {
    
    describe("markFirstQuestionnaireComplete", () => {
      it("calls completion endpoint with authenticated user", async () => {
        (authModule.getAuthData as jest.Mock).mockResolvedValue({
          userId: "user123",
          token: "valid-token",
        });
        (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

        const result = await apiModule.markFirstQuestionnaireComplete();

        expect(result).toEqual({ success: true });
        expect(api.post).toHaveBeenCalledWith(
          expect.stringContaining("/first-questionnaire/complete"),
          expect.objectContaining({ userId: "user123" }),
        );
      });

      it("throws when no auth data is found", async () => {
        (authModule.getAuthData as jest.Mock).mockResolvedValue({
          userId: null,
          token: null,
        });
        await expect(apiModule.markFirstQuestionnaireComplete()).rejects.toThrow(
          "User not authenticated",
        );
      });
    });

    describe("checkCycleQuestionnaireAccess", () => {
      it("returns access data when API call succeeds", async () => {
        (authModule.getAuthData as jest.Mock).mockResolvedValue({
          userId: "user123",
          token: "valid-token",
        });

        const mockResponse = { allowed: true, reason: "completed" };
        (api.get as jest.Mock).mockResolvedValue({ data: mockResponse });

        const result = await apiModule.checkCycleQuestionnaireAccess();

        expect(result).toEqual(mockResponse);
        expect(api.get).toHaveBeenCalledWith(
          expect.stringContaining("/cycle-questionnaire/access"),
          expect.objectContaining({ params: { userId: "user123" } }),
        );
      });

      it("returns mock { allowed: true } on Network Error (no response)", async () => {
        (authModule.getAuthData as jest.Mock).mockResolvedValue({
          userId: "user123",
          token: "valid-token",
        });

        const networkError = new Error("Network Error");
        (networkError as any).isAxiosError = true; 
        (networkError as any).response = undefined;

        (api.get as jest.Mock).mockRejectedValue(networkError);

        const result = await apiModule.checkCycleQuestionnaireAccess();

        expect(result).toEqual({ allowed: true });
      });

      it("rethrows error on actual Backend Error (e.g. 500 or 403)", async () => {
        (authModule.getAuthData as jest.Mock).mockResolvedValue({
          userId: "user123",
          token: "valid-token",
        });

        const backendError = new Error("Internal Server Error");
        (backendError as any).isAxiosError = true;
        (backendError as any).response = { status: 500 };

        (api.get as jest.Mock).mockRejectedValue(backendError);

        await expect(apiModule.checkCycleQuestionnaireAccess()).rejects.toThrow(
          "Internal Server Error",
        );
      });

      it("throws when user is not authenticated", async () => {
        (authModule.getAuthData as jest.Mock).mockResolvedValue({}); // no userId or token
        await expect(apiModule.checkCycleQuestionnaireAccess()).rejects.toThrow(
          "User not authenticated",
        );
      });
    });
  });
});