export interface UnitInputFieldProps {
  unit: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string | null;
  testID?: string;
}
