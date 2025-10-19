
type RegistrationRequest = { email: string; password: string };
type RegistrationResponse = {
  userId?: string;
  message?: string;
  token?: string;
  [k: string]: unknown;
};

import { resolveApiBaseUrl } from "@/utils/api_base";

const API_BASE_URL = resolveApiBaseUrl(8080);

/**
 * Registers a user against the backend.
 * Sends JSON body: { email, password } to POST /api/auth/register
 * Throws an Error with a readable message if the HTTP response isn't OK.
 */
export async function registerUser(
  { email, password }: RegistrationRequest
): Promise<RegistrationResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10s

  const url = `${API_BASE_URL}/api/auth/register`;
  console.log("POST", url, { email });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    console.log("HTTP", res.status, text);

    const data = text ? safeJsonParse(text) : null;

    if (!res.ok) {
      // Map a few common backend statuses to friendly messages
      const backendMsg =
        (data as any)?.message ||
        (data as any)?.error ||
        (data as any)?.errors?.[0]?.message;

      let friendly = backendMsg ?? "Registration failed.";
      if (res.status === 400) friendly = backendMsg ?? "Invalid input.";
      if (res.status === 401)
        friendly =
          backendMsg ??
          "Unauthorized. Check dev security config or credentials.";
      if (res.status === 409) friendly = backendMsg ?? "Email already exists.";
      if (res.status >= 500)
        friendly = backendMsg ?? "Server error. Please try again.";

      //throw new Error(`${friendly} (HTTP ${res.status})`);
      throw new Error(`${friendly}`); //No need to show the HTTP return code to the user, which is technical in nature, not business related
    }

    return (data as RegistrationResponse) ?? {};
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error(
        `Network timeout. Is the backend running at ${API_BASE_URL}?`
      );
    }
    // Surface a clear error up to the screen
    throw new Error(err?.message ?? "Registration failed.");
  } finally {
    clearTimeout(timeoutId);
  }
}

function safeJsonParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
