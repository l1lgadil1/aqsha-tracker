/**
 * CardFooter component
 * Provides a consistent footer for Card components
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export interface CardFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  divider?: boolean;
}

/**
 * CardFooter component with consistent styling based on the application theme
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
  contentStyle,
  divider = true,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {divider && <View style={[styles.divider, { backgroundColor: colors.divider }]} />}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default CardFooter;
