export interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string | null;
  testID?: string;
}
