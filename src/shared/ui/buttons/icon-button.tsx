/**
 * IconButton component
 * Provides consistent icon button styling throughout the application
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';
import { useTheme } from '../theme';

export type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends TouchableOpacityProps {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * IconButton component with consistent styling based on the application theme
 */
export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  isDisabled = false,
  style,
  ...props
}) => {
  const { colors, spacing, shadows } = useTheme();

  // Determine button styles based on variant
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          ...shadows.sm,
        };
      case 'secondary':
        return {
          backgroundColor: colors.backgroundSecondary,
          ...shadows.sm,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          ...shadows.sm,
        };
      default:
        return {
          backgroundColor: colors.primary,
          ...shadows.sm,
        };
    }
  };

  // Determine button size styles
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
        };
      case 'lg':
        return {
          width: 56,
          height: 56,
          borderRadius: 28,
        };
      case 'md':
      default:
        return {
          width: 44,
          height: 44,
          borderRadius: 22,
        };
    }
  };

  // Get styles based on variant and size
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Combine all styles
  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    variantStyles,
    sizeStyles,
    (isDisabled || isLoading) && styles.disabled,
    style,
  ];

  // Determine icon color based on variant
  const getIconColor = (): string => {
    if (variant === 'outline' || variant === 'ghost') {
      return colors.primary;
    }
    if (variant === 'secondary') {
      return colors.textPrimary;
    }
    return colors.textInverted;
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={isDisabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <View style={styles.iconContainer}>{icon}</View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default IconButton;
