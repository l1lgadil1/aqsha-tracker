import { ColorTheme } from '../config/theme/colors';

/**
 * Creates a themed style object by applying the current theme colors
 * @param styleCreator Function that takes colors and returns a style object
 * @returns A function that takes the current theme colors and returns the styled object
 */
export function createThemedStyle<T>(styleCreator: (colors: ColorTheme) => T) {
  return (colors: ColorTheme): T => styleCreator(colors);
}

/**
 * Determines if a color is light or dark
 * @param color Hex color string
 * @returns Boolean indicating if the color is light
 */
export function isLightColor(color: string): boolean {
  // Remove the # if it exists
  const hex = color.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance using the formula: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if the color is light (luminance > 0.5)
  return luminance > 0.5;
}

/**
 * Gets a contrasting text color (black or white) based on the background color
 * @param backgroundColor Hex color string
 * @returns '#000000' for light backgrounds, '#FFFFFF' for dark backgrounds
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}

/**
 * Applies alpha transparency to a hex color
 * @param color Hex color string
 * @param alpha Alpha value (0-1)
 * @returns Rgba color string
 */
export function applyAlpha(color: string, alpha: number): string {
  // Remove the # if it exists
  const hex = color.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
