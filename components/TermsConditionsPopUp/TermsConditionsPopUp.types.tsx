export interface TermsConditionsPopUpRef {
  open: () => void;
  close: () => void;
}

export interface TermsConditionsPopUpProps {
  onAccept?: () => void;
  mode?: "display" | "accept"; // Accept - register page; Display - settings page
}
