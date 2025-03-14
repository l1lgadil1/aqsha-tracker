/**
 * Typography component
 * Provides consistent text styling throughout the application
 */

import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme';

export type TextVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headingLarge'
  | 'headingMedium'
  | 'headingSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: 'thin' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy';
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

/**
 * Text component with consistent styling based on the application theme
 */
export const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  color,
  align,
  weight,
  style,
  children,
  ...props
}) => {
  const { colors, typography } = useTheme();

  // Get the base style for the variant and convert to TextStyle
  const variantStyle = {
    fontFamily: typography.textStyles[variant].fontFamily,
    fontSize: typography.textStyles[variant].fontSize,
    fontWeight: typography.textStyles[variant].fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.textStyles[variant].lineHeight,
    letterSpacing: typography.textStyles[variant].letterSpacing,
  };

  // Create the combined style
  const textStyle: StyleProp<TextStyle> = [
    variantStyle,
    align && { textAlign: align },
    weight && { fontWeight: typography.fontWeight[weight] as TextStyle['fontWeight'] },
    color && { color },
    // Default to primary text color if no color is provided
    !color && { color: colors.textPrimary },
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

export default Text;
