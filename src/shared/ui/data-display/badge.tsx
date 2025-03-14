/**
 * Badge component
 * Provides a consistent badge for displaying status or counts
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../typography';
import { useTheme } from '../theme';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  label?: string;
  count?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Badge component with consistent styling based on the application theme
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  count,
  variant = 'primary',
  size = 'md',
  dot = false,
  style,
  textStyle,
}) => {
  const { colors, spacing } = useTheme();

  // Get background color based on variant
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'secondary':
        return colors.backgroundSecondary;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      case 'primary':
      default:
        return colors.primary;
    }
  };

  // Get text color based on variant
  const getTextColor = (): string => {
    switch (variant) {
      case 'secondary':
        return colors.textPrimary;
      default:
        return colors.textInverted;
    }
  };

  // Get size styles
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: 2,
            paddingHorizontal: dot ? 2 : 6,
            borderRadius: 4,
          },
          text: {
            fontSize: 10,
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: 6,
            paddingHorizontal: dot ? 6 : 12,
            borderRadius: 12,
          },
          text: {
            fontSize: 14,
          },
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: 4,
            paddingHorizontal: dot ? 4 : 8,
            borderRadius: 8,
          },
          text: {
            fontSize: 12,
          },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();

  const badgeStyle: StyleProp<ViewStyle> = [
    styles.container,
    sizeStyles.container,
    { backgroundColor },
    dot && styles.dot,
    style,
  ];

  // If dot is true, just render a dot
  if (dot) {
    return <View style={badgeStyle} />;
  }

  // Determine content to display
  const content = label || (count !== undefined ? count.toString() : null);

  return (
    <View style={badgeStyle}>
      {content && (
        <Text
          style={[styles.text, sizeStyles.text, { color: textColor }, textStyle]}
          numberOfLines={1}
        >
          {content}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    padding: 0,
  },
  text: {
    fontWeight: '500',
  },
});

export default Badge;
