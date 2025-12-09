import termsData from "../../data/terms-and-conditions.json";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { View, Text, Pressable } from "react-native";

import type {
  TermsConditionsPopUpRef,
  TermsConditionsPopUpProps,
} from "./TermsConditionsPopUp.types";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const TermsConditionsPopUp = forwardRef<
  TermsConditionsPopUpRef,
  TermsConditionsPopUpProps
>(({ onAccept, mode = "accept" }, ref) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  const insets = useSafeAreaInsets();
  const backdrop = useCallback(
    (p: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );
  TermsConditionsPopUp.displayName = "TermsConditionsPopUp";

  useImperativeHandle(ref, () => ({
    open: () => {
      modalRef.current?.present();
    },
    close: () => {
      modalRef.current?.close();
    },
  }));

  function handleAccept(): void {
    onAccept?.();
    modalRef.current?.close();
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      backdropComponent={backdrop}
      enablePanDownToClose
      handleIndicatorStyle={{}}
      topInset={insets.top}
    >
      <View className="rounded-t-2xl px-1 pb-2">
        <Text className="text-3xl text-brand text-left font-semibold px-3">
          Privacy Policy &{"\n"}Terms of Service
        </Text>
      </View>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Content */}
        <Text className="text-lg font-semibold mb-2">{termsData.title}</Text>
        <Text className="text-base text-slate-800 mb-4">
          {termsData.subtitle}
        </Text>
        <Text className="text-sm text-slate-700 mb-4">
          Last updated: {termsData.lastUpdated}
        </Text>

        {termsData.introduction.map((para, idx) => (
          <Text key={idx} className="text-sm text-slate-700 mb-3">
            {para}
          </Text>
        ))}

        {termsData.sections.map((section) => (
          <View key={section.number} className="mt-4">
            <Text className="font-semibold text-slate-900 mb-2">
              {section.number}. {section.title}
            </Text>
            {section.content.map((line, i) => (
              <Text key={i} className="text-sm text-slate-700 mb-2">
                {line}
              </Text>
            ))}
          </View>
        ))}

        {termsData.footer && (
          <View className="mt-6 border-t border-slate-200 pt-4">
            <Text className="text-sm text-slate-700 mb-2">
              {termsData.footer.contactNote}
            </Text>
            <Text className="text-xs text-slate-500">
              {termsData.footer.copyright}
            </Text>
          </View>
        )}
      </BottomSheetScrollView>
      {mode === "accept" ? (
        // Show Cancel & Accept buttons
        <View className="mt-4 flex-row gap-3 px-4 pb-8">
          <Pressable
            className="flex-1 border border-slate-300 rounded-xl py-3 items-center"
            onPress={() => modalRef.current?.close()}
          >
            <Text className="text-slate-900 font-semibold">Cancel</Text>
          </Pressable>

          <Pressable
            className="flex-1 bg-brand rounded-xl py-3 items-center"
            onPress={handleAccept}
          >
            <Text className="text-white font-semibold">Accept & Continue</Text>
          </Pressable>
        </View>
      ) : (
        // Show just OK button
        <View className="mt-4 px-4 pb-8">
          <Pressable
            className="bg-brand rounded-xl py-3 items-center"
            onPress={() => modalRef.current?.close()}
          >
            <Text className="text-white font-semibold">OK</Text>
          </Pressable>
        </View>
      )}
    </BottomSheetModal>
  );
});

export default TermsConditionsPopUp;
export type { TermsConditionsPopUpRef, TermsConditionsPopUpProps };
