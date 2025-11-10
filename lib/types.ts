export type RegisterPayload = { email: string; name: string; password: string };
export type RegisterResponse = { id: string; email: string };
export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  token: string;
  tokenType: "Bearer";
  userId: string;
  email: string;
};
