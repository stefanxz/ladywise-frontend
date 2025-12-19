import React, { createContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

/**
 * Toast notification object
 */
export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

/**
 * Context value shape for toasts
 */
type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

/**
 * Toast Context Provider
 *
 * Manages the toast state and provides methods to child components.
 *
 * @param children
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *    <Stack />
 *    <ToastContainer />
 * </ToastProvider>
 * ```
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Display a new toast notification
   *
   * @param message {string} - Text to display on the toast
   * @param type {ToastType} - Visual style (either success, error, or info)
   * @param duration {number} - Milliseconds before dismiss, by default set to 3000ms. For no
   *                            auto-dismiss, this value can be set to 0.
   */
  const showToast = useCallback(
    (message: string, type: ToastType, duration: number = 3000) => {
      const id = Math.random().toString(36).substring(7);
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [],
  );

  /**
   * Manually dismiss a toast by its ID.
   *
   * @param id {string} - The unique identifier of the toast to dismiss
   */
  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};
