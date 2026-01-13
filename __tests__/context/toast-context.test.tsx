import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { ToastProvider, ToastContext } from "@/context/ToastContext";

// helper hook
const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

describe("ToastContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with zero toasts", () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    expect(result.current.toasts).toEqual([]);
  });

  it("adds a toast message", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast("Test Error", "error");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Test Error");
    expect(result.current.toasts[0].type).toBe("error");
  });

  it("auto-dismisses toast after duration", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast("Fleeting Message", "info", 1000);
    });

    expect(result.current.toasts).toHaveLength(1);

    // fast-fwd time
    act(() => {
      jest.advanceTimersByTime(1001);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("manually dismisses toast", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast("Sticky Message", "info", 0);
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.hideToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});