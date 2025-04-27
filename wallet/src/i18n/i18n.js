import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './en.json';
import zhCNTranslation from './zh-CN.json';
import zhHKTranslation from './zh-HK.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      'zh-CN': {
        translation: zhCNTranslation,
      },
      'zh-HK': {
        translation: zhHKTranslation,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
