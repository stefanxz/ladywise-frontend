import axios from "axios";
import {
  ChangePasswordPayload,
  ChangePasswordResponse,
  HealthDocument,
  LoginPayload,
  LoginResponse,
  PasswordResetRequestPayload,
  QuestionnairePayload,
  QuestionnaireResponse,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateHealthRequest,
  UserPayload,
  UserResponse,
} from "./types/payloads";
import { ReportRequest } from "./types/reports";
import { CycleStatusDTO } from "./types/cycle";
import { getAuthData } from "./auth";
import { ApiRiskResponse, RiskHistoryPoint } from "./types/risks";
import {
  PeriodLogResponse,
  PredictedPeriodDTO,
  PeriodLogRequest,
  DailyLogRequest,
  DailyLogResponse,
} from "./types/period";

/**
 * api
 *
 * Global Axios instance with base configuration.
 * Sets the base URL from environment variables and default timeout.
 */
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Updates the Authorization header for the API instance.
 *
 * @param {string | null} token - The JWT token to set, or null to remove it
 */
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

/**
 * Registers a new user.
 *
 * @param {RegisterPayload} payload - Registration details (email, password, consent)
 * @returns {Promise<LoginResponse>} The response containing the new user's tokens
 */
export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<LoginResponse>("/api/auth/register", payload);
  return data;
}

/**
 * Authenticates an existing user.
 *
 * @param {LoginPayload} payload - Login credentials
 * @returns {Promise<LoginResponse>} The response containing auth tokens
 */
export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
  return data;
}

/**
 * Updates user profile information.
 *
 * @param {UserPayload} payload - The updated user details
 * @returns {Promise<UserResponse>} The updated user profile
 */
export async function updateUser(payload: UserPayload) {
  const { data } = await api.patch<UserResponse>(
    "/api/users/updateUser",
    payload,
  );
  return data;
}

/**
 * Retrieves the User Health data from the backend.
 */
export async function getUserHealth(): Promise<HealthDocument> {
  const { data } = await api.get<HealthDocument>("/api/health");
  return data;
}

/**
 * Updates health document for the authenticated user.
 */
export async function updateHealthDocument(payload: UpdateHealthRequest) {
  const { data } = await api.patch<HealthDocument>("/api/health", payload);
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

/**
 * Fetches a user's detailed profile by ID.
 *
 * @param {string} token - Auth token
 * @param {string} userId - ID of the user to fetch
 * @returns {Promise<UserResponse>} The user profile data
 */
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

/**
 * Retrieves the current risk analysis for a user.
 *
 * @param {string} token - Auth token
 * @param {string} userId - User ID
 * @returns {Promise<ApiRiskResponse>} The latest risk data and insights
 */
export async function getRiskData(
  token: string,
  userId: string,
): Promise<ApiRiskResponse> {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Ensure the path matches your Spring Boot controller exactly
  const { data } = await api.get<ApiRiskResponse>(
    `/api/users/${userId}/risks`,
    config,
  );

  return data;
}

/**
 * Retrieves historical risk data for charting.
 *
 * @param {string} token - Auth token
 * @param {string} userId - User ID
 * @returns {Promise<RiskHistoryPoint[]>} Array of historical risk data points
 */
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

/**
 * Fetches the user's current menstrual cycle status.
 * includes phase, day count, and predictions.
 *
 * @returns {Promise<CycleStatusDTO>} Cycle status details
 */
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

/**
 * Initiates the password reset process by sending a reset link to the user's email.
 *
 * @param {PasswordResetRequestPayload} payload - Object containing the email
 * @returns {Promise<any>} Response data
 */
export async function requestPasswordReset(
  payload: PasswordResetRequestPayload,
) {
  const { data } = await api.post("/api/auth/password-reset-request", payload);
  return data;
}

/**
 * Completes the password reset process using the token from the email.
 *
 * @param {ResetPasswordPayload} payload - Object containing token and new password
 * @returns {Promise<any>} Response data
 */
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

/**
 * Submits the initial health questionnaire responses.
 *
 * @param {QuestionnairePayload} payload - The questionnaire data
 * @returns {Promise<QuestionnaireResponse>} The created questionnaire record
 */
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

export async function getPeriodHistory() {
  const { data } = await api.get<PeriodLogResponse[]>("/api/cycle/history");
  return data;
}

export async function getPredictions(cycles: number = 6) {
  const { data } = await api.get<PredictedPeriodDTO[]>(
    "/api/cycle/predictions",
    {
      params: { cycles },
    },
  );
  console.log("Predictions are: " + JSON.stringify(data));

  return data;
}

export async function logNewPeriod(payload: PeriodLogRequest) {
  const { data } = await api.post<PeriodLogResponse>("/api/periods", payload);
  return data;
}

// Update an existing period
export async function updatePeriod(
  periodId: string,
  payload: PeriodLogRequest,
) {
  const { data } = await api.put<PeriodLogResponse>(
    `/api/periods/${periodId}`,
    payload,
  );
  return data;
}

// Delete a period
export async function deletePeriod(periodId: string) {
  const { data } = await api.delete(`/api/periods/${periodId}`);
  return data;
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
