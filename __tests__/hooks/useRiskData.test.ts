import { renderHook, waitFor } from "@testing-library/react-native";
import { useRiskData } from "@/hooks/useRiskData";
import { getRiskHistory } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

jest.mock("@/lib/api", () => ({
  getRiskHistory: jest.fn(),
}));

jest.mock("@/hooks/useToast", () => ({
  useToast: jest.fn(),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useFocusEffect: jest.fn((cb) => {
    const { useEffect } = require("react");
    useEffect(cb, []);
  }),
}));

const mockShowToast = jest.fn();
(useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });

describe("useRiskData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads and sorts data on mount", async () => {
    const mockData = [
      { date: "2023-01-02", value: 10 },
      { date: "2023-01-01", value: 5 },
    ];
    (getRiskHistory as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useRiskData("anemia", "daily"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].date).toBe("2023-01-01"); // Sorted ascending
    expect(result.current.history[1].date).toBe("2023-01-02");
  });

  it("handles invalid data format", async () => {
    (getRiskHistory as jest.Mock).mockResolvedValue({ not: "an array" });

    const { result } = renderHook(() => useRiskData("anemia", "daily"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockShowToast).toHaveBeenCalledWith("Received invalid data from server.", "error");
    expect(result.current.history).toEqual([]);
  });

  it("handles API error", async () => {
    (getRiskHistory as jest.Mock).mockRejectedValue(new Error("API Fail"));

    const { result } = renderHook(() => useRiskData("anemia", "daily"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockShowToast).toHaveBeenCalledWith("Failed to load history.", "error");
  });
});
