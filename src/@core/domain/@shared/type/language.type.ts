// ISO 4217 — Currency codes
export const currency = {
    brl: "BRL",
    usd: "USD",
    eur: "EUR",
} as const;

export type Currency = typeof currency[keyof typeof currency];

export const langs = {
    pt: {
        code: "pt", // ISO 639-1
        name: "Português",
        locale: "pt-BR", // BCP 47 (pt + BR)
        currency: currency.brl,
    },
    en: {
        code: "en",
        name: "English",
        locale: "en-US",
        currency: currency.usd,
    },
    es: {
        code: "es",
        name: "Español",
        locale: "es-ES",
        currency: currency.eur,
    },
} as const;


export type LangCode = keyof typeof langs;
export type Lang = (typeof langs)[LangCode];

export const LangList = Object.values(langs);
export const LangCodes = Object.keys(langs) as LangCode[];