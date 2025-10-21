import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "Request failed.";
    return Promise.reject(new Error(message));
  }
);

type RegisterPayload = { email: string; name: string; password: string };
type RegisterResponse = { id: string; email: string };
type LoginPayload = { email: string; password: string };
type LoginResponse = { token: string };

// register new user by sending their credentials to the backend API
// uses the base URL from .env + '/api/auth/register'
export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<RegisterResponse>("/api/auth/register", payload);
  return data;
}

// log in a user by sending their credentials to the backend API
// uses the base URL from .env + '/api/auth/login'
export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
  return data;
}
