/**
 * Container component
 * Provides a consistent container for screen content with safe area insets
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, StatusBar, StatusBarStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

export type ContainerVariant = 'default' | 'primary' | 'secondary';

export interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  variant?: ContainerVariant;
  useSafeArea?: boolean;
  statusBarStyle?: StatusBarStyle;
  statusBarColor?: string;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

/**
 * Container component with consistent styling based on the application theme
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  contentStyle,
  variant = 'default',
  useSafeArea = true,
  statusBarStyle,
  statusBarColor,
  edges = ['top', 'right', 'bottom', 'left'],
}) => {
  const { colors, spacing } = useTheme();

  // Determine background color based on variant
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.backgroundSecondary;
      case 'default':
      default:
        return colors.background;
    }
  };

  // Determine status bar style based on variant
  const getStatusBarStyle = (): StatusBarStyle => {
    if (statusBarStyle) return statusBarStyle;

    switch (variant) {
      case 'primary':
        return 'light-content';
      case 'secondary':
      case 'default':
      default:
        return 'dark-content';
    }
  };

  const backgroundColor = getBackgroundColor();
  const containerStyle: StyleProp<ViewStyle> = [styles.container, { backgroundColor }, style];

  const content = (
    <>
      <StatusBar
        barStyle={getStatusBarStyle()}
        backgroundColor={statusBarColor || backgroundColor}
        translucent
      />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </>
  );

  // Use SafeAreaView if useSafeArea is true
  if (useSafeArea) {
    return (
      <SafeAreaView style={containerStyle} edges={edges}>
        {content}
      </SafeAreaView>
    );
  }

  return <View style={containerStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Container;
