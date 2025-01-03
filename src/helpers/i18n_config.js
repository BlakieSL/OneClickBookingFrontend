import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const initI18n = async () => {
    await i18n
        .use(HttpBackend)
        .use(initReactI18next)
        .init({
            fallbackLng: 'en',
            supportedLngs: ['en', 'pl', 'ru'],
            backend: {
                loadPath: '/locales/{{lng}}/translation.json',
            },
            interpolation: {
                escapeValue: false,
            },
        });
};
(async () => {
    try {
        await initI18n();
        console.log('i18n initialized successfully');
    } catch (error) {
        console.error('i18n initialization failed:', error);
    }
})();


export default i18n;
