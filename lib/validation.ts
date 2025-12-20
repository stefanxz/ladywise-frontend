// /lib/validation.ts

/**
 * Email and password validation helpers shared across auth screens.
 */

/**
 * Validates whether the email format is correct.
 * Checks for characters before and after '@' and a domain dot.
 *
 * @param {string} email - The email address to validate
 * @returns {boolean} True if valid
 */
export function isEmailValid(email: string): boolean {
  const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_FORMAT.test(email.trim());
}

/**
 * Validates password strength requirements.
 * - At least 8 characters
 * - 1 uppercase letter
 * - 1 lowercase letter
 * - 1 number
 * - No whitespace
 *
 * @param {string} password - The password to validate
 * @returns {boolean} True if strong enough
 */
export function isPasswordValid(password: string): boolean {
  const PASSWORD_FORMAT = /^(?=\S{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;
  return PASSWORD_FORMAT.test(password);
}
