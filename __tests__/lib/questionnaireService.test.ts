import * as auth from "@/lib/auth";
import { markFirstQuestionnaireComplete } from "@/lib/questionnaireService";
import axios from "axios";

jest.mock("axios");
jest.mock("@/lib/auth");

describe("questionnaireService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls completion endpoint with authenticated user", async () => {
    (auth.getAuthData as jest.Mock).mockResolvedValue({ userId: "user123" });
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    const result = await markFirstQuestionnaireComplete();
    expect(result).toEqual({ success: true });
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/first-questionnaire/complete"),
      { userId: "user123" }
    );
  });

  it("throws when no auth data is found", async () => {
    (auth.getAuthData as jest.Mock).mockResolvedValue(null);
    await expect(markFirstQuestionnaireComplete()).rejects.toThrow("User not authenticated");
  });
});
