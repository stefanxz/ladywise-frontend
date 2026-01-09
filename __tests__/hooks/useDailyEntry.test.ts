import { renderHook, act } from "@testing-library/react-native";
import { getDailyEntry, createDailyEntry } from "@/lib/api";
import { mapAnswersToPayload } from "@/utils/helpers";
import { useDailyEntry } from "@/hooks/useDailyEntry";

// Mocking dependencies
jest.mock("@/lib/api");
jest.mock("@/utils/helpers");
// Mocking the BottomSheetModal for the ref.present() call
jest.mock("@gorhom/bottom-sheet", () => ({
  BottomSheetModal: jest.fn(),
}));

jest.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock("@/context/ToastContext", () => ({
  ToastContext: {
    Provider: ({ children }: any) => children,
  },
}));

describe("useDailyEntry Hook - Extended Tests", () => {
  const testDate = new Date(2026, 0, 7); // Jan 7, 2026
  const testDateStr = "2026-01-07";
  const mockPresent = jest.fn();
  const mockRefreshData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupHook = () => {
    const renderResult = renderHook(() => useDailyEntry(mockRefreshData));
    // Manually mock the ref's current object
    (renderResult.result.current.bottomSheetRef as any).current = {
      present: mockPresent,
    };
    return renderResult;
  };

  it("should manage isLoading state correctly throughout the fetch lifecycle", async () => {
    // Create a promise we can control to test the "middle" state
    let resolveApi: (value: any) => void;
    const apiPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });
    (getDailyEntry as jest.Mock).mockReturnValue(apiPromise);

    const { result } = setupHook();

    let interactionPromise: Promise<void>;
    await act(async () => {
      interactionPromise = result.current.openQuestionnaire(testDate);
    });

    // At this point, API is pending
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveApi!({}); // Resolve the API
      await interactionPromise;
    });

    // After resolution
    expect(result.current.isLoading).toBe(false);
  });

  it("should provide a clean template with the correct date when the backend returns null", async () => {
    (getDailyEntry as jest.Mock).mockResolvedValue(null);

    const { result } = setupHook();

    await act(async () => {
      await result.current.openQuestionnaire(testDate);
    });

    expect(result.current.selectedDayData).toEqual({
      flow: null,
      symptoms: [],
      riskFactors: [],
      date: testDateStr,
    });
  });

  it("should not fail if handleSave is called without a refreshData callback", async () => {
    (createDailyEntry as jest.Mock).mockResolvedValue({});
    (mapAnswersToPayload as jest.Mock).mockReturnValue({});

    // Render without passing the refreshData mock
    const { result } = renderHook(() => useDailyEntry());

    await act(async () => {
      await result.current.handleSave({} as any);
    });

    expect(createDailyEntry).toHaveBeenCalled();
    // Simply checking that no error was thrown and it reached completion
  });

  it("should use the contextDate set during openQuestionnaire when saving", async () => {
    const firstDate = new Date(2026, 0, 1);
    const secondDate = new Date(2026, 0, 2);

    (getDailyEntry as jest.Mock).mockResolvedValue({});
    const { result } = setupHook();

    // Open for Date A
    await act(async () => {
      await result.current.openQuestionnaire(firstDate);
    });

    // Open for Date B (Context changes)
    await act(async () => {
      await result.current.openQuestionnaire(secondDate);
    });

    await act(async () => {
      await result.current.handleSave({ flow: "Heavy" } as any);
    });

    // Ensure the mapper was called with Date B, not Date A
    expect(mapAnswersToPayload).toHaveBeenCalledWith(
      expect.objectContaining({ date: "2026-01-02" }),
    );
  });

  it("should re-throw when saving fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    (createDailyEntry as jest.Mock).mockRejectedValue(
      new Error("Database Timeout"),
    );

    const { result } = setupHook();

    await expect(
      act(async () => {
        await result.current.handleSave({} as any);
      }),
    ).rejects.toThrow("Database Timeout");
  });
});
