import React from "react";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";

/**
 * Properties for the EmailField component.
 */
export interface EmailFieldProps {
  /** The label text displayed above the input field. */
  label: string;
  /** The current email value. */
  value: string;
  /** Callback function called when the text changes. */
  onChangeText: (t: string) => void;
  /** Placeholder text displayed when the input is empty. */
  placeholder?: string;
  /** Error message to display below the input field. If present, the input border will turn red. */
  error?: string | null;
  /** Additional properties to pass down to the underlying ThemedTextInput. */
  inputProps?: Partial<React.ComponentProps<typeof ThemedTextInput>>;
  /** Used to locate this view in end-to-end tests. */
  testID?: string;
}
