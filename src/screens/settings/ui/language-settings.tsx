import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { useTranslation, LanguageSelector } from '../../../shared/ui/localization';
import { useTheme } from '../../../shared/ui/theme';

interface LanguageSettingsProps {
  /**
   * Optional callback to be called when the language is changed
   */
  onLanguageChange?: () => void;
}

/**
 * A component that displays language settings
 */
export const LanguageSettings: React.FC<LanguageSettingsProps> = ({ onLanguageChange }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ThemedText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('settings.language')}
        </ThemedText>
        <ThemedText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          {t('settings.languages.description', undefined, 'Select your preferred language')}
        </ThemedText>
        <View style={styles.languageSelectorContainer}>
          <LanguageSelector
            onLanguageChange={() => {
              onLanguageChange?.();
            }}
          />
        </View>
      </View>
    </View>
  );
};

// Themed Text component
const ThemedText = ({ style, children }: { style?: any; children: React.ReactNode }) => {
  const { colors } = useTheme();
  return <RNText style={[{ color: colors.textPrimary }, style]}>{children}</RNText>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  languageSelectorContainer: {
    marginTop: 8,
  },
});
