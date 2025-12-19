import React from "react";
import { View } from "react-native";
import { useToast } from "@/hooks/useToast";
import { ToastItem } from "./ToastItem";

/**
 * Container that renders all active toasts in a fixed position.
 * Should be placed once at the root level (typically in _layout.tsx).
 *
 * Toasts are stacked vertically and positioned at the top of the screen.
 * Uses pointerEvents="box-none" to allow touches to pass through empty areas.
 */
export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <View
      className="absolute top-12 left-0 right-0 items-center z-50 px-4"
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};
