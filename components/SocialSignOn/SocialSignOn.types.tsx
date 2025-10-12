export type Provider = "google" | "facebook" | "apple";

export interface SocialSignOnProps {
  onPress: (provider: Provider) => void;
}
