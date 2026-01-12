/**
 * Props for the ThemedTextInput component.
 * Extends standard React Native TextInputProps.
 */
export interface ThemedTextInputProps {
  /** The current value of the text input. */
  value: string;
  /** Callback function called when the text input's text changes. */
  onChangeText: (text: string) => void;
  /** The string that will be rendered before text input has been entered. */
  placeholder?: string;
  /** If true, the text input obscures the text entered so that sensitive text like passwords stay secure. */
  secureTextEntry?: boolean;
  /** If true, the user will not be able to edit the text input. Visual style will indicate the disabled state. */
  disabled?: boolean;
  /** The text color of the placeholder string. */
  placeholderTextColor?: string;
  /** Used to locate this view in end-to-end tests. */
  testID?: string;
  /** Additional Tailwind utility classes to apply to the input container. */
  className?: string;
  /** Callback that is called when the text input is blurred. */
  onBlur?: () => void;
}
