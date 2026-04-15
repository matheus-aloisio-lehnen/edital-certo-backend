export const priceKey = {
    freeMonthlyBrl: "FREE_MONTHLY_BRL",
    freeMonthlyUsd: "FREE_MONTHLY_USD",
    freeMonthlyEur: "FREE_MONTHLY_EUR",
    freeYearlyBrl: "FREE_YEARLY_BRL",
    freeYearlyUsd: "FREE_YEARLY_USD",
    freeYearlyEur: "FREE_YEARLY_EUR",

    startMonthlyBrl: "START_MONTHLY_BRL",
    startMonthlyUsd: "START_MONTHLY_USD",
    startMonthlyEur: "START_MONTHLY_EUR",
    startYearlyBrl: "START_YEARLY_BRL",
    startYearlyUsd: "START_YEARLY_USD",
    startYearlyEur: "START_YEARLY_EUR",

    proMonthlyBrl: "PRO_MONTHLY_BRL",
    proMonthlyUsd: "PRO_MONTHLY_USD",
    proMonthlyEur: "PRO_MONTHLY_EUR",
    proYearlyBrl: "PRO_YEARLY_BRL",
    proYearlyUsd: "PRO_YEARLY_USD",
    proYearlyEur: "PRO_YEARLY_EUR",

    teamsMonthlyBrl: "TEAMS_MONTHLY_BRL",
    teamsMonthlyUsd: "TEAMS_MONTHLY_USD",
    teamsMonthlyEur: "TEAMS_MONTHLY_EUR",
    teamsYearlyBrl: "TEAMS_YEARLY_BRL",
    teamsYearlyUsd: "TEAMS_YEARLY_USD",
    teamsYearlyEur: "TEAMS_YEARLY_EUR",
} as const;

export type PriceKey = typeof priceKey[keyof typeof priceKey];