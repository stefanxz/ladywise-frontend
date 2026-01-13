import React, { useCallback, useEffect, useRef } from "react";
import { Text, Pressable, Animated, View } from "react-native";
import { useToast } from "@/hooks/useToast";
import type { Toast } from "@/context/ToastContext";
import { Colors, riskColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

/**
 * Properties for the ToastItem component.
 */
type ToastItemProps = {
  /** The toast object containing message, type, and duration. */
  toast: Toast;
};

/**
 * Customizable toast item component.
 *
 * @param toast {ToastItemProps} - The toast object
 */
export const ToastItem: React.FC<ToastItemProps> = ({
  toast,
}: ToastItemProps) => {
  const { hideToast } = useToast();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  // Configuration based on type
  const config = {
    success: {
      icon: "checkmark-circle" as const,
      color: riskColors[0],
      bg: Colors.lightGreen,
    },
    error: {
      icon: "alert-circle" as const,
      color: riskColors[2],
      bg: Colors.lightRed,
    },
    info: {
      icon: "information-circle" as const,
      color: Colors.brand,
      bg: Colors.lightBrand,
    },
  }[toast.type || "info"];

  /**
   * Executes exit animations and invokes context cleanup function.
   */
  const handleDismiss = useCallback(() => {
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
  }, [hideToast, opacity, toast.id, translateY]);

  useEffect(() => {
    // Animate In
    Animated.parallel([
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
    ]).start();

    // Auto-dismiss
    const displayDuration = toast.duration || 3000;
    const timer = setTimeout(() => {
      handleDismiss();
    }, displayDuration);

    return () => clearTimeout(timer);
  }, [handleDismiss, opacity, toast.duration, translateY]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      }}
      className="mb-2 mx-4"
    >
      <Pressable
        onPress={handleDismiss}
        style={{
          backgroundColor: config.bg,
          borderLeftWidth: 4,
          borderLeftColor: config.color,
        }}
        className="flex-row items-center rounded-xl py-3.5 px-4"
      >
        <Ionicons name={config.icon} size={22} color={config.color} />

        <View className="ml-3 flex-1">
          <Text
            className="text-[15px] font-medium leading-5"
            style={{ color: Colors.regularText }}
            numberOfLines={2}
          >
            {toast.message}
          </Text>
        </View>

        <Ionicons name="close" size={18} color="#9CA3AF" />
      </Pressable>
    </Animated.View>
  );
};
