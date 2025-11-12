import React, { useCallback } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { CycleQuestionsBottomSheetProps } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { CycleQuestion } from "@/components/CycleQuestionsBottomSheet/CycleQuestion";

const screenHeight = Dimensions.get("window").height;

export function CycleQuestionsBottomSheet({
  bottomSheetRef,
}: CycleQuestionsBottomSheetProps) {
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
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      enableDynamicSizing
      maxDynamicContentSize={screenHeight * 0.95}
    >
      <View className="mt-4 pb-2 px-4 flex items-center">
        <Text className="text-[20px] font-inter-semibold tracking-tight">
          Daily Cycle Check-In
        </Text>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-8 px-8 text-[12px] text-inactiveText flex items-center text-center">
          Answer a few quick questions and help us track your cycle and spot any
          important changes.
        </Text>

        {/* Questions */}

        <CycleQuestion
          question="How are you feeling today?"
          options={["Good", "Okay", "Bad"]}
          onSelect={(value) => console.log("Selected:", value)}
        />

        {[...Array(20)].map((_, i) => (
          <Text key={i} className="text-base text-gray-600 mb-2">
            Content item {i + 1}
          </Text>
        ))}
      </BottomSheetScrollView>

      <View className="mt-4 flex-row gap-3 px-4 pb-8">
        <Pressable className="flex-1 bg-brand rounded-xl py-3 items-center">
          <Text className="text-white font-inter-semibold">Save answers</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}
