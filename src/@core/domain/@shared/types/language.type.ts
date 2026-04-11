export const Currencies = {
    brl: "BRL",
    usd: "USD",
    eur: "EUR",
} as const;

export type Currency = typeof Currencies[keyof typeof Currencies];

export const Langs = {
    pt: {
        code: "pt",
        name: "Português",
        locale: "pt-BR",
        currency: Currencies.brl,
    },
    en: {
        code: "en",
        name: "English",
        locale: "en-US",
        currency: Currencies.usd,
    },
    es: {
        code: "es",
        name: "Español",
        locale: "es-ES",
        currency: Currencies.eur,
    },
} as const;


export type LangCode = keyof typeof Langs;
export type Lang = (typeof Langs)[LangCode];

export const LangList = Object.values(Langs);
export const LangCodes = Object.keys(Langs) as LangCode[];