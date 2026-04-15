import { currency } from "@domain/@shared/type/language.type";
import { billingCycle } from "@domain/product/constant/billing-cycle.constant";
import { featureKey } from "@domain/product/constant/feature-key.constant";
import { priceKey } from "@domain/product/constant/price-key.constant";
import { quotaRenewalCycle } from "@domain/product/constant/quota-renewal-cycle.constant";
import { CreateFeatureProps } from "@domain/product/props/create-feature.props";
import { CreatePlanProps } from "@domain/product/props/create-plan.props";
import { planKey } from "@domain/product/constant/plan-key.constant";
import { discountDuration, discountType } from "@domain/product/constant/discount.constant";

export const MockCreatePlans: CreatePlanProps[] = [
    {
        name: "Plano Free",
        key: planKey.free,
        features: [
            {
                order: 1,
                name: "Biblioteca de editais",
                key: featureKey.library,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                order: 2,
                name: "Resumo de editais",
                key: featureKey.summary,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: -1,
            },
            {
                order: 3,
                name: "Escrita assistida",
                key: featureKey.write,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 3,
            },
            {
                order: 4,
                name: "Avaliação de projetos",
                key: featureKey.evaluate,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 3,
            },
            {
                order: 5,
                name: "Assistente de AI",
                key: featureKey.aiHelp,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 0,
            },
            {
                order: 6,
                name: "Calendário",
                key: featureKey.calendar,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                order: 7,
                name: "Usuários",
                key: featureKey.multiUser,
                quotaRenewalCycle: quotaRenewalCycle.static,
                hasQuota: true,
                quota: 1,
            },
        ],
        prices: [
            {
                key: priceKey.freeMonthlyBrl,
                billingCycle: billingCycle.monthly,
                currency: currency.brl,
                value: 0,
            },
            {
                key: priceKey.freeYearlyBrl,
                billingCycle: billingCycle.yearly,
                currency: currency.brl,
                value: 0,
            },
            {
                key: priceKey.freeMonthlyUsd,
                billingCycle: billingCycle.monthly,
                currency: currency.usd,
                value: 0,
            },
            {
                key: priceKey.freeYearlyUsd,
                billingCycle: billingCycle.yearly,
                currency: currency.usd,
                value: 0,
            },
            {
                key: priceKey.freeMonthlyEur,
                billingCycle: billingCycle.monthly,
                currency: currency.eur,
                value: 0,
            },
            {
                key: priceKey.freeYearlyEur,
                billingCycle: billingCycle.yearly,
                currency: currency.eur,
                value: 0,
            },
        ],
    },
    {
        name: "Plano Start",
        key: planKey.start,
        features: [
            {
                order: 1,
                name: "Biblioteca de editais",
                key: featureKey.library,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                order: 2,
                name: "Resumo de editais",
                key: featureKey.summary,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: -1,
            },
            {
                order: 3,
                name: "Escrita assistida",
                key: featureKey.write,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 15,
            },
            {
                order: 4,
                name: "Avaliação de projetos",
                key: featureKey.evaluate,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 45,
            },
            {
                order: 5,
                name: "Assistente de AI",
                key: featureKey.aiHelp,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 100,
            },
            {
                order: 6,
                name: "Calendário",
                key: featureKey.calendar,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                order: 7,
                name: "Usuários",
                key: featureKey.multiUser,
                quotaRenewalCycle: quotaRenewalCycle.static,
                hasQuota: true,
                quota: 1,
            },
        ],
        prices: [
            {
                key: priceKey.startMonthlyBrl,
                billingCycle: billingCycle.monthly,
                currency: currency.brl,
                value: 2999,
            },
            {
                key: priceKey.startYearlyBrl,
                billingCycle: billingCycle.yearly,
                currency: currency.brl,
                value: 29999,
                discount: {
                    key: "START_YEARLY_20_OFF",
                    name: "Start anual 20% OFF",
                    type: discountType.percent,
                    value: 20,
                    duration: discountDuration.once,
                    campaignStartsAt: new Date("2026-01-01T00:00:00.000Z"),
                    campaignEndsAt: new Date("2026-12-31T23:59:59.000Z"),
                },
            },
            {
                key: priceKey.startMonthlyUsd,
                billingCycle: billingCycle.monthly,
                currency: currency.usd,
                value: 599,
            },
            {
                key: priceKey.startYearlyUsd,
                billingCycle: billingCycle.yearly,
                currency: currency.usd,
                value: 5999,
            },
            {
                key: priceKey.startMonthlyEur,
                billingCycle: billingCycle.monthly,
                currency: currency.eur,
                value: 499,
            },
            {
                key: priceKey.startYearlyEur,
                billingCycle: billingCycle.yearly,
                currency: currency.eur,
                value: 4999,
            },
        ],
    },
    {
        name: "Plano Pro",
        key: planKey.pro,
        features: [
            {
                order: 1,
                name: "Biblioteca de editais",
                key: featureKey.library,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                order: 2,
                name: "Resumo de editais",
                key: featureKey.summary,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: -1,
            },
            {
                order: 3,
                name: "Escrita assistida",
                key: featureKey.write,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 30,
            },
            {
                order: 4,
                name: "Avaliação de projetos",
                key: featureKey.evaluate,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 90,
            },
            {
                order: 5,
                name: "Assistente de AI",
                key: featureKey.aiHelp,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 1000,
            },
            {
                order: 6,
                name: "Calendário",
                key: featureKey.calendar,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                order: 7,
                name: "Usuários",
                key: featureKey.multiUser,
                quotaRenewalCycle: quotaRenewalCycle.static,
                hasQuota: true,
                quota: 1,
            },
        ],
        prices: [
            {
                key: priceKey.proMonthlyBrl,
                billingCycle: billingCycle.monthly,
                currency: currency.brl,
                value: 7999,
                discount: {
                    key: "PRO_MONTHLY_1000_OFF",
                    name: "Pro mensal R$ 10 OFF",
                    type: discountType.fixed,
                    value: 1000,
                    duration: discountDuration.repeating,
                    count: 3,
                    campaignStartsAt: new Date("2026-01-01T00:00:00.000Z"),
                    campaignEndsAt: new Date("2026-12-31T23:59:59.000Z"),
                    externalDiscountId: "cpn_pro_brl_10off",
                },
            },
            {
                key: priceKey.proYearlyBrl,
                billingCycle: billingCycle.yearly,
                currency: currency.brl,
                value: 79999,
            },
            {
                key: priceKey.proMonthlyUsd,
                billingCycle: billingCycle.monthly,
                currency: currency.usd,
                value: 1499,
            },
            {
                key: priceKey.proYearlyUsd,
                billingCycle: billingCycle.yearly,
                currency: currency.usd,
                value: 14999,
            },
            {
                key: priceKey.proMonthlyEur,
                billingCycle: billingCycle.monthly,
                currency: currency.eur,
                value: 1299,
            },
            {
                key: priceKey.proYearlyEur,
                billingCycle: billingCycle.yearly,
                currency: currency.eur,
                value: 12999,
            },
        ],
    },
    {
        name: "Plano Teams",
        key: planKey.teams,
        features: [
            {
                order: 1,
                name: "Biblioteca de editais",
                key: featureKey.library,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                order: 2,
                name: "Resumo de editais",
                key: featureKey.summary,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: -1,
            },
            {
                order: 3,
                name: "Escrita assistida",
                key: featureKey.write,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 30,
            },
            {
                order: 4,
                name: "Avaliação de projetos",
                key: featureKey.evaluate,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 90,
            },
            {
                order: 5,
                name: "Assistente de AI",
                key: featureKey.aiHelp,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 3000,
            },
            {
                order: 6,
                name: "Calendário",
                key: featureKey.calendar,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                order: 7,
                name: "Usuários",
                key: featureKey.multiUser,
                quotaRenewalCycle: quotaRenewalCycle.static,
                hasQuota: true,
                quota: -1,
            },
        ],
        prices: [
            {
                key: priceKey.teamsMonthlyBrl,
                billingCycle: billingCycle.monthly,
                currency: currency.brl,
                value: 11999,
            },
            {
                key: priceKey.teamsYearlyBrl,
                billingCycle: billingCycle.yearly,
                currency: currency.brl,
                value: 119999,
            },
            {
                key: priceKey.teamsMonthlyUsd,
                billingCycle: billingCycle.monthly,
                currency: currency.usd,
                value: 2199,
            },
            {
                key: priceKey.teamsYearlyUsd,
                billingCycle: billingCycle.yearly,
                currency: currency.usd,
                value: 21999,
            },
            {
                key: priceKey.teamsMonthlyEur,
                billingCycle: billingCycle.monthly,
                currency: currency.eur,
                value: 1999,
                discount: {
                    key: "TEAMS_EUR_LAUNCH",
                    name: "Teams launch EUR",
                    type: discountType.percent,
                    value: 15,
                    duration: discountDuration.forever,
                    campaignStartsAt: new Date("2026-01-01T00:00:00.000Z"),
                    campaignEndsAt: new Date("2026-12-31T23:59:59.000Z"),
                    externalDiscountId: "promo_teams_eur_launch",
                },
            },
            {
                key: priceKey.teamsYearlyEur,
                billingCycle: billingCycle.yearly,
                currency: currency.eur,
                value: 19999,
            },
        ],
    },
];

