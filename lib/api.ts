import axios from "axios";
import { getAuthData } from "./auth";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "./types";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  async (config) => {
    const authData = await getAuthData();
    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      // Handle plain text 401 error from login
      if (
        error.response.status === 401 &&
        typeof error.response.data === "string" &&
        error.response.data
      ) {
        return Promise.reject(new Error(error.response.data));
      }
      // Handle other JSON errors with a message property
      if (
        error.response.data &&
        typeof error.response.data.message === "string"
      ) {
        return Promise.reject(new Error(error.response.data.message));
      }
    }
    // Fallback for other errors
    if (error instanceof Error) {
      return Promise.reject(error);
    }
    return Promise.reject(new Error("An unexpected error occurred."));
  }
);


// register new user by sending their credentials to the backend API
// uses the base URL from .env + '/api/auth/register'
export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<RegisterResponse>("/api/auth/register", payload);
  return data;
}

// log in a user by sending their credentials to the backend API
// uses the base URL from .env + '/api/auth/login'
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
  return data;
}
