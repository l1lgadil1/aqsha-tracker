/**
 * useTheme hook
 * Provides access to the current theme and theme-related utilities
 */

import { useContext } from 'react';
import { ThemeContext } from './theme-context';
import { Theme, lightTheme, darkTheme } from '../../config/theme';

/**
 * Hook to access the current theme and theme-related utilities
 * @returns Theme context with colors, spacing, typography, and theme utilities
 */
export const useTheme = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  // Get the current theme based on mode
  const currentTheme: Theme = themeContext.isDarkMode ? darkTheme : lightTheme;

  return {
    // Theme properties
    ...currentTheme,

    // Theme context properties
    mode: themeContext.mode,
    isDarkMode: themeContext.isDarkMode,
    setMode: themeContext.setMode,

    // Theme utility functions
    getColor: (colorKey: keyof Theme['colors']) => currentTheme.colors[colorKey],
    getSpacing: (spacingKey: keyof Theme['spacing']) => currentTheme.spacing[spacingKey],
    getShadow: (shadowKey: keyof Theme['shadows']) => currentTheme.shadows[shadowKey],

    // Utility for conditional styles based on theme
    select: <T>(options: { light: T; dark: T }) =>
      themeContext.isDarkMode ? options.dark : options.light,
  };
};

export default useTheme;
