export interface RiskData {
  id: string;
  title: string;
  level: 'Low' | 'Medium' | 'High';
  description: string;
}