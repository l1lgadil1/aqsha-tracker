import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  changeLanguage,
  getCurrentLanguage,
  initializeI18n,
  Language,
  availableLanguages,
} from '../../config/i18n';

interface LocalizationContextType {
  /**
   * The current language
   */
  language: Language;

  /**
   * Available languages with their display names
   */
  availableLanguages: Record<Language, string>;

  /**
   * Changes the application language
   * @param language - The language to change to
   */
  setLanguage: (language: Language) => Promise<void>;

  /**
   * Whether the localization is initialized
   */
  isInitialized: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

/**
 * Provider component for localization
 * Manages the language state and provides methods to change it
 */
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize i18n when the component mounts
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeI18n();
        setLanguageState(getCurrentLanguage());
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // Fallback to English if initialization fails
        setLanguageState('en');
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  // Function to change the language
  const setLanguage = async (newLanguage: Language) => {
    try {
      await changeLanguage(newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const value = {
    language,
    availableLanguages,
    setLanguage,
    isInitialized,
  };

  // Don't render children until i18n is initialized
  if (!isInitialized) {
    return null;
  }

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
};

/**
 * Hook to use the localization context
 * @returns The localization context
 * @throws Error if used outside of LocalizationProvider
 */
export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);

  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }

  return context;
};
