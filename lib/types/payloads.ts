import { InsightResult } from "./risks";

/**
 * Payload for user registration.
 */
export type RegisterPayload = {
  email: string;
  password: string;
  consentGiven: boolean;
  consentVersion: string;
};

/**
 * Payload for user login.
 */
export type LoginPayload = { email: string; password: string };

/**
 * Response received upon successful authentication.
 */
export type LoginResponse = {
  token: string;
  tokenType: "Bearer";
  userId: string;
  email: string;
};

/**
 * Payload for updating basic user details.
 */
export type UserPayload = {
  id: string | null;
  email: string | null;
  firstName: string;
  lastName: string;
};

/**
 * Comprehensive user profile response.
 * Includes attributes, current risks, and latest insights.
 */
export type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  attributes: Record<string, any>;

  // Risk Data
  thrombosisRisk: number;
  anemiaRisk: number;

  // Insight Data
  latestAnemiaInsight: InsightResult | null;
  latestThrombosisInsight: InsightResult | null;

  // Status Flags
  firstQuestionnaireCompleted: boolean;
  consentGiven: boolean;
};

export interface PasswordResetRequestPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export type QuestionnairePayload = {
  health: {
    personalDetails: {
      age: number;
      weight: number;
      height: number;
    };
    familyHistory: {
      familyHistoryAnemia?: boolean;
      familyHistoryThrombosis?: boolean;
      anemiaConditions?: string[];
      thrombosisConditions?: string[];
    };
    estrogenPill?: boolean;
    biosensorCup?: boolean;
  };
  history?: [];
};

export type QuestionnaireResponse = {
  id: string;
  userId: string;
  createdAt?: string;
};

/**
 * Response from GET /api/symptoms/risk
 * Matches backend DTO: nl.tue.ladywise_backend.symptom.dto.RiskSymptomsDto
 */
export interface RiskSymptomsResponse {
  anemiaSymptoms: string[];
  thrombosisSymptoms: string[];
  flowLevel: string | null;
  riskFactors: string[];
}

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  changedAt: string; // ISO timestamp
};
