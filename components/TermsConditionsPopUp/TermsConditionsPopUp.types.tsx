export interface TermsConditionsPopUpRef {
  open: () => void;
  close: () => void;
}

export interface TermsConditionsPopUpProps {
  onAccept?: () => void;
}
