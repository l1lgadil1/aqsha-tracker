/**
 * TextInput component
 * Provides consistent text input styling throughout the application
 */

import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text } from '../typography';
import { useTheme } from '../theme';

export type TextInputVariant = 'outline' | 'filled' | 'underline';
export type TextInputSize = 'sm' | 'md' | 'lg';

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  variant?: TextInputVariant;
  size?: TextInputSize;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
  style?: StyleProp<TextStyle>; // Original TextInput style
}

/**
 * TextInput component with consistent styling based on the application theme
 */
export const TextInput: React.FC<TextInputProps> = ({
  variant = 'outline',
  size = 'md',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isDisabled = false,
  isReadOnly = false,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  style,
  ...props
}) => {
  const { colors, spacing, shadows } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  // Determine input styles based on variant
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.backgroundTertiary,
          borderWidth: 0,
          borderBottomWidth: 2,
          borderBottomColor: error ? colors.error : isFocused ? colors.primary : colors.border,
        };
      case 'underline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: error ? colors.error : isFocused ? colors.primary : colors.border,
        };
      case 'outline':
      default:
        return {
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
          borderRadius: spacing.radiusSm,
          ...(isFocused && !error ? shadows.xs : {}),
        };
    }
  };

  // Determine input size styles
  const getSizeStyles = (): { container: ViewStyle; input: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            minHeight: 40,
          },
          input: {
            fontSize: 14,
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
          },
        };
      case 'lg':
        return {
          container: {
            minHeight: 56,
          },
          input: {
            fontSize: 18,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
          },
        };
      case 'md':
      default:
        return {
          container: {
            minHeight: 48,
          },
          input: {
            fontSize: 16,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
          },
        };
    }
  };

  // Get styles based on variant and size
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Combine all styles
  const combinedInputContainerStyle: StyleProp<ViewStyle> = [
    styles.inputContainer,
    variantStyles,
    sizeStyles.container,
    isDisabled && styles.disabled,
    inputContainerStyle,
  ];

  // Create padding adjustments for icons
  const paddingAdjustments: TextStyle = {};
  if (leftIcon) paddingAdjustments.paddingLeft = 0;
  if (rightIcon) paddingAdjustments.paddingRight = 0;

  const textInputStyle: StyleProp<TextStyle> = [
    styles.input,
    sizeStyles.input,
    {
      color: isDisabled ? colors.textTertiary : colors.textPrimary,
      ...paddingAdjustments,
    },
    style,
    inputStyle,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          variant="labelMedium"
          style={[styles.label, { color: error ? colors.error : colors.textSecondary }, labelStyle]}
        >
          {label}
        </Text>
      )}

      <View style={combinedInputContainerStyle}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <RNTextInput
          style={textInputStyle}
          placeholderTextColor={colors.textTertiary}
          editable={!isDisabled && !isReadOnly}
          onFocus={e => {
            setIsFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && (
        <Text variant="labelSmall" style={[styles.error, { color: colors.error }, errorStyle]}>
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text
          variant="labelSmall"
          style={[styles.helper, { color: colors.textTertiary }, helperStyle]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    paddingRight: 12,
  },
  disabled: {
    opacity: 0.6,
  },
  error: {
    marginTop: 4,
  },
  helper: {
    marginTop: 4,
  },
});

export default TextInput;
