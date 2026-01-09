import { useState, useRef, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { getDailyEntry, createDailyEntry } from "@/lib/api";
import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { mapAnswersToPayload, mapApiToAnswers } from "@/utils/helpers";
import { useToast } from "@/hooks/useToast";

/**
 * Hook that manages the lifecycle of the cycle questionnaire.
 *
 * @param refreshData - An optional callback to refresh external data
 * @param onSaveSuccess - An optional callback that gets fired on successful save
 */
export function useDailyEntry(
  refreshData?: () => Promise<void>,
  onSaveSuccess?: () => void,
) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [selectedDayData, setSelectedDayData] =
    useState<DailyCycleAnswers | null>(null);

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
        // Map backend enums back to UI labels
        const formattedAnswers = mapApiToAnswers(data, dateStr);
        setSelectedDayData(formattedAnswers);
      } else {
        setSelectedDayData({
          flow: null,
          symptoms: [],
          riskFactors: [],
          date: dateStr,
        });
      }
    } catch (err) {
      // 404/Error means no entry yet
      setSelectedDayData({
        flow: null,
        symptoms: [],
        riskFactors: [],
        date: dateStr,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSave = async (answers: DailyCycleAnswers) => {
    try {
      // Map UI answers back to API payload
      const payload = mapAnswersToPayload({ ...answers, date: contextDate });
      await createDailyEntry(payload);

      showToast("Successfully saved entry!", "success");

      if (refreshData) await refreshData();
      if (onSaveSuccess) onSaveSuccess(); // callback gets called here, e.g., for triggering LLM updates
    } catch (error) {
      showToast("Failed to save entry.", "error");
      throw error;
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
