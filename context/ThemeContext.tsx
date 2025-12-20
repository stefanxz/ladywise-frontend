import React, { createContext, useContext, useState } from "react";
import { themes, type Theme } from "@/lib/themes";

type ThemeContextData = {
  theme: Theme;
  setPhase: (
    phase: "ovulation" | "menstrual" | "luteal" | "follicular",
  ) => void;
};

/**
 * ThemeContext
 *
 * Manages the application's visual theme based on the user's menstrual cycle phase.
 * Provides the current theme object and a function to update the phase.
 */
const ThemeContext = createContext<ThemeContextData>({
  theme: themes.neutral,
  setPhase: () => {}, // Default empty function
});

/**
 * ThemeProvider
 *
 * Wraps the application to provide dynamic theming capabilities.
 * Allows child components to consume theme colors and trigger phase changes.
 *
 * @param children - The component tree to be themed
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.follicular);

  // This is the function our app will call to change the theme
  const setPhase = (
    phase: "ovulation" | "menstrual" | "luteal" | "follicular",
  ) => {
    setCurrentTheme(themes[phase]); // Set the theme to the new phase colors
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setPhase }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the current theme and phase setter.
 *
 * @returns {ThemeContextData} The theme context values
 */
export const useTheme = () => {
  return useContext(ThemeContext);
};
