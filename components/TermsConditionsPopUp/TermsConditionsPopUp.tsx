// components/TermsConditionsPopUp/TermsConditionsPopUp.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useEffect } from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { ScrollView, View, Text, Pressable } from "react-native";

export type TermsConditionsPopUpRef = { open: () => void; close: () => void };

const TermsConditionsPopUp = forwardRef<TermsConditionsPopUpRef>((_, ref) => {
  const TERMS_VERSION = "v1.0";
  const modalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);
  const backdrop = useCallback(
    (p: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  useImperativeHandle(ref, () => ({
    open: () => {
      modalRef.current?.present();
    },
    close: () => {
      modalRef.current?.close();
    },
  }));

  function onAccept(TERMS_VERSION: any): void {
    console.log("Accepted Terms and Conditions:", TERMS_VERSION);
    modalRef.current?.close();
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={["50%"]}
      backdropComponent={backdrop}
      enablePanDownToClose
      handleIndicatorStyle={{}}
    >
      <BottomSheetView className="flex-1 px-4 pt-4">
        <View className="rounded-t-2xl px-1 pb-6">
          <Text className="text-3xl text-brand text-left font-semibold">
            Privacy Policy &{"\n"}Terms of Service
          </Text>
          <Text className="mt-2">Sup, cuh</Text>
          <View className="mt-4 flex-row gap-3 pb-4">
            <Pressable
              className="flex-1 border border-slate-300 rounded-xl py-3 items-center"
              onPress={() => modalRef.current?.close()}
            >
              <Text className="text-slate-900 font-semibold">Cancel</Text>
            </Pressable>

            <Pressable
              className="flex-1 bg-brand rounded-xl py-3 items-center"
              onPress={() => onAccept(TERMS_VERSION)}
            >
              <Text className="text-white font-semibold">
                Accept & Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
export default TermsConditionsPopUp;
