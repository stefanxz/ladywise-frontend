import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "auth_user_id";
const EMAIL_KEY = "auth_email";

// Minimal shape we persist for auth-related reads.
export type StoredAuthData = {
  token: string | null;
  userId: string | null;
  email: string | null;
};

export type AuthStatus = "VALID" | "EXPIRED" | "NO_TOKEN";

// Cache the availability check so we do not call into native modules repeatedly.
let secureStoreAvailability: boolean | null = null;

async function isSecureStoreAvailable(): Promise<boolean> {
  if (secureStoreAvailability !== null) return secureStoreAvailability;
  if (Platform.OS === "web") {
    secureStoreAvailability = false;
    return false;
  }
  try {
    secureStoreAvailability = await SecureStore.isAvailableAsync();
  } catch {
    secureStoreAvailability = false;
  }
  return secureStoreAvailability;
}

async function persistSet(key: string, value: string, useSecureStore: boolean) {
  // On web we fall back to AsyncStorage; on native we prefer the secure store.
  if (useSecureStore) {
    await SecureStore.setItemAsync(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
}

async function persistGet(key: string, useSecureStore: boolean) {
  return useSecureStore
    ? SecureStore.getItemAsync(key)
    : AsyncStorage.getItem(key);
}

async function persistRemove(key: string, useSecureStore: boolean) {
  if (useSecureStore) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
}

export async function storeAuthData(token: string, userId: string, email: string) {
  const useSecureStore = await isSecureStoreAvailable();
  await Promise.all([
    persistSet(TOKEN_KEY, token, useSecureStore),
    persistSet(USER_ID_KEY, userId, useSecureStore),
    persistSet(EMAIL_KEY, email, useSecureStore),
  ]);
}

export async function getAuthData(): Promise<StoredAuthData> {
  const useSecureStore = await isSecureStoreAvailable();
  const [token, userId, email] = await Promise.all([
    persistGet(TOKEN_KEY, useSecureStore),
    persistGet(USER_ID_KEY, useSecureStore),
    persistGet(EMAIL_KEY, useSecureStore),
  ]);

  return { token, userId, email };
}

export async function clearAuthData(): Promise<void> {
  const useSecureStore = await isSecureStoreAvailable();
  await Promise.all([
    persistRemove(TOKEN_KEY, useSecureStore),
    persistRemove(USER_ID_KEY, useSecureStore),
    persistRemove(EMAIL_KEY, useSecureStore),
  ]);
}

export function isTokenValid(authData: { token: string | null } | null): AuthStatus {
  if (!authData?.token) {
    return "NO_TOKEN";
  }

  // We only track expiry; signature verification is delegated to the backend.
  try {
    const payload = decodeJwtPayload(authData.token);
    if (!payload?.exp) {
      return "EXPIRED";
    }
    return payload.exp * 1000 > Date.now() ? "VALID" : "EXPIRED";
  } catch {
    return "EXPIRED";
  }
}

type JwtPayload = { exp?: number };

function decodeJwtPayload(token: string): JwtPayload {
  const parts = token.split(".");
  if (parts.length < 2) {
    throw new Error("Invalid token structure");
  }
  const base64Payload = normalizeBase64(parts[1]);
  let decoded: string;
  if (typeof globalThis.atob === "function") {
    decoded = globalThis.atob(base64Payload);
  } else if (typeof Buffer !== "undefined") {
    decoded = Buffer.from(base64Payload, "base64").toString("utf8");
  } else {
    throw new Error("Base64 decoder not available");
  }
  return JSON.parse(decoded);
}

function normalizeBase64(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const paddingNeeded = (4 - (normalized.length % 4)) % 4;
  return normalized.padEnd(normalized.length + paddingNeeded, "=");
}
