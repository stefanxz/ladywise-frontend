import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "@/hooks/useToast";
import { ToastItem } from "./ToastItem";

/**
 * Toast Container Component
 *
 * Serves as the fixed overlay wrapper for all active toast notifications.
 * It positions itself safely within the screen boundaries (respecting safe area insets)
 * and stacks the active toasts vertically.
 *
 * This component should typically be placed near the root of the application tree
 * to ensure toasts appear above other content.
 */
export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ top: insets.top + 8 }}
      className="absolute left-0 right-0 z-50"
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};
