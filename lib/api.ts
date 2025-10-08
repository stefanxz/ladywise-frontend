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

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<RegisterResponse>("/api/users", payload);
  return data;
}
