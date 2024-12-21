import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en, it } from 'translations';

import Locale from 'enums/Locale';

i18n.use(initReactI18next).init({
  lng: 'en',
  compatibilityJSON: 'v3',
  resources: {
    en: {
      translation: en,
    },
    it: {
      translation: it,
    },
  },
  keySeparator: false,
  nsSeparator: false,
  fallbackLng: Locale.EN,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
