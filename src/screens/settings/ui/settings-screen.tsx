import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useTheme, ThemeToggle } from '../../../shared/ui/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation, LanguageSelector } from '../../../shared/ui/localization';
import { SettingsHeader, SettingsSection, SettingsCard } from './settings-components';

/**
 * Settings screen component
 * Allows users to configure app settings including theme and language
 */
export const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SettingsHeader title={t('settings.title')} />

        {/* Appearance Section */}
        <SettingsSection title={t('settings.appearance')}>
          {/* Theme Setting */}
          <SettingsCard 
            title={t('settings.theme')}
            description={t('settings.themes.description', undefined, 'Choose between light, dark, or system theme')}
          >
            <ThemeToggle />
          </SettingsCard>
          
          {/* Language Setting */}
          <SettingsCard 
            title={t('settings.language')}
            description={t('settings.languages.description', undefined, 'Select your preferred language')}
          >
            <LanguageSelector />
          </SettingsCard>
        </SettingsSection>

        {/* General Section */}
        <SettingsSection title={t('settings.general')}>
          {/* Currency Setting */}
          <SettingsCard 
            title={t('settings.currency')}
            description={t('settings.currencies.description', undefined, 'Select your preferred currency')}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title={t('settings.about')}>
          <SettingsCard 
            title="AqshaTracker"
            description="Version 1.0.0"
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});

export default SettingsScreen;
