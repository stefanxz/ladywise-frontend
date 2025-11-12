import React, { useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CustomBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}

export function CycleQuestionsBottomSheet({
  bottomSheetRef,
}: CustomBottomSheetProps) {
  const snapPoints = useMemo(() => ["75%"], []);
  const insets = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: "#9ca3af" }}
      topInset={insets.top}
    >
      <View className="px-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">
          Bottom Sheet Title
        </Text>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-base text-gray-700 mb-4">
          Your scrollable content goes here. This area will scroll vertically
          while the bottom navigation bar stays fixed.
        </Text>

        {[...Array(20)].map((_, i) => (
          <Text key={i} className="text-base text-gray-600 mb-2">
            Content item {i + 1}
          </Text>
        ))}
      </BottomSheetScrollView>

      <View className="border-t border-gray-200 px-4 pb-8 bg-white">
        <TouchableOpacity
          className="bg-blue-600 py-3 px-6 rounded-lg items-center mt-4"
          onPress={() => console.log("Button pressed")}
        >
          <Text className="text-white font-semibold text-base">
            Placeholder Button
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}
