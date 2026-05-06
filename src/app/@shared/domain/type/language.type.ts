export const languageConfig = {
    pt: {
        code: "pt", // ISO 639-1
        name: "Português",
        locale: "pt-BR", // BCP 47 (pt + BR)
        currency: "BRL", // ISO 4217
    },
    en: {
        code: "en",
        name: "English",
        locale: "en-US",
        currency: "USD",
    },
    es: {
        code: "es",
        name: "Español",
        locale: "es-ES",
        currency: "EUR",
    },
} as const;

export type LanguageCode = keyof typeof languageConfig;
export type Language = (typeof languageConfig)[LanguageCode];
export type Locale = Language["locale"];
export type Currency = Language["currency"];

export const languageList = Object.values(languageConfig);
export const languageCodes = Object.keys(languageConfig) as LanguageCode[];
