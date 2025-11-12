import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { CycleQuestionsBottomSheetProps } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { CycleQuestion } from "@/components/CycleQuestionsBottomSheet/CycleQuestion";
import questionsData from "@/data/cycle-questions.json";
import { Droplet } from "lucide-react-native";

export function CycleQuestionsBottomSheet({
  bottomSheetRef,
}: CycleQuestionsBottomSheetProps) {
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [saving, setSaving] = useState(false);

  const snapPoints = useMemo(() => ["80%"], []);

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

  const handleSelect = (id: number) => (value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // placeholder API call: 1s timeout
      await new Promise((res) => setTimeout(res, 1000));

      // simulated payload
      const payload = {
        timestamp: new Date().toISOString(),
        answers,
      };

      console.log("fake API payload:", payload);

      bottomSheetRef.current?.close();

      // todo handle success message
    } catch (err) {
      console.error("save failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      snapPoints={snapPoints}
    >
      <View className="mt-4 pb-2 px-4 flex-row items-center justify-center gap-2">
        <Droplet size={24} color="#FD7577" fill="#FD7577" />
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
        {questionsData.map((q) => (
          <CycleQuestion
            key={q.id}
            question={q.question}
            options={q.options}
            multiSelect={q.multiSelect}
            onSelect={(value) => handleSelect(q.id)(value)}
          />
        ))}
      </BottomSheetScrollView>

      <View className="mt-4 flex-row gap-3 px-4 pb-8">
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className={`flex-1 rounded-xl py-3 items-center justify-center ${saving ? "bg-brand opacity-60" : "bg-brand"}`}
        >
          {saving ? (
            <Text className="text-white font-inter-semibold">
              Saving answers...
            </Text>
          ) : (
            <Text className="text-white font-inter-semibold">Save answers</Text>
          )}
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}
