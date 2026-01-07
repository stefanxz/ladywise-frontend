import { useState, useRef, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { getDailyEntry, createDailyEntry, updateDailyEntry } from "@/lib/api";
import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { mapAnswersToPayload, mapApiToAnswers } from "@/utils/helpers";

export function useDailyEntry(refreshData?: () => Promise<void>) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDayData, setSelectedDayData] =
    useState<DailyCycleAnswers | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [contextDate, setContextDate] = useState<string>("");

  const openQuestionnaire = useCallback(async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setContextDate(dateStr);

    // Open immediately for responsiveness
    bottomSheetRef.current?.present();
    setIsLoading(true);

    try {
      const data = await getDailyEntry(dateStr);
      if (data) {
        const formattedAnswers = mapApiToAnswers(data, dateStr);
        setSelectedDayData(formattedAnswers);
        setIsUpdating(true);
      } else {
        setSelectedDayData(null);
        setIsUpdating(false);
      }
    } catch (err) {
      setSelectedDayData(null);
      setIsUpdating(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSave = async (answers: DailyCycleAnswers) => {
    try {
      // Map your UI answers to the API payload format here
      const payload = mapAnswersToPayload({ ...answers, date: contextDate });

      if (isUpdating) {
        await updateDailyEntry(payload);
      } else {
        await createDailyEntry(payload);
      }

      if (refreshData) await refreshData();
    } catch (error) {
      console.error("Failed to save entry:", error);
      throw error; // Re-throws so the UI can handle errors if needed
    }
  };

  return {
    bottomSheetRef,
    isLoading,
    selectedDayData,
    openQuestionnaire,
    handleSave,
  };
}
