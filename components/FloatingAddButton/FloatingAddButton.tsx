import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FloatingAddButtonProps } from "@/components/FloatingAddButton/FloatingAddButton.types";
import React from "react";

/**
 * A circular floating action button with a centered plus (+) icon.
 *
 * This component renders a customizable button used for primary actions
 * like adding new items or triggering modals. For example, it is used
 * to trigger the "Daily Period Questionnaire" modal on the main page
 * of the application.
 *
 * @example
 * ```
 * <FloatingAddButton
 *  size={56}
 *  buttonColor={"#F9ACAC"}
 *  textColor={"#271411"}
 *  onPress={openModal}
 * />
 * ```
 * @param {FloatingAddButtonProps} props - Component props
 * @param {number} [props.size=56] - The diameter of the circular button in pixels
 * @param {string} [props.buttonColor="#3b82f6"] - Background color of the button (hex/rgb/named color)
 * @param {string} [props.textColor="#ffffff"] - Color of the plus icon (hex/rgb/named color)
 * @param {() => void} props.onPress - Callback function when button is pressed
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 */
export function FloatingAddButton({
  size = 56,
  buttonColor = "#3b82f6",
  textColor = "#ffffff",
  onPress,
  disabled = false,
}: FloatingAddButtonProps): React.ReactElement {
  return (
    <TouchableOpacity
      testID="floating-add-button"
      className="rounded-full shadow-md items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: buttonColor,
        opacity: disabled ? 0.5 : 1,
      }}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons name="add" size={size * 0.6} color={textColor} />
    </TouchableOpacity>
  );
}
