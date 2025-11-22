export type RegisterPayload = {
  email: string;
  password: string;
  consentGiven: boolean;
  consentVersion: string;
  consentAt: string; // ISO string for Instant (e.g.; '2025-01-15T10:30:00.000Z')
};
export type RegisterResponse = { 
  token: string;
  userId: string;
  email: string; 
};
export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  token: string;
  tokenType: "Bearer";
  userId: string;
  email: string;
};
export type UserPayload = {
  id: string | null;
  email: string | null;
  firstName: string;
  lastName: string;
};
export type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};
