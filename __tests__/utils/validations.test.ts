import { isPasswordValid, isEmailValid } from "@/utils/validations";

describe("Validation Utils", () => {
  describe("isPasswordValid", () => {
    it("returns true for strong passwords", () => {
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

  describe("isEmailValid", () => {
    it("returns true for valid emails", () => {
      expect(isEmailValid("test@example.com")).toBe(true);
      expect(isEmailValid("user.name@domain.co.uk")).toBe(true);
    });

    it("returns false for invalid emails", () => {
      expect(isEmailValid("plainaddress")).toBe(false); // missing @
      expect(isEmailValid("user@domain")).toBe(false); // missing .domain
      expect(isEmailValid("@example.com")).toBe(false); // missing username
      expect(isEmailValid("user@.com")).toBe(false); // dot right after @
      expect(isEmailValid("user@domain.")).toBe(false); // dot at end
    });
  });
});