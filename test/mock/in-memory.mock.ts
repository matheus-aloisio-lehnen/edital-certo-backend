import { currency } from "@domain/@shared/type/language.type";
import { billingCycle } from "@product/constant/billing-cycle.constant";
import { featureKey } from "@product/constant/feature-key.constant";
import { priceKey } from "@product/constant/price-key.constant";
import { quotaRenewalCycle } from "@product/constant/quota-renewal-cycle.constant";
import { CreateFeatureProps } from "@product/props/create-feature.props";
import { CreatePlanProps } from "@product/props/create-plan.props";
import { planKey } from "@product/constant/plan-key.constant";
import { discountDuration, discountType } from "@product/constant/discount.constant";
import { CreateDiscountProps } from "@product/props/create-discount.props";
import { CreatePriceProps } from "@product/props/create-price.props";
import { FeatureModel } from "@persistence/database/postgres/typeorm/model/product/feature.model";
import { DiscountModel } from "@persistence/database/postgres/typeorm/model/product/discount.model";
import { PriceModel } from "@persistence/database/postgres/typeorm/model/product/price.model";
import { PlanModel } from "@persistence/database/postgres/typeorm/model/product/plan.model";

export const MockCreatePlans: CreatePlanProps[] = [
    {
        name: "Plano Free",
        key: planKey.free,
        features: [
            {
                name: "Biblioteca de editais",
                key: featureKey.library,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                name: "Resumo de editais",
                key: featureKey.summary,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: -1,
            },
            {
                name: "Escrita assistida",
                key: featureKey.write,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 3,
            },
            {
                name: "Avaliação de projetos",
                key: featureKey.evaluate,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 3,
            },
            {
                name: "Assistente de AI",
                key: featureKey.aiHelp,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 0,
            },
            {
                name: "Calendário",
                key: featureKey.calendar,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
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
                name: "Biblioteca de editais",
                key: featureKey.library,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                name: "Resumo de editais",
                key: featureKey.summary,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: -1,
            },
            {
                name: "Escrita assistida",
                key: featureKey.write,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 15,
            },
            {
                name: "Avaliação de projetos",
                key: featureKey.evaluate,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 45,
            },
            {
                name: "Assistente de AI",
                key: featureKey.aiHelp,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 100,
            },
            {
                name: "Calendário",
                key: featureKey.calendar,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
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
                name: "Biblioteca de editais",
                key: featureKey.library,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                name: "Resumo de editais",
                key: featureKey.summary,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: -1,
            },
            {
                name: "Escrita assistida",
                key: featureKey.write,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 30,
            },
            {
                name: "Avaliação de projetos",
                key: featureKey.evaluate,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 90,
            },
            {
                name: "Assistente de AI",
                key: featureKey.aiHelp,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 1000,
            },
            {
                name: "Calendário",
                key: featureKey.calendar,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
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
                name: "Biblioteca de editais",
                key: featureKey.library,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
                name: "Resumo de editais",
                key: featureKey.summary,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: -1,
            },
            {
                name: "Escrita assistida",
                key: featureKey.write,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 30,
            },
            {
                name: "Avaliação de projetos",
                key: featureKey.evaluate,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 90,
            },
            {
                name: "Assistente de AI",
                key: featureKey.aiHelp,
                quotaRenewalCycle: quotaRenewalCycle.monthly,
                hasQuota: true,
                quota: 3000,
            },
            {
                name: "Calendário",
                key: featureKey.calendar,
                quotaRenewalCycle: quotaRenewalCycle.static,
            },
            {
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

export const MockRehydratedPlans: PlanModel[] = MockCreatePlans.map((plan, planIndex) => {
    const planId = planIndex + 1;
    const model = new PlanModel();
    model.id = planId;
    model.name = plan.name;
    model.key = plan.key;
    model.isActive = true;
    model.createdAt = new Date(`2026-01-0${planId}T00:00:00.000Z`);
    model.updatedAt = new Date(`2026-02-0${planId}T00:00:00.000Z`);
    model.externalPlanId = null;

    model.features = plan.features.map((feature, featureIndex) => {
        const fModel = new FeatureModel();
        fModel.id = (planIndex * 10) + featureIndex + 1;
        fModel.planId = planId;
        fModel.name = feature.name;
        fModel.key = feature.key;
        fModel.hidden = feature.hidden ?? true;
        fModel.isActive = feature.isActive ?? false;
        fModel.hasQuota = feature.hasQuota ?? false;
        fModel.quota = feature.quota ?? 0;
        fModel.quotaRenewalCycle = feature.quotaRenewalCycle;
        fModel.createdAt = new Date(`2026-01-${String(featureIndex + 1).padStart(2, '0')}T00:00:00.000Z`);
        fModel.updatedAt = new Date(`2026-02-${String(featureIndex + 1).padStart(2, '0')}T00:00:00.000Z`);
        fModel.plan = model;
        return fModel;
    });

    model.prices = plan.prices.map((price, priceIndex) => {
        const pModel = new PriceModel();
        pModel.id = (planIndex * 10) + priceIndex + 1;
        pModel.planId = planId;
        pModel.key = price.key;
        pModel.billingCycle = price.billingCycle;
        pModel.currency = price.currency;
        pModel.value = price.value;
        pModel.isActive = true;
        pModel.externalPriceId = null;
        pModel.createdAt = new Date(`2026-01-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`);
        pModel.updatedAt = new Date(`2026-02-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`);
        pModel.plan = model;

        if (price.discount) {
            const dModel = new DiscountModel();
            dModel.id = (planIndex * 100) + priceIndex + 1;
            dModel.priceId = pModel.id;
            dModel.key = price.discount.key;
            dModel.name = price.discount.name;
            dModel.value = price.discount.value;
            dModel.type = price.discount.type;
            dModel.duration = price.discount.duration;
            dModel.count = price.discount.count ?? null;
            dModel.campaignStartsAt = price.discount.campaignStartsAt;
            dModel.campaignEndsAt = price.discount.campaignEndsAt;
            dModel.externalDiscountId = price.discount.externalDiscountId ?? null;
            dModel.createdAt = new Date(`2026-03-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`);
            dModel.updatedAt = new Date(`2026-04-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`);
            dModel.deletedAt = null;
            dModel.price = pModel;
            pModel.discounts = [dModel];
        } else {
            pModel.discounts = [];
        }

        return pModel;
    });

    return model;
});

export const MockCreateInputPlans: CreatePlanProps[] = MockCreatePlans;

export const MockFeatureInput: CreateFeatureProps = {
    name: 'AI Help',
    key: featureKey.aiHelp,
    planId: 1,
    quotaRenewalCycle: quotaRenewalCycle.monthly,
    hasQuota: true,
    quota: 50,
};

export const MockFeatureInputList: CreateFeatureProps[] = [
    {
        name: 'F1',
        key: featureKey.calendar,
        planId: 1,
        quotaRenewalCycle: quotaRenewalCycle.monthly,
    },
    {
        name: 'F2',
        key: featureKey.summary,
        planId: 1,
        quotaRenewalCycle: quotaRenewalCycle.monthly,
        hasQuota: true,
        quota: -1,
    },
];

export const MockFeature: FeatureModel = {
    id: 1,
    planId: 1,
    name: 'AI Help',
    key: featureKey.aiHelp,
    hidden: false,
    isActive: true,
    hasQuota: true,
    quota: 50,
    quotaRenewalCycle: quotaRenewalCycle.monthly,
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    plan: null as any,
} as FeatureModel;

export const MockDiscount: DiscountModel = {
    id: 1,
    priceId: 1,
    key: 'SUMMER_SALE',
    name: 'Summer Sale',
    type: discountType.percent,
    value: 20,
    duration: discountDuration.once,
    count: null,
    campaignStartsAt: new Date('2026-06-01T00:00:00.000Z'),
    campaignEndsAt: new Date('2026-08-31T23:59:59.000Z'),
    externalDiscountId: 'ext_123',
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    deletedAt: null,
    price: null as any,
} as DiscountModel;

export const MockPrice: PriceModel = {
    id: 1,
    planId: 1,
    key: priceKey.startMonthlyBrl,
    currency: currency.brl,
    billingCycle: billingCycle.monthly,
    value: 2999,
    discounts: [MockDiscount],
    externalPriceId: 'ext_price_123',
    isActive: true,
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    plan: null as any,
} as PriceModel;

export const MockPlan: PlanModel = {
    id: 1,
    key: planKey.free,
    name: "Plano Free",
    isActive: true,
    externalPlanId: null,
    features: [MockFeature],
    prices: [MockPrice],
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
} as PlanModel;

export const MockDiscountInput: CreateDiscountProps = {
    priceId: 1,
    key: 'SUMMER_SALE',
    name: 'Summer Sale',
    type: discountType.percent,
    value: 20,
    duration: discountDuration.once,
    campaignStartsAt: new Date('2026-06-01T00:00:00.000Z'),
    campaignEndsAt: new Date('2026-08-31T23:59:59.000Z'),
    externalDiscountId: 'ext_123'
};

export const MockPriceInput: CreatePriceProps = {
    planId: 1,
    key: priceKey.startMonthlyBrl,
    currency: currency.brl,
    billingCycle: billingCycle.monthly,
    value: 2999,
    externalPriceId: 'price_123',
    discount: {
        key: 'PROMO10',
        name: 'Promo 10%',
        type: discountType.percent,
        value: 10,
        duration: discountDuration.once,
        campaignStartsAt: new Date('2026-01-01'),
        campaignEndsAt: new Date('2026-12-31'),
    }
};

export const MockPagination = {
    offset: 0,
    limit: 20,
    orderBy: "prices.discounts.key",
    sortOrder: "ASC",
    start: "2025-02-01",
    end: "2025-03-31",
    where: {
        key: { op: "in", args: ["free", "start", "pro"] },
        name: { op: "ilike", args: "%Plano%" },
        "prices.key": { op: "like", args: "%YEARLY%" },
        "prices.currency": "BRL",
        "prices.value": { op: "gte", args: 1000 },
        "prices.discounts.key": { op: "ilike", args: "%OFF%" },
        "prices.discounts.value": { op: "between", args: [10, 30] },
        "prices.discounts.campaignStartsAt": {
            op: "between",
            args: ["2025-02-28", "2025-03-30"],
        },
        "prices.discounts.externalDiscountId": null,
        isActive: true,
    },
};