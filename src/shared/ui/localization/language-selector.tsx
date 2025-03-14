import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalization } from './localization-context';
import { Language } from '../../config/i18n';
import { useTheme } from '../theme';

interface LanguageSelectorProps {
  /**
   * Optional callback to be called when the language is changed
   */
  onLanguageChange?: (language: Language) => void;
}

/**
 * A component that displays a list of available languages and allows the user to select one
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { t } = useTranslation();
  const { language, availableLanguages, setLanguage } = useLocalization();
  const { colors } = useTheme();

  const handleLanguageChange = async (newLanguage: Language) => {
    await setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <View style={styles.container}>
      {Object.entries(availableLanguages).map(([langCode, langName]) => (
        <TouchableOpacity
          key={langCode}
          style={[
            styles.languageButton,
            {
              backgroundColor: language === langCode ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => handleLanguageChange(langCode as Language)}
        >
          <View style={styles.languageContent}>
            <View style={styles.languageTextContainer}>
              <ThemedText
                style={[
                  styles.languageName,
                  {
                    color: language === langCode ? colors.textInverted : colors.textPrimary,
                    fontWeight: language === langCode ? 'bold' : 'normal',
                  },
                ]}
              >
                {langName}
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      ))}
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
  languageButton: {
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
  },
});
