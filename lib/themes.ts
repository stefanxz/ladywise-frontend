export type Theme = {
  gradientStart: string;
  gradientEnd: string;
  cardColor: string;
  highlight: string;
  highlightTextColor: string;
  button: string;
  buttonText: string;
};

// Defines our main theme (maps phase names to colors)
type AppThemes = {
  ovulation: Theme;
  menstrual: Theme;
  luteal: Theme;
  follicular: Theme;
  neutral: Theme;
};

/**
 * Application Theme Definitions.
 * Maps cycle phases (ovulation, menstrual, etc.) to specific color palettes.
 * Used by `ThemeContext` to update the UI dynamically.
 */
export const themes: AppThemes = {
  ovulation: {
    gradientStart: "#dcedff",
    gradientEnd: "#E6F0FF",
    cardColor: "#b0d6ff26",
    highlight: "#c3daf2ff",
    highlightTextColor: "#000000",
    button: "#0052CC",
    buttonText: "#000000",
  },
  // Menstrual (Red)
  menstrual: {
    gradientStart: "#f3c1c1ff",
    gradientEnd: "#FEEEEE",
    cardColor: "#fac0c053",
    highlight: "#F9ACAC",
    highlightTextColor: "#000000",
    button: "#D90000",
    buttonText: "#000000",
  },
  // Luteal (Green)
  luteal: {
    gradientStart: "#c0ffbd",
    gradientEnd: "#E6F9E6",
    cardColor: "#b3ffaf32",
    highlight: "#40f97eff",
    highlightTextColor: "#000000",
    button: "#0A8A0A",
    buttonText: "#000000",
  },
  // Follicular (Yellow)
  follicular: {
    gradientStart: "#f7ffbd",
    gradientEnd: "#FFFFE6",
    cardColor: "#f4feaa62",
    highlight: "#e8f968ff",
    highlightTextColor: "#000000",
    button: "#E6B800",
    buttonText: "#000000",
  },
  neutral: {
    gradientStart: "#F8FAFC", // Very light cool grey
    gradientEnd: "#FFFFFF", // White
    cardColor: "#E2E8F080", // Semi-transparent light grey
    highlight: "#CBD5E1", // Distinct but subtle grey for 'today'
    highlightTextColor: "#1E293B", // Dark slate for contrast
    button: "#475569", // Professional slate grey button
    buttonText: "#FFFFFF",
  },
};
