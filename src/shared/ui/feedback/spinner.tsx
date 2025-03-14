/**
 * Spinner component
 * Provides a consistent loading indicator
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../typography';

export type SpinnerSize = 'small' | 'large' | number;

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  label?: string;
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Spinner component with consistent styling based on the application theme
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'small',
  color,
  label,
  fullScreen = false,
  style,
}) => {
  const { colors } = useTheme();
  const spinnerColor = color || colors.primary;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {label && (
        <Text variant="bodySmall" style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
  },
  label: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Spinner;
