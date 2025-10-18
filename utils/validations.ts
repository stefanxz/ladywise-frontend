// At least 8 chars, 1 upper, 1 lower, 1 number, no spaces
const PASSWORD_FORMAT = /^(?=\S{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;

//At least one character before and after the @ and one . after the email service
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//Check if input is an integer
const INTEGER_FORMAT= /^\d+$/;

//Check if input is an decimal
const DECIMAL_FORMAT= /^\d+(\.\d+)?$/;

export function isPasswordValid(password: string): boolean {
  return PASSWORD_FORMAT.test(password);
}

export function isEmailValid(email: string): boolean {
  return EMAIL_FORMAT.test(email);
}

export function isInputInteger(input: string): boolean {
  return INTEGER_FORMAT.test(input);
}

export function isInputDecimal(input: string): boolean {
  return DECIMAL_FORMAT.test(input);
}