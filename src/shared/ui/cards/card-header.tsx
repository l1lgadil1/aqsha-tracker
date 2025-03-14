/**
 * CardHeader component
 * Provides a consistent header for Card components
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../typography';
import { useTheme } from '../theme';

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

/**
 * CardHeader component with consistent styling based on the application theme
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContent}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <View style={styles.titleContainer}>
          <Text variant="headingSmall" style={[styles.title, titleStyle]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              variant="bodySmall"
              style={[styles.subtitle, { color: colors.textSecondary }, subtitleStyle]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    flexShrink: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
});

export default CardHeader;