export const MockRehydratedPlans = MockCreatePlans.map((plan, planIndex) => ({
    id: planIndex + 1,
    name: plan.name,
    key: plan.key,
    isActive: true,
    createdAt: new Date(`2026-01-0${planIndex + 1}T00:00:00.000Z`),
    updatedAt: new Date(`2026-02-0${planIndex + 1}T00:00:00.000Z`),
    deletedAt: null,
    features: plan.features.map((feature, featureIndex) => ({
        id: (planIndex * 10) + featureIndex + 1,
        planId: planIndex + 1,
        order: feature.order,
        name: feature.name,
        key: feature.key,
        hidden: feature.hidden ?? true,
        isActive: feature.isActive ?? false,
        hasQuota: feature.hasQuota ?? false,
        quota: feature.quota ?? 0,
        quotaRenewalCycle: feature.quotaRenewalCycle,
        createdAt: new Date(`2026-01-${String(featureIndex + 1).padStart(2, '0')}T00:00:00.000Z`),
        updatedAt: new Date(`2026-02-${String(featureIndex + 1).padStart(2, '0')}T00:00:00.000Z`),
        deletedAt: null,
    })),
    prices: plan.prices.map((price, priceIndex) => ({
        id: (planIndex * 10) + priceIndex + 1,
        planId: planIndex + 1,
        key: price.key,
        billingCycle: price.billingCycle,
        currency: price.currency,
        value: {
            amount: price.value,
            code: price.currency,
        },
        discount: price.discount ? {
            id: (planIndex * 100) + priceIndex + 1,
            priceId: (planIndex * 10) + priceIndex + 1,
            key: price.discount.key,
            name: price.discount.name,
            value: price.discount.value,
            type: price.discount.type,
            duration: price.discount.duration,
            count: price.discount.count ?? null,
            campaignStartsAt: price.discount.campaignStartsAt,
            campaignEndsAt: price.discount.campaignEndsAt,
            externalDiscountId: price.discount.externalDiscountId ?? null,
            createdAt: new Date(`2026-03-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`),
            updatedAt: new Date(`2026-04-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`),
            deletedAt: null,
        } : null,
        isActive: true,
        createdAt: new Date(`2026-01-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`),
        updatedAt: new Date(`2026-02-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`),
        deletedAt: null,
    })),
}));

