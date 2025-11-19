/**
 * questionnaireService.ts
 * ------------------------
 * Provides API interactions for the first-time questionnaire flow.
 * Handles marking questionnaire completion and checking cycle questionnaire access.
 */

import axios from "axios";
import { getAuthData } from "./auth";



const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

  if (process.env.NODE_ENV === "development") {
  console.log("API base URL loaded from env:", API_BASE_URL);
}

/**
 * Marks the user's first questionnaire as completed.
 */
export async function markFirstQuestionnaireComplete(): Promise<{ success: boolean }> {
  const authData = await getAuthData();
  if (!authData.userId || !authData.token) throw new Error("User not authenticated");

  const response = await axios.post(`${API_BASE_URL}/first-questionnaire/complete`, {
    userId: authData.userId,
  });

  return response.data;
}

export async function checkCycleQuestionnaireAccess(): Promise<{ allowed: boolean }> {
  const authData = await getAuthData();
  if (!authData.userId || !authData.token) throw new Error("User not authenticated");

  try {
    const response = await axios.get(`${API_BASE_URL}/cycle-questionnaire/access`, {
      params: { userId: authData.userId },
    });
    return response.data;
  } catch (error) {
  // Log the error for visibility
    console.warn("Error in checkCycleQuestionnaireAccess:", error);
    // Only fallback for network errors (no response from backend)
    if (axios.isAxiosError(error) && !error.response) {
      console.warn("Backend not reachable, returning mock allowed=true");
      return { allowed: true };
    }
    // Rethrow other errors (e.g., authentication, programming errors)
    throw error;
  }
}


