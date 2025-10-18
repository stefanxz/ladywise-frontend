import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { ProgressBarProps } from "./ProgressBar.types";

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  animated = true,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const progress = Math.min(Math.max(currentStep / totalSteps, 0), 1);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [currentStep, totalSteps, animated, progress]);

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
};

export default ProgressBar;