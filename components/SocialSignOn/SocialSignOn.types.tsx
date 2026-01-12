/**
 * Supported social login providers.
 */
export type Provider = "google" | "facebook" | "apple";

/**
 * Properties for the SocialSignOn component.
 */
export interface SocialSignOnProps {
  /** Callback function when a provider button is pressed. */
  onPress: (provider: Provider) => void;
}
