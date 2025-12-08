import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Constants for layout
const TOOLTIP_WIDTH = 145;
const TOOLTIP_HEIGHT = 50; // Approx height
const ARROW_SIZE = 8;
const SCREEN_PADDING = 10; // Safety margin from edge of screen
const SCREEN_WIDTH = Dimensions.get('window').width;

type PeriodActionTooltipProps = {
  visible: boolean;
  position: { x: number; y: number } | null;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function PeriodActionTooltip({ 
  visible, 
  position, 
  onEdit, 
  onDelete, 
  onClose 
}: PeriodActionTooltipProps) {
  
  if (!visible || !position) return null;

  // We position the tooltip slightly above the top edge of the day component (y - 92)
  // and center it horizontally relative to the day (x - width/2)
  // We approximate width as 160px
  const top = position.y - 92;
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
    // This Pressable acts as a backdrop to close the tooltip if clicked outside
    <Pressable 
      style={StyleSheet.absoluteFill} 
      onPress={onClose} 
      pointerEvents="auto"
    >
      <View 
        className="absolute items-center z-50"
        style={{ top, left, width: TOOLTIP_WIDTH }}
      >
        <View className="bg-stone-800 rounded-xl shadow-xl flex-row items-center overflow-hidden py-1 px-1">
          
          {/* Edit option */}
          <Pressable 
            onPress={(e) => { e.stopPropagation(); onEdit(); }}
            className="flex-1 flex-row items-center justify-center py-3 active:bg-stone-700 rounded-lg"
          >
            <Feather name="edit-2" size={16} color="white" style={{ marginRight: 6 }} />
            <Text className="text-white text-sm font-bold">Edit</Text>
          </Pressable>

          {/* Divider */}
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
          className="mt-[-1px]"
          style={{ transform: [{ translateX: arrowOffset }] }}
        >
          <View className={`w-0 h-0 border-l-[${ARROW_SIZE}px] border-l-transparent border-r-[${ARROW_SIZE}px] border-r-transparent border-t-[${ARROW_SIZE}px] border-t-stone-800`} />
        </View>
      </View>
    </Pressable>
  );
}