/**
 * Spacer component
 * Provides a flexible spacer for layout adjustments
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;

export interface SpacerProps {
  size?: SpacerSize;
  horizontal?: boolean;
  flex?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Spacer component with consistent sizing based on the application theme
 */
export const Spacer: React.FC<SpacerProps> = ({ size = 'md', horizontal = false, flex, style }) => {
  const { spacing } = useTheme();

  // Get size value from theme spacing or use custom number
  const getSize = (): number => {
    if (typeof size === 'number') return size;

    switch (size) {
      case 'xs':
        return spacing.xs;
      case 'sm':
        return spacing.sm;
      case 'md':
        return spacing.md;
      case 'lg':
        return spacing.lg;
      case 'xl':
        return spacing.xl;
      case 'xxl':
        return spacing.xxl;
      default:
        return spacing.md;
    }
  };

  const spacerSize = getSize();
  const spacerStyle: StyleProp<ViewStyle> = [
    horizontal ? { width: spacerSize, height: '100%' } : { height: spacerSize, width: '100%' },
    flex !== undefined && { flex },
    style,
  ];

  return <View style={spacerStyle} />;
};

export default Spacer;
