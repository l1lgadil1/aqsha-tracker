import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources, Language } from './locales';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const LANGUAGE_STORAGE_KEY = 'aqsha-tracker-language';

/**
 * Initializes the i18n instance with the specified language or the device's locale
 * @param language - The language to initialize i18n with
 * @returns A promise that resolves when i18n is initialized
 */
export const initializeI18n = async (language?: Language): Promise<void> => {
  // Try to get the language from AsyncStorage if not provided
  if (!language) {
    try {
      language = (await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)) as Language;
    } catch (error) {
      console.error('Error retrieving language from AsyncStorage:', error);
    }
  }

  // If still no language, use the device's locale or default to English
  if (!language) {
    const deviceLocale = Localization.locale.split('-')[0];
    language = (Object.keys(resources).includes(deviceLocale) ? deviceLocale : 'en') as Language;
  }

  // Initialize i18next
  await i18next.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

  return Promise.resolve();
};

/**
 * Changes the language and persists it to AsyncStorage
 * @param language - The language to change to
 * @returns A promise that resolves when the language is changed
 */
export const changeLanguage = async (language: Language): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    await i18next.changeLanguage(language);
    return Promise.resolve();
  } catch (error) {
    console.error('Error changing language:', error);
    return Promise.reject(error);
  }
};

/**
 * Gets the current language
 * @returns The current language
 */
export const getCurrentLanguage = (): Language => {
  return i18next.language as Language;
};

export default i18next;
