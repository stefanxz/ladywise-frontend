export interface UnitInputFieldProps {
  label: string;
  unit: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string | null;
  testID?: string;
}
