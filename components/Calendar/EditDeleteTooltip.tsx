import React from "react";
import { View, Text, Pressable, Dimensions, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { Sizes } from "@/constants/sizes";

// Constants for layout
const VERTICAL_SPACING =
  Platform.OS === "ios" ? Sizes.tooltipIosPadding : Sizes.tooltipAndroidPadding; // Space between day and arrow tip
const SCREEN_WIDTH = Dimensions.get("window").width;

/**
 * Properties for the PeriodActionTooltip component.
 */
type PeriodActionTooltipProps = {
  /** Whether the tooltip is currently visible. */
  visible: boolean;
  /** The absolute coordinates (x, y) where the tooltip should appear. */
  position: { x: number; y: number } | null;
  /** Callback when "Period" edit option is selected. */
  onEditPeriod: () => void;
  /** Callback when "Entry" edit option is selected. */
  onEditCycleQuestionnaire: () => void;
  /** Callback when "Delete" option is selected. */
  onDelete: () => void;
  /** Callback to close the tooltip. */
  onClose: () => void;
};

export default function PeriodActionTooltip({
  visible,
  position,
  onEditPeriod,
  onEditCycleQuestionnaire,
  onDelete,
  onClose,
}: PeriodActionTooltipProps) {
  if (!visible || !position) return null;

  // Calculate top position: above the day, accounting for arrow and spacing
  const top =
    position.y -
    Sizes.tooltipHeight -
    Sizes.tooltipArrowSize -
    VERTICAL_SPACING;

  // We center the tooltip horizontally relative to the day (x - width/2)
  let left = position.x - Sizes.tooltipWidth / 2;

  // Clamp left: don't let it go past the left padding
  if (left < Sizes.tooltipScreenPadding) {
    left = Sizes.tooltipScreenPadding;
  }

  // Clamp right: don't let it go past the right padding
  if (left + Sizes.tooltipWidth > SCREEN_WIDTH - Sizes.tooltipScreenPadding) {
    left = SCREEN_WIDTH - Sizes.tooltipWidth - Sizes.tooltipScreenPadding;
  }

  // Calculate arrow offset
  // The box might have shifted, but the arrow must still point to 'position.x'
  const boxCenter = left + Sizes.tooltipWidth / 2;
  const arrowOffset = position.x - boxCenter;

  return (
    <View
      className="absolute items-center z-50"
      style={{ top, left, width: Sizes.tooltipWidth }}
      pointerEvents="box-none" // Ensures the invisible container doesn't block touches
    >
      <View className="bg-stone-800 rounded-xl shadow-xl flex-row items-center overflow-hidden py-1 px-1">
        {/* Edit period option */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onEditPeriod();
          }}
          className="flex-1 flex-row items-center justify-center py-3 active:bg-stone-700 rounded-lg"
        >
          <Feather
            name="edit-2"
            size={16}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text className="text-white text-sm font-bold">Period</Text>
        </Pressable>

        {/* Divider 1 */}
        <View className="w-[1px] h-6 bg-stone-600 mx-1" />

        {/* Edit daily cycle questionnaire option */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onEditCycleQuestionnaire();
          }}
          className="flex-1 flex-row items-center justify-center py-3 active:bg-stone-700 rounded-lg"
        >
          <Feather
            name="clipboard"
            size={16}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text className="text-white text-sm font-bold">Entry</Text>
        </Pressable>

        {/* Divider 2*/}
        <View className="w-[1px] h-6 bg-stone-600 mx-1" />

        {/* Delete option */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex-1 flex-row items-center justify-center py-3 active:bg-stone-700 rounded-lg"
        >
          <Feather
            name="trash-2"
            size={16}
            color="#EF4444"
            style={{ marginRight: 6 }}
          />
          <Text className="text-red-400 text-sm font-bold">Del</Text>
        </Pressable>
      </View>

      {/* Arrow pointing down */}
      {/* We apply translateX to shift the arrow towards the actual click position */}
      <View
        style={{
          transform: [{ translateX: arrowOffset }],
          width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderStyle: "solid",
          borderLeftWidth: Sizes.tooltipArrowSize,
          borderRightWidth: Sizes.tooltipArrowSize,
          borderTopWidth: Sizes.tooltipArrowSize,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: Colors.tooltipColor,
          marginTop: -1, // Slight overlap with the tooltip to prevent 1px cracks
        }}
      />
    </View>
  );
}
