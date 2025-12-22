import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "@/hooks/useToast";
import { ToastItem } from "./ToastItem";

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
