/**
 * Theme configuration index
 * Exports all theme-related constants and types
 */

import { colors, ColorTheme, lightColors, darkColors } from './colors';
import { spacing, SpacingTheme } from './spacing';
import { typography, TypographyTheme } from './typography';
import { shadows, ShadowTheme } from './shadows';

// Combined theme type
export interface Theme {
  colors: ColorTheme;
  spacing: SpacingTheme;
  typography: TypographyTheme;
  shadows: ShadowTheme;
}

// Light theme
export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
  shadows,
};

// Dark theme
export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  typography,
  shadows,
};

// Export individual theme modules
export { colors, lightColors, darkColors };
export { spacing };
export { typography };
export { shadows };

// Export theme types
export type { ColorTheme };
export type { SpacingTheme };
export type { TypographyTheme };
export type { ShadowTheme };
