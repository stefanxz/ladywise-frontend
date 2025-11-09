import axios from "axios";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "./types";
import { RiskData } from "./types/health";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

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
type UserPayload = { authToken: string, userId: string}


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
// get the risk indicators data

 export async function getRiskData(payload: UserPayload): Promise<RiskData> {
  const config = {
    params: { userId: payload.userId },
    headers: { Authorization: `Bearer ${payload.authToken}` },
  };
  const { data } = await api.get<RiskData>("/api/getRiskData", config);
  return data;
 }