export const MockCreateInputPlans: CreatePlanProps[] = MockCreatePlans;

export const MockFeatureInput: CreateFeatureProps = {
    name: 'AI Help',
    key: featureKey.aiHelp,
    order: 1,
    planId: 1,
    quotaRenewalCycle: quotaRenewalCycle.monthly,
    hasQuota: true,
    quota: 50,
};

type RehydratedFeature = CreateFeatureProps & {
    id: number;
    hidden: boolean;
    isActive: boolean;
    hasQuota: boolean;
    quota: number;
};

export const MockFeature: RehydratedFeature = {
    id: 1,
    name: 'AI Help',
    key: featureKey.aiHelp,
    order: 1,
    planId: 1,
    hidden: false,
    isActive: true,
    hasQuota: true,
    quota: 50,
    quotaRenewalCycle: quotaRenewalCycle.monthly,
};

export const MockFeatureInputList: CreateFeatureProps[] = [
    {
        name: 'F1',
        key: featureKey.calendar,
        order: 1,
        planId: 1,
        quotaRenewalCycle: quotaRenewalCycle.monthly,
    },
    {
        name: 'F2',
        key: featureKey.summary,
        order: 2,
        planId: 1,
        quotaRenewalCycle: quotaRenewalCycle.monthly,
        hasQuota: true,
        quota: -1,
    },
];

export const MockFeatureList: RehydratedFeature[] = [
    {
        ...MockFeature,
        id: 10,
    },
    {
        ...MockFeature,
        id: 20,
        name: 'Multi User',
        key: featureKey.multiUser,
        order: 2,
    },
];