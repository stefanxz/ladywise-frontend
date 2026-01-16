import { isEmailValid, isPasswordValid } from "@/lib/validation";

describe("Validation Helpers", () => {
  describe("isEmailValid", () => {
    it("returns true for standard valid emails", () => {
      expect(isEmailValid("test@example.com")).toBe(true);
      expect(isEmailValid("user.name@domain.co.uk")).toBe(true);
      expect(isEmailValid("user+tag@domain.com")).toBe(true);
    });

    it("returns false for invalid emails", () => {
      expect(isEmailValid("missingat.com")).toBe(false); // No @
      expect(isEmailValid("user@missingdot")).toBe(false); // No domain dot
      expect(isEmailValid("@domain.com")).toBe(false); // No local part
      expect(isEmailValid("user@.com")).toBe(false); // Dot immediately after @
      expect(isEmailValid("   ")).toBe(false); // Empty/Whitespace
    });

    it("handles whitespace trimming", () => {
      expect(isEmailValid("  test@example.com  ")).toBe(true);
    });
  });

  describe("isPasswordValid", () => {
    it("returns true for strong passwords", () => {
      // 8+ chars, 1 upper, 1 lower, 1 number
      expect(isPasswordValid("Password123")).toBe(true);
      expect(isPasswordValid("StrongP@ssw0rd")).toBe(true);
    });

    it("returns false if password is too short", () => {
      expect(isPasswordValid("Pass1")).toBe(false); // < 8 chars
    });

    it("returns false if missing uppercase", () => {
      expect(isPasswordValid("password123")).toBe(false);
    });

    it("returns false if missing lowercase", () => {
      expect(isPasswordValid("PASSWORD123")).toBe(false);
    });

    it("returns false if missing number", () => {
      expect(isPasswordValid("PasswordABC")).toBe(false);
    });

    it("returns false if it contains whitespace", () => {
      expect(isPasswordValid("Password 123")).toBe(false);
    });
  });
});
