// This interface can be used by all text input fields in the project, including Email and Password
export interface ThemedTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;

  /** Tailwind classes applied directly to the TextInput */
  className?: string;
}
