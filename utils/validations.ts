// At least 8 chars, 1 upper, 1 lower, 1 number, no spaces
const PASSWORD_FORMAT = /^(?=\S{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;

//At least one character before and after the @ and one . after the email service
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  return PASSWORD_FORMAT.test(password);
}

/**
 * Validates whether the email format is correct.
 * Checks for characters before and after '@' and a domain dot.
 * 
 * @param {string} email - The email address to validate
 * @returns {boolean} True if valid
 */
export function isEmailValid(email: string): boolean {
  return EMAIL_FORMAT.test(email);
}
