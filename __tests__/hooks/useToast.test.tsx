import { renderHook } from "@testing-library/react-native";
import { useToast } from "@/hooks/useToast";
import { ToastProvider } from "@/context/ToastContext";
import React from "react";

// We don't mock the context here to test the "outside provider" case
// But for success case we need a provider.

describe("useToast hook", () => {
  it("throws error when used outside ToastProvider", () => {
    // console.error is expected when error boundary catches, silence it for this test
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useToast())).toThrow(
      "useToast must be used within ToastProvider",
    );

    spy.mockRestore();
  });

  it("returns context when used within ToastProvider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    const { result } = renderHook(() => useToast(), { wrapper });
    expect(result.current).toBeDefined();
    expect(typeof result.current.showToast).toBe("function");
  });
});
