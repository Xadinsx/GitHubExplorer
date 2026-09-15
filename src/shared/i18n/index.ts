import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import en from './en';
import pt from './pt';

const deviceLanguage = getLocales()[0]?.languageCode;
const lng = deviceLanguage === 'pt' ? 'pt' : 'en';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

const interpolation = {
  escapeValue: false,
};

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng,
  fallbackLng: 'en',
  resources,
  interpolation,
});

export default i18n;
