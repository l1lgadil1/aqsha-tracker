/**
 * Column component
 * Provides a consistent column layout with various alignment options
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ViewProps } from 'react-native';
import { useTheme } from '../theme';

export type ColumnAlignment =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type ColumnCrossAlignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type ColumnSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ColumnProps extends ViewProps {
  children: React.ReactNode;
  align?: ColumnAlignment;
  crossAlign?: ColumnCrossAlignment;
  spacing?: ColumnSpacing;
  reverse?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Column component with consistent styling based on the application theme
 */
export const Column: React.FC<ColumnProps> = ({
  children,
  align = 'start',
  crossAlign = 'stretch',
  spacing = 'none',
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
        return 'stretch';
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

  const columnStyle: StyleProp<ViewStyle> = [
    styles.column,
    {
      flexDirection: reverse ? 'column-reverse' : 'column',
      justifyContent: getJustifyContent(),
      alignItems: getAlignItems(),
      gap: getGap(),
    },
    style,
  ];

  return (
    <View style={columnStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    display: 'flex',
  },
});

export default Column;
