import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';

/**
 * Extended useTranslation hook that provides additional functionality
 * @returns The translation functions and utilities
 */
export const useTranslation = () => {
  const { t, i18n, ...rest } = useI18nTranslation();

  /**
   * Translates a key with parameters and handles fallbacks
   * @param key - The translation key
   * @param params - Optional parameters for the translation
   * @param fallback - Optional fallback text if the key is not found
   * @returns The translated text
   */
  const translate = useCallback(
    (key: string, params?: Record<string, any>, fallback?: string) => {
      const translation = t(key, params);

      // If the translation is the same as the key, it means the key was not found
      // In that case, return the fallback if provided
      if (translation === key && fallback) {
        return fallback;
      }

      return translation;
    },
    [t],
  );

  /**
   * Formats a number according to the current locale
   * @param value - The number to format
   * @param options - Optional formatting options
   * @returns The formatted number as a string
   */
  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(i18n.language, options).format(value);
    },
    [i18n.language],
  );

  /**
   * Formats a date according to the current locale
   * @param date - The date to format
   * @param options - Optional formatting options
   * @returns The formatted date as a string
   */
  const formatDate = useCallback(
    (date: Date | number, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(i18n.language, options).format(date);
    },
    [i18n.language],
  );

  /**
   * Formats a currency value according to the current locale
   * @param value - The value to format
   * @param currency - The currency code (e.g., 'USD', 'EUR')
   * @returns The formatted currency as a string
   */
  const formatCurrency = useCallback(
    (value: number, currency: string = 'USD') => {
      return new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency,
      }).format(value);
    },
    [i18n.language],
  );

  return {
    t: translate,
    i18n,
    formatNumber,
    formatDate,
    formatCurrency,
    ...rest,
  };
};
