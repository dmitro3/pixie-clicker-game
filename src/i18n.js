import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationRU from './locales/ru/translation.json';
import translationUK from './locales/uk/translation.json';
import translationFA from './locales/fa/translation.json';
import translationFR from './locales/fr/translation.json';

const resources = {
    en: {
        translation: translationEN
    },
    ru: {
        translation: translationRU
    },
    uk: {
        translation: translationUK
    },
    fa: {
        translation: translationFA
    },
    fr: {
        translation: translationFR
    }
};

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false // React уже экранирует
        }
    });

export default i18n;
