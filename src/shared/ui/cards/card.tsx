/**
 * Card component
 * Provides a consistent card container with various styling options
 */

import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: TouchableOpacityProps['onPress'];
  testID?: string;
}

/**
 * Card component with consistent styling based on the application theme
 */
export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  children,
  style,
  contentStyle,
  disabled = false,
  onPress,
  testID,
  ...props
}) => {
  const { colors, spacing, shadows } = useTheme();

  // Determine card styles based on variant
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.backgroundSecondary,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: colors.card,
          ...shadows.sm,
        };
    }
  };

  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    getVariantStyles(),
    disabled && styles.disabled,
    style,
  ];

  // If onPress is provided, wrap in TouchableOpacity, otherwise use View
  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        testID={testID}
        {...props}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} testID={testID}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Card;
