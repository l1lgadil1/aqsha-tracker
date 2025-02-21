import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/theme-context';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption';
  color?: string;
}

export const Text: React.FC<TextProps> = ({ 
  style, 
  variant = 'body1', 
  color,
  children,
  ...props 
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    h1: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    body1: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    body2: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    caption: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  return (
    <RNText 
      style={[
        styles[variant],
        color && { color },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}; 