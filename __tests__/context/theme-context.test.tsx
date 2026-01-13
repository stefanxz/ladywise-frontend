import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { themes } from "@/lib/themes";

describe("ThemeContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it("provides default theme (follicular)", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // checking deep equality against the imported theme object
    expect(result.current.theme).toEqual(themes.follicular);
  });

  it("updates theme when setPhase is called", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setPhase("menstrual");
    });

    expect(result.current.theme).toEqual(themes.menstrual);
    // checking specific color property
    expect(result.current.theme.button).toBe(themes.menstrual.button);
  });

  it("switches to ovulation theme correctly", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setPhase("ovulation");
    });

    expect(result.current.theme).toEqual(themes.ovulation);
  });
});