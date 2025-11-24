import axios from "axios";
import type {
  LoginPayload,
  LoginResponse,
  PasswordResetRequestPayload,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  UserPayload,
  UserResponse,
} from "./types";
import { CycleStatusDTO } from "./types/cycle";
import { RiskData, ApiRiskResponse, RiskHistoryPoint } from "./types/risks";
import { StoredAuthData } from "./auth";

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
  const { data } = await api.post<RegisterResponse>(
    "/api/auth/register",
    payload,
  );
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

export async function getRiskData(
  token: string,
  userId: string,
): Promise<ApiRiskResponse> {
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
