import axios from "axios";
import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  LoginPayload,
  LoginResponse,
  PasswordResetRequestPayload,
  QuestionnairePayload,
  QuestionnaireResponse,
  RegisterPayload,
  ResetPasswordPayload,
  UserPayload,
  UserResponse,
} from "./types";
import type { ReportRequest } from "./types/reports";
import { CycleStatusDTO } from "./types/cycle";
import { getAuthData } from "./auth";
import { ApiRiskResponse, RiskHistoryPoint } from "./types/risks";
import { DailyLogRequest, DailyLogResponse } from "@/lib/types/period";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Preserve AxiosError details while ensuring a readable message for UI handling.
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ?? error.message ?? "Request failed.";
      error.message = message;
    }
    return Promise.reject(error);
  },
);

// register new user by sending their credentials to the backend API
// uses the base URL from .env + '/api/auth/register'
export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<LoginResponse>("/api/auth/register", payload);
  return data;
}

// authenticate an existing user and return their auth token
export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
  return data;
}

//update user data of an existing user
export async function updateUser(payload: UserPayload) {
  const { data } = await api.patch<UserResponse>(
    "/api/users/updateUser",
    payload,
  );
  return data;
}

/**
 * Changes the password for the authenticated user.
 *
 * Requires the user to be authenticated and provide their current password for
 * verification. The new password must meet validation requirements and be
 * different from the current password.
 *
 * @param payload - Object containing the currentPassword and newPassword
 */
export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await api.post<ChangePasswordResponse>(
    "/api/auth/change-password",
    payload,
  );
  return data;
}

// Fetch a user by ID
export async function getUserById(
  token: string,
  userId: string,
): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>(`/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getRiskData(
  token: string,
  userId: string,
): Promise<ApiRiskResponse> {
  // <-- Use the correct response type
  const config = {
    params: { userId },
    headers: { Authorization: `Bearer ${token}` },
  };
  // Use the correct generic type
  const { data } = await api.get<ApiRiskResponse>(
    `/api/users/${userId}/risks`,
    config,
  );
  return data; // This returns: { thrombosisRisk: 1, anemiaRisk: 2 }
}

export async function getRiskHistory(
  token: string,
  userId: string,
): Promise<RiskHistoryPoint[]> {
  const config = {
    params: { userId },
    headers: { Authorization: `Bearer ${token}` },
  };

  const { data } = await api.get<RiskHistoryPoint[]>(
    `/api/users/${userId}/risks/history`,
    config,
  );

  return data;
}

export async function getCycleStatus() {
  const { data } = await api.get<CycleStatusDTO>("/api/cycle/status");
  return data;
}

/**
 * Retrieves a daily cycle entry for a specific date.
 *
 * @param date {string} - The date to fetch the entry for, in YYYY-MM-DD format
 * @returns A promise that resolves to the daily log data for the passed date
 */
export async function getDailyEntry(date: string): Promise<DailyLogResponse> {
  const { data } = await api.get<DailyLogResponse>(
    `/api/periods/entries/${date}`,
  );
  return data;
}

/**
 * Updates an existing daily entry within a specified period.
 *
 * Use this when modifying an entry that already exists, and you know which period
 * it belongs to.
 *
 * @param payload {DailyLogRequest} - The daily log data to update
 * @param periodId {string} - Optional id of the period this entry belongs to
 * @returns A promise that resolves to the updated entry data
 */
export async function updateDailyEntry(
  payload: DailyLogRequest,
  periodId?: string,
) {
  const { data } = await api.put(`/api/periods/${periodId}/entries`, payload);
  return data;
}

/**
 * Creates a new daily entry.
 *
 * Use this when logging cycle data for the first time on a given date. The
 * backend automatically associates this entry with its appropriate period.
 *
 * @param payload {DailyLogRequest} - The daily log data to create
 * @returns A promise that resolves to the newly created entry data.
 */
export async function createDailyEntry(payload: DailyLogRequest) {
  const { data } = await api.post("/api/periods/entries", payload);
  return data;
}

export async function requestPasswordReset(
  payload: PasswordResetRequestPayload,
) {
  const { data } = await api.post("/api/auth/password-reset-request", payload);
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await api.post("/api/auth/password-reset", payload);
  return data;
}

/**
 * Deletes the authenticated user's account.
 *
 * This permanently removes the user and all associated data from the system.
 * Requires the user to be authenticated via the Authorization header.
 *
 * @returns A promise that resolves when the deletion is successful (204) or rejects if user not found (404)
 */
export async function deleteCurrentUser(): Promise<void> {
  await api.delete("/api/users/me");
}

export async function submitQuestionnaire(payload: QuestionnairePayload) {
  const { data } = await api.post<QuestionnaireResponse>(
    "/api/questionnaire",
    payload,
  );
  return data;
}

/**
 * Marks the user's first questionnaire as completed.
 */
export async function markFirstQuestionnaireComplete(): Promise<{
  success: boolean;
}> {
  const authData = await getAuthData();
  if (!authData.userId) throw new Error("User not authenticated");

  // Use the 'api' instance which likely handles the Base URL automatically
  const { data } = await api.post("/first-questionnaire/complete", {
    userId: authData.userId,
  });

  return data;
}

/**
 * Checks if the user is allowed to access the Cycle Questionnaire.
 */
export async function checkCycleQuestionnaireAccess(): Promise<{
  allowed: boolean;
}> {
  const authData = await getAuthData();
  if (!authData.userId) throw new Error("User not authenticated");

  try {
    const { data } = await api.get("/cycle-questionnaire/access", {
      params: { userId: authData.userId },
    });
    return data;
  } catch (error) {
    console.warn("Error in checkCycleQuestionnaireAccess:", error);

    if (axios.isAxiosError(error) && !error.response) {
      console.warn("Backend not reachable, returning mock allowed=true");
      return { allowed: true };
    }
    throw error;
  }
}

/**
 * Sends a PDF health report to the specified clinician's email.
 * @param token - User's auth token
 * @param payload - Report request containing email, report type, and optional graph/insights
 * @returns Success message from the server
 */
export async function shareReport(
  token: string,
  payload: ReportRequest,
): Promise<string> {
  const { data } = await api.post<string>("/api/reports/share", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
