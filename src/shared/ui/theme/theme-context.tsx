import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ColorTheme, lightColors, darkColors } from '../../config/theme/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDarkMode: boolean;
  colors: ColorTheme;
  setMode: (mode: ThemeMode) => void;
}

const defaultContext: ThemeContextType = {
  mode: 'system',
  isDarkMode: false,
  colors: lightColors,
  setMode: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  // Determine if dark mode is active based on mode and system preference
  const isDarkMode = mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  // Get the appropriate color theme
  const themeColors = isDarkMode ? darkColors : lightColors;

  // Effect to handle system theme changes
  useEffect(() => {
    if (mode === 'system') {
      // No need to do anything here as the component will re-render
      // when systemColorScheme changes
    }
  }, [systemColorScheme, mode]);

  const contextValue: ThemeContextType = {
    mode,
    isDarkMode,
    colors: themeColors,
    setMode,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
