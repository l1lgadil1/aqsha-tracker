/**
 * Color palette for the application
 * Contains both light and dark theme colors
 */

export const lightColors = {
  // Primary colors
  primary: '#000000',
  primaryLight: '#333333',
  primaryDark: '#000000',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#EEEEEE',

  // Text colors
  textPrimary: '#000000',
  textSecondary: '#555555',
  textTertiary: '#888888',
  textInverted: '#FFFFFF',

  // UI element colors
  border: '#E0E0E0',
  divider: '#EEEEEE',
  card: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Status colors
  success: '#00C853',
  warning: '#FFD600',
  error: '#FF3B30',
  info: '#0A84FF',

  // Income/Expense specific colors
  income: '#00C853',
  expense: '#FF3B30',

  // Chart colors
  chartPrimary: '#000000',
  chartSecondary: '#555555',
  chartAccent: '#888888',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.5)',
  skeleton: '#E0E0E0',
};

export const darkColors = {
  // Primary colors
  primary: '#FFFFFF',
  primaryLight: '#CCCCCC',
  primaryDark: '#FFFFFF',

  // Background colors
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textTertiary: '#777777',
  textInverted: '#000000',

  // UI element colors
  border: '#333333',
  divider: '#333333',
  card: '#1C1C1E',
  shadow: 'rgba(0, 0, 0, 0.5)',

  // Status colors
  success: '#30D158',
  warning: '#FFD60A',
  error: '#FF453A',
  info: '#0A84FF',

  // Income/Expense specific colors
  income: '#30D158',
  expense: '#FF453A',

  // Chart colors
  chartPrimary: '#FFFFFF',
  chartSecondary: '#AAAAAA',
  chartAccent: '#777777',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.7)',
  skeleton: '#333333',
};

export type ColorTheme = typeof lightColors;

export const colors = {
  light: lightColors,
  dark: darkColors,
};

export default colors;
