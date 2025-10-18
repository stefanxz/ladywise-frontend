import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { ProgressBarProps } from "./ProgressBar.types";

/**
 * A component that visually displays the progress between steps, 
 * with optional smooth animation.
 */
export function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  
  // Animation state reference
  const animatedWidth = useRef(new Animated.Value(0)).current;
  
  // Calculate normalized progress (0 to 1)
  const progress = Math.min(Math.max(currentStep / totalSteps, 0), 1);

  // Animation Effect
  useEffect(() => {
    animatedWidth.setValue(progress);
  }, [currentStep, totalSteps, progress]);

  // Rendering the Track and Animated Bar
  return (
    <View className={`w-full flex-row items-center gap-2.5`}>
      <View
        className={`flex-1 rounded-full overflow-hidden bg-lightGrey h-1`}
      >
        <Animated.View
          className={`h-full rounded-full bg-brand`}
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    </View>
  );
}