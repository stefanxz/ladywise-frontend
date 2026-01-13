/**
 * Handle interface for controlling the TermsConditionsPopUp via ref.
 */
export interface TermsConditionsPopUpRef {
  /** Opens the bottom sheet modal. */
  open: () => void;
  /** Closes the bottom sheet modal. */
  close: () => void;
}

/**
 * Properties for the TermsConditionsPopUp component.
 */
export interface TermsConditionsPopUpProps {
  /** Callback function executed when the user accepts the terms. Only applicable in "accept" mode. */
  onAccept?: () => void;
  /**
   * The display mode of the popup.
   * - "accept": Shows "Cancel" and "Accept" buttons (Authentication flow).
   * - "display": Shows only an "OK" button (Information flow).
   * @default "accept"
   */
  mode?: "display" | "accept";
}
