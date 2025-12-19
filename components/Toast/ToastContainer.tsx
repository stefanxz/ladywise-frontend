import React from "react";
import { View } from "react-native";
import { useToast } from "@/hooks/useToast";
import { ToastItem } from "./ToastItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Container that renders all active toasts in a fixed position.
 * Should be placed once at the root level (typically in _layout.tsx).
 *
 * Toasts are stacked vertically and positioned at the top of the screen.
 * Uses pointerEvents="box-none" to allow touches to pass through empty areas.
 */
export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ top: insets.top + 12 }}
      className="absolute right-4 z-50"
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};
