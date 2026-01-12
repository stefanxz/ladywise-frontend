import React from "react";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";

export interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string | null;
  inputProps?: Partial<React.ComponentProps<typeof ThemedTextInput>>;
  testID?: string;
}
