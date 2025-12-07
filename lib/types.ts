export type RegisterPayload = {
  email: string;
  password: string;
  consentGiven: boolean;
  consentVersion: string;
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
  anemiaSymptoms: string[]; // e.g. ["TIRED", "Family history of anemia"]
  thrombosisSymptoms: string[]; // e.g. ["SWELLING"]
  flowLevel: string | null; // e.g. "flow_heavy" or null
  riskFactors: string[]; // e.g. ["ESTROGEN_PILL"]
}

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  changedAt: string; // ISO timestamp
};
