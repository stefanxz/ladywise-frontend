import React, { useMemo, useRef, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import FactorRow from "./FactorRow";
import SectionBlock from "./SectionBlock";

export default function ContributedModal({ visible, onClose, data }) {
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "90%"], []);

  useEffect(() => {
    if (visible) ref.current?.present();
    else ref.current?.dismiss();
  }, [visible]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={onClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      backgroundStyle={{ borderRadius: 24 }}
    >
      <View className="flex-1 px-5 pt-2">
        <View className="items-center mb-3">
          <View className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </View>

        <Text className="text-headingText text-xl font-inter-semibold mb-4">
          What contributed?
        </Text>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {Object.entries(data).map(([section, items]) => (
            <SectionBlock key={section} title={section}>
              {items.map((item) => (
                <FactorRow
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  value={item.value}
                  source={item.source}
                  icon={item.icon}
                />
              ))}
            </SectionBlock>
          ))}
        </ScrollView>
      </View>
    </BottomSheetModal>
  );
}