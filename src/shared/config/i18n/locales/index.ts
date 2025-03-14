import { en } from './en';
import { ru } from './ru';

export const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

export type Language = 'en' | 'ru';

export const availableLanguages: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
};
