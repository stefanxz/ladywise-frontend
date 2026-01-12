import { TextInputProps } from "react-native";

// This interface can be used by all text input fields in the project, including Email and Password
export interface ThemedTextInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  placeholderTextColor?: string;
  testID?: string;

  // /** Tailwind classes applied directly to the ThemedTextInput */
  className?: string;

  onBlur?: () => void;
}
