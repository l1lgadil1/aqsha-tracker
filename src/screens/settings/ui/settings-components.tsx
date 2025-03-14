import React, { ReactNode } from 'react';
import { View, Text as RNText, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../shared/ui/theme';

/**
 * Text component with theme-aware styling
 */
export const ThemedText: React.FC<{
  style?: TextStyle | TextStyle[];
  children: ReactNode;
  variant?: 'header' | 'section' | 'title' | 'description';
}> = ({ style, children, variant }) => {
  const { colors } = useTheme();

  let variantStyle: TextStyle = {};
  let variantColor = colors.textPrimary;

  switch (variant) {
    case 'header':
      variantStyle = styles.headerText;
      break;
    case 'section':
      variantStyle = styles.sectionText;
      break;
    case 'title':
      variantStyle = styles.titleText;
      break;
    case 'description':
      variantStyle = styles.descriptionText;
      variantColor = colors.textSecondary;
      break;
  }

  return <RNText style={[{ color: variantColor }, variantStyle, style]}>{children}</RNText>;
};

/**
 * Section component for grouping related settings
 */
export const SettingsSection: React.FC<{
  title: string;
  children: ReactNode;
  style?: ViewStyle;
}> = ({ title, children, style }) => {
  return (
    <View style={[styles.section, style]}>
      <ThemedText variant="section">{title}</ThemedText>
      {children}
    </View>
  );
};

/**
 * Card component for individual settings
 */
export const SettingsCard: React.FC<{
  title: string;
  description?: string;
  children?: ReactNode;
  style?: ViewStyle;
}> = ({ title, description, children, style }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <ThemedText variant="title">{title}</ThemedText>
      {description && <ThemedText variant="description">{description}</ThemedText>}
      {children && <View style={styles.settingControl}>{children}</View>}
    </View>
  );
};

/**
 * Header component for the settings screen
 */
export const SettingsHeader: React.FC<{
  title: string;
  style?: ViewStyle;
}> = ({ title, style }) => {
  return (
    <View style={[styles.header, style]}>
      <ThemedText variant="header">{title}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  header: {
    marginBottom: 24,
  },
  settingControl: {
    marginTop: 16,
  },
  // Text variants
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    marginBottom: 16,
  },
});
