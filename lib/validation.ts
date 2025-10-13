// /lib/validation.ts

/**
 * Email and password validation helpers shared across auth screens.
 */

// Email: at least one character before and after '@' and a '.' after the domain
export function isEmailValid(email: string): boolean {
  const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_FORMAT.test(email.trim());
}

// Password: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and no spaces
export function isPasswordValid(password: string): boolean {
  const PASSWORD_FORMAT = /^(?=\S{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;
  return PASSWORD_FORMAT.test(password);
}
