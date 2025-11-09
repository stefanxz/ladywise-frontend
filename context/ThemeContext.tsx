import React, { createContext, useContext, useState } from 'react';
import { themes, type Theme } from '@/lib/themes'; 

type ThemeContextData = {
  theme: Theme; 
  setPhase: (phase: 'ovulation' | 'menstrual' | 'luteal' | 'follicular') => void;
};

const ThemeContext = createContext<ThemeContextData>({
  theme: themes.ovulation,
  setPhase: () => {}, // Default empty function
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.ovulation);

  // This is the function our app will call to change the theme
  const setPhase = (
    phase: 'ovulation' | 'menstrual' | 'luteal' | 'follicular'
  ) => {
    setCurrentTheme(themes[phase]); // Set the theme to the new phase colors
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setPhase }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};