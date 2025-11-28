import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import {
  CycleQuestionsBottomSheetProps,
  DailyCycleAnswers,
  QuestionConfig,
} from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { CycleQuestion } from "@/components/CycleQuestionsBottomSheet/CycleQuestion";
import questionsData from "@/data/cycle-questions.json";
import { Droplet } from "lucide-react-native";
import { Colors } from "@/constants/colors";

/**
 * A bottom sheet modal that renders a series of cycle-related questions
 * and allows the user to select answers. Answers are collected internally,
 * and saving is delegated to a parent via the `onSave` prop.
 *
 * Props:
 * @param bottomSheetRef - Ref to control the BottomSheetModal from parent
 * @param onSave - Async function called when "Save answers" is pressed
 *                 Receives the answers object as { [questionId]: string | string[] }
 *
 * @example
 * ```tsx
 *   <CycleQuestionsBottomSheet
 *       bottomSheetRef={bottomSheetModalRef}
 *       onSave={async (answers) => {
 *       await api.saveAnswers(answers);
 *     }}
 *   />
 * ```
 */
export function CycleQuestionsBottomSheet({
  bottomSheetRef,
  onSave,
}: CycleQuestionsBottomSheetProps) {
  const questions = questionsData as unknown as QuestionConfig[];

  const [answers, setAnswers] = useState<DailyCycleAnswers>({
    flow: null,
    symptoms: [],
    riskFactors: [],
    date: "",
  });
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

  const handleSelect = (
    key: keyof DailyCycleAnswers,
    value: string | string[],
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const answersWithDate = {
        ...answers,
        date: new Date().toISOString().split("T")[0], // today
      };

      await onSave(answersWithDate); // saving is delegated to parent
      bottomSheetRef.current?.close();
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
      backgroundStyle={{ backgroundColor: Colors.background }}
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
        {questions.map((q) => (
          <CycleQuestion
            key={q.key}
            question={q.question}
            options={q.options}
            multiSelect={q.multiSelect}
            onSelect={(value) => handleSelect(q.key, value)}
          />
        ))}
      </BottomSheetScrollView>

      <View className="mt-4 flex-row gap-3 px-4 pb-8">
        <Pressable
          testID="save-button"
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
