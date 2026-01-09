import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  CycleQuestionsBottomSheetProps,
  DailyCycleAnswers,
  QuestionConfig,
} from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { CycleQuestion } from "@/components/CycleQuestionsBottomSheet/CycleQuestion";
import questionsData from "@/data/cycle-questions.json";
import { Droplet } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useToast } from "@/hooks/useToast";
import { format, isToday, parseISO } from "date-fns";

/**
 * CycleQuestionsBottomSheet
 *
 * A bottom sheet modal that renders a series of cycle-related questions
 * and allows the user to select answers. Answers are collected internally,
 * and saving is delegated to a parent via the `onSave` prop.
 *
 * @param {CycleQuestionsBottomSheetProps} props - Component props
 * @param {React.RefObject} props.bottomSheetRef - Ref to control the BottomSheetModal from parent
 * @param {function} props.onSave - Async function called when "Save answers" is pressed
 * @param {DailyCycleAnswers | null} props.initialData - Initial data passed by parent
 * @param {boolean} props.isLoading - Loading state passed by parent
 * @returns {JSX.Element} The rendered bottom sheet
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
  initialData,
  isLoading,
}: CycleQuestionsBottomSheetProps) {
  const questions = questionsData as unknown as QuestionConfig[];

  const { showToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  const [answers, setAnswers] = useState<DailyCycleAnswers>({
    flow: null,
    symptoms: [],
    riskFactors: [],
    date: "",
  });

  // Sync state when parent provides new initialData
  useEffect(() => {
    if (initialData) {
      setAnswers(initialData);
    } else {
      setAnswers({ flow: null, symptoms: [], riskFactors: [], date: "" });
    }
  }, [initialData]);

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
    setIsSaving(true);
    try {
      await onSave(answers);
      bottomSheetRef.current?.close();
    } catch (error) {
      showToast("Save failed.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const headerSubtitle = useMemo(() => {
    if (!answers.date) return null;

    const parsedDate = parseISO(answers.date);

    // If it's today, we can either show nothing or a subtle "Today"
    if (isToday(parsedDate)) {
      return "Today";
    }

    // If it's another day, show a friendly format like "Monday, Jan 5th"
    return format(parsedDate, "EEEE, MMM do");
  }, [answers.date]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: Colors.background }}
    >
      {/* Header */}
      <View className="mt-4 pb-2 px-4 items-center justify-center">
        <View className="flex-row items-center gap-2">
          <Droplet size={20} color="#FD7577" fill="#FD7577" />
          <Text className="text-[20px] font-inter-semibold tracking-tight text-headingText">
            Daily Cycle Check-In
          </Text>
        </View>

        {/* The Date Subtitle */}
        {headerSubtitle && (
          <View className="mt-1 bg-stone-100 px-3 py-0.5 round  ed-full">
            <Text className="text-[13px] font-inter-medium text-stone-500">
              {headerSubtitle}
            </Text>
          </View>
        )}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FD7577" />
          <Text className="mt-4 text-stone-500 font-inter-medium">
            Loading your entries...
          </Text>
        </View>
      ) : (
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 24,
          }}
        >
          <Text className="mb-8 px-8 text-[12px] text-inactiveText text-center">
            Answer a few quick questions and help us track your cycle and spot
            any changes.
          </Text>

          {questions.map((q) => (
            <CycleQuestion
              key={q.key}
              question={q.question}
              options={q.options}
              multiSelect={q.multiSelect}
              value={answers[q.key as keyof DailyCycleAnswers]}
              onSelect={(value) => handleSelect(q.key, value)}
            />
          ))}
        </BottomSheetScrollView>
      )}

      <View className="mt-4 flex-row gap-3 px-4 pb-8">
        <Pressable
          testID="save-button"
          onPress={handleSave}
          disabled={isSaving}
          className={`flex-1 rounded-xl py-3 items-center justify-center ${isSaving ? "bg-brand opacity-60" : "bg-brand"}`}
        >
          {isSaving ? (
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
