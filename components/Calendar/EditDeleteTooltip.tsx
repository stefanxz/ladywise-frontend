import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Constants for layout
const TOOLTIP_WIDTH = 230;
const TOOLTIP_HEIGHT = 44; // Approx height
const ARROW_SIZE = 6;
const VERTICAL_SPACING = 47; // Space between day and arrow tip
const SCREEN_PADDING = 10;
const SCREEN_WIDTH = Dimensions.get('window').width;
const TOOLTIP_COLOR = "#292524"; // Stone-800 Hex code for the arrow color to match the bg-stone-800 class

type PeriodActionTooltipProps = {
  visible: boolean;
  position: { x: number; y: number } | null;
  onEditPeriod: () => void;
  onEditCycleQuestionnaire: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function PeriodActionTooltip({ 
  visible, 
  position, 
  onEditPeriod,
  onEditCycleQuestionnaire, 
  onDelete, 
  onClose 
}: PeriodActionTooltipProps) {
  
  if (!visible || !position) return null;

  // Calculate top position: above the day, accounting for arrow and spacing
  const top = position.y - TOOLTIP_HEIGHT - ARROW_SIZE - VERTICAL_SPACING;

  // We center the tooltip horizontally relative to the day (x - width/2)
  let left = position.x - (TOOLTIP_WIDTH / 2);

  // Clamp left: don't let it go past the left padding
  if (left < SCREEN_PADDING) {
    left = SCREEN_PADDING;
  }

  // Clamp right: don't let it go past the right padding
  if (left + TOOLTIP_WIDTH > SCREEN_WIDTH - SCREEN_PADDING) {
    left = SCREEN_WIDTH - TOOLTIP_WIDTH - SCREEN_PADDING;
  }

  // Calculate arrow offset
  // The box might have shifted, but the arrow must still point to 'position.x'
  const boxCenter = left + (TOOLTIP_WIDTH / 2);
  const arrowOffset = position.x - boxCenter;

  return (
    <View 
      className="absolute items-center z-50"
      style={{ top, left, width: TOOLTIP_WIDTH }}
      pointerEvents="box-none" // Ensures the invisible container doesn't block touches
    >
      <View className="bg-stone-800 rounded-xl shadow-xl flex-row items-center overflow-hidden py-1 px-1">
        
        {/* Edit period option */}
        <Pressable 
          onPress={(e) => { e.stopPropagation(); onEditPeriod(); }}
          className="flex-1 flex-row items-center justify-center py-3 active:bg-stone-700 rounded-lg"
        >
          <Feather name="edit-2" size={16} color="white" style={{ marginRight: 6 }} />
          <Text className="text-white text-sm font-bold">Period</Text>
        </Pressable>

        {/* Divider 1 */}
        <View className="w-[1px] h-6 bg-stone-600 mx-1" />

        {/* Edit daily cycle questionnaire option */}
        <Pressable 
          onPress={(e) => { e.stopPropagation(); onEditCycleQuestionnaire(); }}
          className="flex-1 flex-row items-center justify-center py-3 active:bg-stone-700 rounded-lg"
        >
          <Feather name="clipboard" size={16} color="white" style={{ marginRight: 6 }} />
          <Text className="text-white text-sm font-bold">Entry</Text>
        </Pressable>

        {/* Divider 2*/}
        <View className="w-[1px] h-6 bg-stone-600 mx-1" />

        {/* Delete option */}
        <Pressable 
          onPress={(e) => { e.stopPropagation(); onDelete(); }}
          className="flex-1 flex-row items-center justify-center py-3 active:bg-stone-700 rounded-lg"
        >
          <Feather name="trash-2" size={16} color="#EF4444" style={{ marginRight: 6 }} />
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
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: ARROW_SIZE,
          borderRightWidth: ARROW_SIZE,
          borderTopWidth: ARROW_SIZE,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: TOOLTIP_COLOR,
          marginTop: -1, // Slight overlap with the tootip to prevent 1px cracks
        }}
        />
    </View>
  );
}