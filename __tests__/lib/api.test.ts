/**
 * @file api.test.ts
 * Tests for lib/api.ts
 */

import * as apiModule from "@/lib/api";
import * as authModule from "@/lib/auth";
import { RegisterPayload, LoginPayload, UserPayload, ChangePasswordPayload, UpdateHealthRequest, PasswordResetRequestPayload, ResetPasswordPayload } from "@/lib/types/payloads";
import { DailyLogRequest, PeriodLogRequest } from "@/lib/types/period";
import { api } from "@/lib/api";

jest.mock("axios", () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  return {
    create: jest.fn(() => mockInstance),
    isAxiosError: jest.fn((payload) => !!payload?.isAxiosError),
    defaults: { headers: { common: {} } },
  };
});

jest.mock("@/lib/auth", () => ({
  getAuthData: jest.fn(),
}));

describe("API Library", () => {
  // We need to cast the imported api to any or just access the mock methods directly
  // Since we mocked axios.create to return an object with jest.fns, api.* methods are already mocks.

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("registerUser posts to /api/auth/register", async () => {
      const payload: RegisterPayload = {
        email: "test@test.com",
        password: "pw",
        consentGiven: true,
        consentVersion: "v1"
      };

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
      const commonHeaders = api.defaults.headers.common as any;

      apiModule.setAuthToken("xyz");
      expect(commonHeaders["Authorization"]).toBe("Bearer xyz");

      apiModule.setAuthToken(null);
      expect(commonHeaders["Authorization"]).toBeUndefined();
    });

    it("requestPasswordReset posts to /api/auth/password-reset-request", async () => {
      const payload: PasswordResetRequestPayload = { email: "test@example.com" };
      (api.post as jest.Mock).mockResolvedValue({ data: "Email sent" });

      const res = await apiModule.requestPasswordReset(payload);
      expect(api.post).toHaveBeenCalledWith("/api/auth/password-reset-request", payload);
      expect(res).toBe("Email sent");
    });

    it("resetPassword posts to /api/auth/password-reset", async () => {
      const payload: ResetPasswordPayload = { token: "token123", newPassword: "newPass" };
      (api.post as jest.Mock).mockResolvedValue({ data: "Success" });

      const res = await apiModule.resetPassword(payload);
      expect(api.post).toHaveBeenCalledWith("/api/auth/password-reset", payload);
      expect(res).toBe("Success");
    });

    it("changePassword posts to /api/auth/change-password", async () => {
      const payload: ChangePasswordPayload = { currentPassword: "old", newPassword: "new" };
      (api.post as jest.Mock).mockResolvedValue({ data: "Success" });

      const res = await apiModule.changePassword(payload);
      expect(api.post).toHaveBeenCalledWith("/api/auth/change-password", payload);
      expect(res).toBe("Success");
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
      (api.get as jest.Mock).mockResolvedValue({ data: { personalDetails: { weight: 60 } } });
      const res = await apiModule.getUserHealth();
      expect(api.get).toHaveBeenCalledWith("/api/health");
      expect(res).toEqual({ personalDetails: { weight: 60 } });
    });

    it("updateHealthDocument patches /api/health", async () => {
      const payload: UpdateHealthRequest = {
        personalDetails: { weight: 65 },
        familyHistory: undefined,
        estrogenPill: undefined
      };
      (api.patch as jest.Mock).mockResolvedValue({ data: { personalDetails: { weight: 65 } } });

      const res = await apiModule.updateHealthDocument(payload);
      expect(api.patch).toHaveBeenCalledWith("/api/health", payload);
      expect(res).toEqual({ personalDetails: { weight: 65 } });
    });

    it("submitQuestionnaire posts to /api/questionnaire", async () => {
      const payload = { health: { personalDetails: { age: 25 } } };
      (api.post as jest.Mock).mockResolvedValue({ data: { id: "q1" } });

      const res = await apiModule.submitQuestionnaire(payload as any);
      expect(api.post).toHaveBeenCalledWith("/api/questionnaire", payload);
      expect(res).toEqual({ id: "q1" });
    });
  });

  describe("Risks & Reports", () => {
    it("getRiskData fetches /api/users/:id/risks", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { anemiaRisk: 1 } });
      await apiModule.getRiskData("token", "u1");
      expect(api.get).toHaveBeenCalledWith("/api/users/u1/risks", expect.anything());
    });

    it("getRiskHistory fetches /api/users/:id/risks/history", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [] });
      await apiModule.getRiskHistory("token", "u1");
      // Updated to match the new implementation which calls /api/diagnostics
      expect(api.get).toHaveBeenCalledWith("/api/diagnostics", expect.objectContaining({
        headers: { Authorization: "Bearer token" }
      }));
    });

    it("shareReport posts to /api/reports/share", async () => {
      const payload = { clinicianEmail: "doc@test.com", reportType: "FULL" };
      (api.post as jest.Mock).mockResolvedValue({ data: "Sent" });

      const res = await apiModule.shareReport("token", payload as any);
      expect(api.post).toHaveBeenCalledWith("/api/reports/share", payload, expect.anything());
      expect(res).toBe("Sent");
    });
  });

  describe("Period & Cycle", () => {
    it("getCycleStatus fetches /api/cycle/status", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { phase: "MENSTRUAL" } });
      const res = await apiModule.getCycleStatus();
      expect(api.get).toHaveBeenCalledWith("/api/cycle/status");
      expect(res).toEqual({ phase: "MENSTRUAL" });
    });

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

    it("createDailyEntry posts to /api/periods/entries", async () => {
      const payload: DailyLogRequest = {
        date: "2024-01-01",
        flow: "HEAVY",
        symptoms: [],
        riskFactors: []
      };
      (api.post as jest.Mock).mockResolvedValue({ data: { id: "d1" } });

      const res = await apiModule.createDailyEntry(payload);
      expect(api.post).toHaveBeenCalledWith("/api/periods/entries", payload);
      expect(res).toEqual({ id: "d1" });
    });

    it("updateDailyEntry puts to /api/periods/:id/entries", async () => {
      const payload: DailyLogRequest = {
        date: "2024-01-01",
        flow: "NORMAL",
        symptoms: [],
        riskFactors: []
      };
      (api.put as jest.Mock).mockResolvedValue({ data: { id: "d1" } });

      const res = await apiModule.updateDailyEntry(payload, "p1");
      expect(api.put).toHaveBeenCalledWith("/api/periods/p1/entries", payload);
      expect(res).toEqual({ id: "d1" });
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

    it("getPredictions fetches predictions with default cycles param", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [] });
      await apiModule.getPredictions(); // No arg = default 6
      expect(api.get).toHaveBeenCalledWith("/api/cycle/predictions", {
        params: { cycles: 6 },
      });
    });

    it("getPredictions fetches predictions with custom cycles param", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [] });
      await apiModule.getPredictions(12);
      expect(api.get).toHaveBeenCalledWith("/api/cycle/predictions", {
        params: { cycles: 12 },
      });
    });
  });

  describe("Misc", () => {
    it("getTutorials fetches /api/tutorials", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: [] });
      const res = await apiModule.getTutorials();
      expect(api.get).toHaveBeenCalledWith("/api/tutorials");
      expect(res).toEqual([]);
    });
  });

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