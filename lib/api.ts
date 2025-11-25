import axios from "axios";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  UserPayload,
  UserResponse,
} from "./types";
import { CycleStatusDTO } from "./types/cycle";
import { RiskData } from "./types/risks";
import { StoredAuthData } from "./auth";
import { ApiRiskResponse } from "./types/risks";
import { PeriodLogResponse, PredictedPeriodDTO, PeriodLogRequest } from "./types/period";

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
        error.response?.data?.message ??
        error.message ??
        "Request failed.";
      error.message = message;
    }
    return Promise.reject(error);
  }
);




// register new user by sending their credentials to the backend API
// uses the base URL from .env + '/api/auth/register'
export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<RegisterResponse>("/api/auth/register", payload);
  return data;
}

// authenticate an existing user and return their auth token
export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
  return data;
}

//update user data of an existing user
export async function updateUser(payload: UserPayload) {
  const { data } = await api.patch<UserResponse>("/api/users/updateUser", payload);
  return data;
}

export async function getRiskData(
  token: string,
  userId: string
): Promise<ApiRiskResponse> { // <-- Use the correct response type
  const config = {
    params: { userId },
    headers: { Authorization: `Bearer ${token}` },
  };
  // Use the correct generic type
  const { data } = await api.get<ApiRiskResponse>(
    `/api/users/${userId}/risks`,
    config
  );
  return data; // This returns: { thrombosisRisk: 1, anemiaRisk: 2 }
}

// Cycle and Periods
export async function getCycleStatus() {
  const { data } = await api.get<CycleStatusDTO>("/api/cycle/status");
  return data;
}

export async function getPeriodHistory() {
  const { data } = await api.get<PeriodLogResponse[]>("/api/cycle/history");
  return data;
}

export async function getPredictions(cycles: number = 6) {
  const { data } = await api.get<PredictedPeriodDTO[]>("/api/cycle/predictions", {
    params: { cycles },
  })
  console.log("Predictions are: " + JSON.stringify(data));

  return data;
}

export async function logNewPeriod(payload: PeriodLogRequest) {
  const { data } = await api.post<PeriodLogResponse>("/api/periods", payload);
  return data;
}