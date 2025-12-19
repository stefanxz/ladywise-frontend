import React, { useEffect, useRef } from "react";
import { Text, Pressable, Animated } from "react-native";
import { useToast } from "@/hooks/useToast";
import type { Toast } from "@/context/ToastContext";

type ToastItemProps = {
  toast: Toast;
};

/**
 * Renders a single toast notification with animations.
 * Automatically animates in on mount and can be dismissed by tapping.
 */
export const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { hideToast } = useToast();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  // Animate in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /**
   * Handle manual dismissal of toast
   * Animates out before removing from state
   */
  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => hideToast(toast.id));
  };

  // Determine background color based on toast type
  const toastStyles =
    toast.type === "success"
      ? "bg-green-500"
      : toast.type === "error"
        ? "bg-red-500"
        : "bg-blue-500";

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className={`rounded-xl py-3 px-4 mb-2 min-w-[250px] max-w-[90%] shadow-lg ${toastStyles}`}
    >
      <Pressable onPress={handleDismiss} className="w-full">
        <Text className="text-white text-sm font-semibold text-center">
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
