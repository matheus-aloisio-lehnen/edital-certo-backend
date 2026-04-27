import { billingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { CreateProductProps } from "@billing/domain/product/props/create-product.props";
import { ProductModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/product.model";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";
import { discountDuration, discountType } from "@billing/domain/discount/constant/discount.constant";
import { CreateDiscountProps } from "@billing/domain/discount/props/create-discount.props";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";

export const MockCreateProducts: CreateProductProps[] = [
    {
        name: "Produto Free",
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
        name: "Produto Start",
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
        name: "Produto Pro",
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
        name: "Produto Teams",
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

export const MockRehydratedProducts: ProductModel[] = MockCreateProducts.map((product, productIndex) => {
    const productId = productIndex + 1;
    const model = new ProductModel();
    model.id = productId;
    model.name = product.name;
    model.isActive = true;
    model.createdAt = new Date(`2026-01-0${productId}T00:00:00.000Z`);
    model.updatedAt = new Date(`2026-02-0${productId}T00:00:00.000Z`);
    model.externalProductId = null;

    model.prices = product.prices.map((price, priceIndex) => {
        const pModel = new PriceModel();
        pModel.id = (productIndex * 10) + priceIndex + 1;
        pModel.productId = productId;
        pModel.billingCycle = price.billingCycle;
        pModel.value = price.value;
        pModel.isActive = true;
        pModel.externalPriceId = null;
        pModel.createdAt = new Date(`2026-01-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`);
        pModel.updatedAt = new Date(`2026-02-${String(priceIndex + 1).padStart(2, '0')}T00:00:00.000Z`);
        pModel.product = model;

        if (price.discount) {
            const dModel = new DiscountModel();
            dModel.id = (productIndex * 100) + priceIndex + 1;
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

export const MockCreateInputProducts: CreateProductProps[] = MockCreateProducts;

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
    productId: 1,
    billingCycle: billingCycle.monthly,
    value: 2999,
    discounts: [MockDiscount],
    externalPriceId: 'ext_price_123',
    isActive: true,
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    product: null as any,
} as PriceModel;

export const MockProduct: ProductModel = {
    id: 1,
    name: "Produto Free",
    isActive: true,
    externalProductId: null,
    prices: [MockPrice],
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
} as ProductModel;

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
    productId: 1,
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
        name: { op: "ilike", args: "%Produto%" },
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
