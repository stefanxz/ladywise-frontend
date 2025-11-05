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
};

// Here are all the themes from your design
export const themes: AppThemes = {
  ovulation: {
    gradientStart: '#dcedff',
    gradientEnd: '#E6F0FF',
    cardColor: "#b0d6ff26",
    highlight: '#c3daf2ff',
    highlightTextColor: '#000000',
    button: '#0052CC',
    buttonText: '#000000',
  },
  // Menstrual (Red)
  menstrual: {
    gradientStart: '#f3c1c1ff',
    gradientEnd: '#FEEEEE', 
    cardColor: "#f3c1c1ff",
    highlight: '#F9ACAC',
    highlightTextColor: '#000000',
    button: '#D90000',
    buttonText: '#000000',
  },
  // Luteal (Green)
  luteal: {
    gradientStart: '#c0ffbd',
    gradientEnd: '#E6F9E6', 
    cardColor: "#b3ffaf32",
    highlight: '#40f97eff',
    highlightTextColor: '#000000',
    button: '#0A8A0A',
    buttonText: '#000000',
  },
  // Follicular (Yellow)
  follicular: {
    gradientStart: '#f7ffbd',
    gradientEnd: '#FFFFE6',
    cardColor: "#f4feaa62",
    highlight: '#e8f968ff',
    highlightTextColor: '#000000',
    button: '#E6B800',
    buttonText: '#000000',
  },
};