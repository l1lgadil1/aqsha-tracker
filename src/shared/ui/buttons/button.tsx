/**
 * Button component
 * Provides consistent button styling throughout the application
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Text } from '../typography';
import { useTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

/**
 * Button component with consistent styling based on the application theme
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  style,
  textStyle,
  children,
  ...props
}) => {
  const { colors, spacing, shadows } = useTheme();

  // Determine button styles based on variant
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: colors.primary,
            ...shadows.sm,
          },
          text: {
            color: colors.textInverted,
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.backgroundSecondary,
            ...shadows.sm,
          },
          text: {
            color: colors.textPrimary,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.primary,
          },
          text: {
            color: colors.primary,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: colors.primary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.error,
            ...shadows.sm,
          },
          text: {
            color: colors.textInverted,
          },
        };
      default:
        return {
          container: {
            backgroundColor: colors.primary,
            ...shadows.sm,
          },
          text: {
            color: colors.textInverted,
          },
        };
    }
  };

  // Determine button size styles
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
            borderRadius: spacing.radiusSm,
          },
          text: {
            fontSize: 14,
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: spacing.radiusMd,
          },
          text: {
            fontSize: 18,
          },
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: spacing.radiusSm,
          },
          text: {
            fontSize: 16,
          },
        };
    }
  };

  // Get styles based on variant and size
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Combine all styles
  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    variantStyles.container,
    sizeStyles.container,
    fullWidth && styles.fullWidth,
    (isDisabled || isLoading) && styles.disabled,
    style,
  ];

  const textStyleCombined: StyleProp<TextStyle> = [
    styles.text,
    variantStyles.text,
    sizeStyles.text,
    (isDisabled || isLoading) && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={isDisabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.content}>
        {leftIcon && !isLoading && <View style={styles.iconLeft}>{leftIcon}</View>}

        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={
              variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textInverted
            }
          />
        ) : (
          <Text style={textStyleCombined} weight="medium">
            {children}
          </Text>
        )}

        {rightIcon && !isLoading && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
