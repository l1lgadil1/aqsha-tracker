export type ColorTheme = {
  // Base colors
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  surface: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // Financial context colors
  income: string;
  expense: string;
  savings: string;
  investment: string;

  // State colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // UI element colors
  border: string;
  divider: string;
  overlay: string;
  shadow: string;
};

const sharedColors = {
  // Base palette
  white: '#FFFFFF',
  black: '#000000',

  // Blue scale
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue300: '#93C5FD',
  blue400: '#60A5FA',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  blue800: '#1E40AF',
  blue900: '#1E3A8A',

  // Gray scale
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',

  // Semantic colors
  green500: '#22C55E',
  red500: '#EF4444',
  yellow500: '#F59E0B',
};

type SharedColors = typeof sharedColors;

export type TColors = ColorTheme & SharedColors;

type ColorPalettes = {
  light: TColors;
  dark: TColors;
};

const Colors: ColorPalettes = {
  light: {
    // Base colors
    primary: sharedColors.blue600,
    secondary: sharedColors.blue400,
    tertiary: sharedColors.blue300,
    background: sharedColors.white,
    surface: sharedColors.gray50,

    // Text colors
    textPrimary: sharedColors.gray900,
    textSecondary: sharedColors.gray600,
    textTertiary: sharedColors.gray400,

    // Financial context colors
    income: sharedColors.green500,
    expense: sharedColors.red500,
    savings: sharedColors.blue500,
    investment: sharedColors.blue600,

    // State colors
    success: sharedColors.green500,
    warning: sharedColors.yellow500,
    error: sharedColors.red500,
    info: sharedColors.blue500,

    // UI element colors
    border: sharedColors.gray200,
    divider: sharedColors.gray100,
    overlay: 'rgba(15, 23, 42, 0.3)',
    shadow: 'rgba(15, 23, 42, 0.1)',

    ...sharedColors,
  },
  dark: {
    // Base colors
    primary: sharedColors.blue400,
    secondary: sharedColors.blue500,
    tertiary: sharedColors.blue600,
    background: sharedColors.gray900,
    surface: sharedColors.gray800,

    // Text colors
    textPrimary: sharedColors.white,
    textSecondary: sharedColors.gray300,
    textTertiary: sharedColors.gray500,

    // Financial context colors
    income: sharedColors.green500,
    expense: sharedColors.red500,
    savings: sharedColors.blue400,
    investment: sharedColors.blue300,

    // State colors
    success: sharedColors.green500,
    warning: sharedColors.yellow500,
    error: sharedColors.red500,
    info: sharedColors.blue400,

    // UI element colors
    border: sharedColors.gray700,
    divider: sharedColors.gray800,
    overlay: 'rgba(15, 23, 42, 0.75)',
    shadow: 'rgba(15, 23, 42, 0.3)',

    ...sharedColors,
  },
};

export default Colors;