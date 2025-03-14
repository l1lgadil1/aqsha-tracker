/**
 * Row component
 * Provides a consistent row layout with various alignment options
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ViewProps } from 'react-native';
import { useTheme } from '../theme';

export type RowAlignment =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type RowCrossAlignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type RowSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface RowProps extends ViewProps {
  children: React.ReactNode;
  align?: RowAlignment;
  crossAlign?: RowCrossAlignment;
  spacing?: RowSpacing;
  wrap?: boolean;
  reverse?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Row component with consistent styling based on the application theme
 */
export const Row: React.FC<RowProps> = ({
  children,
  align = 'start',
  crossAlign = 'center',
  spacing = 'none',
  wrap = false,
  reverse = false,
  style,
  ...props
}) => {
  const { spacing: themeSpacing } = useTheme();

  // Map alignment values to flexbox properties
  const getJustifyContent = (): ViewStyle['justifyContent'] => {
    switch (align) {
      case 'start':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'end':
        return 'flex-end';
      case 'space-between':
        return 'space-between';
      case 'space-around':
        return 'space-around';
      case 'space-evenly':
        return 'space-evenly';
      default:
        return 'flex-start';
    }
  };

  // Map cross alignment values to flexbox properties
  const getAlignItems = (): ViewStyle['alignItems'] => {
    switch (crossAlign) {
      case 'start':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'end':
        return 'flex-end';
      case 'stretch':
        return 'stretch';
      case 'baseline':
        return 'baseline';
      default:
        return 'center';
    }
  };

  // Get gap value from theme spacing
  const getGap = (): number => {
    switch (spacing) {
      case 'none':
        return 0;
      case 'xs':
        return themeSpacing.xs;
      case 'sm':
        return themeSpacing.sm;
      case 'md':
        return themeSpacing.md;
      case 'lg':
        return themeSpacing.lg;
      case 'xl':
        return themeSpacing.xl;
      default:
        return 0;
    }
  };

  const rowStyle: StyleProp<ViewStyle> = [
    styles.row,
    {
      flexDirection: reverse ? 'row-reverse' : 'row',
      justifyContent: getJustifyContent(),
      alignItems: getAlignItems(),
      flexWrap: wrap ? 'wrap' : 'nowrap',
      gap: getGap(),
    },
    style,
  ];

  return (
    <View style={rowStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
  },
});

export default Row;
