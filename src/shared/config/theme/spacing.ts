/**
 * Spacing configuration for the application
 * Provides consistent spacing values for margins, paddings, and gaps
 */

export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Specific spacing use cases
  screenPadding: 16,
  cardPadding: 16,
  inputPadding: 12,
  buttonPadding: 12,
  iconPadding: 8,
  listItemPadding: 12,
  sectionGap: 24,
  itemGap: 12,

  // Insets for safe area
  safeTop: 44, // Default iOS top safe area
  safeBottom: 34, // Default iOS bottom safe area for devices with home indicator

  // Border radius
  radiusXs: 4,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,
};

export type SpacingTheme = typeof spacing;

export default spacing;
