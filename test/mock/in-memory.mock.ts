import { billingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { CreatePlanProps } from "@billing/domain/plan/props/create-plan.props";
import { PlanModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/plan.model";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";
import { discountDuration, discountType } from "@billing/domain/discount/constant/discount.constant";
import { CreateDiscountProps } from "@billing/domain/discount/props/create-discount.props";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";

export const MockCreatePlans: CreatePlanProps[] = [
    {
        name: "Plano Free",
        prices: [
            {
                billingCycle: billingCycle.monthly,
                value: 0,
            },
            {
                billingCycle: billingCycle.yearly,
                value: 0,
            },
        ],
    },
    {
        name: "Plano Start",
        prices: [
            {
                billingCycle: billingCycle.monthly,
                value: 2999,
            },
            {
                billingCycle: billingCycle.yearly,
                value: 29999,
                discount: {
                    name: "Start anual 20% OFF",
                    type: discountType.percent,
                    value: 20,
                    duration: discountDuration.once,
                    campaignStartsAt: new Date("2026-01-01T00:00:00.000Z"),
                    campaignEndsAt: new Date("2026-12-31T23:59:59.000Z"),
                },
            },
        ],
    },
    {
        name: "Plano Pro",
        prices: [
            {
                billingCycle: billingCycle.monthly,
                value: 7999,
                discount: {
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
                billingCycle: billingCycle.yearly,
                value: 79999,
            },
        ],
    },
    {
        name: "Plano Teams",
        prices: [
            {
                billingCycle: billingCycle.monthly,
                value: 11999,
            },
            {
                billingCycle: billingCycle.yearly,
                value: 119999,
            },
        ],
    },
];

export const MockRehydratedPlans: PlanModel[] = MockCreatePlans.map((plan, planIndex) => {
    const planId = planIndex + 1;
    const model = new PlanModel();
    model.id = planId;
    model.name = plan.name;
    model.isActive = true;
    model.createdAt = new Date(`2026-01-0${planId}T00:00:00.000Z`);
    model.updatedAt = new Date(`2026-02-0${planId}T00:00:00.000Z`);
    model.externalPlanId = null;

    model.prices = plan.prices.map((price, priceIndex) => {
        const pModel = new PriceModel();
        pModel.id = (planIndex * 10) + priceIndex + 1;
        pModel.planId = planId;
        pModel.billingCycle = price.billingCycle;
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

export const MockDiscount: DiscountModel = {
    id: 1,
    priceId: 1,
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
    name: "Plano Free",
    isActive: true,
    externalPlanId: null,
    prices: [MockPrice],
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
} as PlanModel;

export const MockDiscountInput: CreateDiscountProps = {
    priceId: 1,
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
    billingCycle: billingCycle.monthly,
    value: 2999,
    externalPriceId: 'price_123',
    discount: {
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
    orderBy: "prices.discounts.name",
    sortOrder: "ASC",
    start: "2025-02-01",
    end: "2025-03-31",
    where: {
        key: { op: "in", args: ["free", "start", "pro"] },
        name: { op: "ilike", args: "%Plano%" },
        "prices.billingCycle": "YEARLY",
        "prices.value": { op: "gte", args: 1000 },
        "prices.discounts.name": { op: "ilike", args: "%OFF%" },
        "prices.discounts.value": { op: "between", args: [10, 30] },
        "prices.discounts.campaignStartsAt": {
            op: "between",
            args: ["2025-02-28", "2025-03-30"],
        },
        "prices.discounts.externalDiscountId": null,
        isActive: true,
    },
};
