import { useContext } from "react";
import { ToastContext } from "@/context/ToastContext";

/**
 * Provides access to toast functionality from any component.
 * Must be used within a ToastProvider.
 *
 * @example
 * ```tsx
 * const { showToast } = useToast();
 *
 * // Show success toast
 * showToast('Operation completed!', 'success');
 *
 * // Show error toast with custom duration
 * showToast('Something went wrong', 'error', 5000);
 * ```
 *
 * @throws Error if used outside ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
