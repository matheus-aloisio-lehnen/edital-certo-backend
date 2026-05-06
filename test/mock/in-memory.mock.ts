import { billingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { billingType } from "@billing/domain/price/constant/billing-type.constant";
import { discountDuration, discountType } from "@billing/domain/discount/constant/discount.constant";
import { CreateDiscountProps } from "@billing/domain/discount/props/create-discount.props";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";
import { CreateProductProps } from "@billing/domain/product/props/create-product.props";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";
import { ProductModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/product.model";

export const MockCreateProducts: CreateProductProps[] = [
    {
        name: "Task Manager",
        kind: "TASK_MANAGER",
        prices: [
            {
                cycle: billingCycle.monthly,
                type: billingType.licensed,
                value: 0,
                version: 1,
            },
            {
                cycle: billingCycle.yearly,
                type: billingType.licensed,
                value: 0,
                version: 1,
            },
        ],
    },
    {
        name: "Storage GB",
        kind: "STORAGE_GB",
        prices: [
            {
                cycle: billingCycle.monthly,
                type: billingType.metered,
                value: 2999,
                version: 1,
                discount: {
                    name: "Partner 20% OFF",
                    value: 20,
                    type: discountType.percent,
                    duration: discountDuration.forever,
                    campaignStartsAt: new Date("2026-01-01T00:00:00.000Z"),
                    campaignEndsAt: new Date("2026-12-31T23:59:59.000Z"),
                    externalDiscountId: null,
                },
            },
            {
                cycle: billingCycle.yearly,
                type: billingType.metered,
                value: 29999,
                version: 2,
                externalPriceId: "price_start_yearly_v2",
            },
        ],
    },
];

export const MockCreateInputProducts: CreateProductProps[] = MockCreateProducts;

export const MockPriceInput: CreatePriceProps = {
    productId: 1,
    cycle: billingCycle.monthly,
    type: billingType.licensed,
    value: 2999,
    version: 1,
    externalPriceId: "price_123",
};

export const MockNestedPriceInput: CreatePriceProps = {
    cycle: billingCycle.monthly,
    type: billingType.licensed,
    value: 2999,
    version: 1,
};

export const MockDiscountInput: CreateDiscountProps = {
    priceId: 1,
    name: "Partner 20% OFF",
    value: 20,
    type: discountType.percent,
    duration: discountDuration.forever,
    campaignStartsAt: new Date("2026-01-01T00:00:00.000Z"),
    campaignEndsAt: new Date("2026-12-31T23:59:59.000Z"),
    externalDiscountId: "discount_partner_20",
};

export const MockDiscount: DiscountModel = {
    id: 1,
    priceId: 1,
    name: "Partner 20% OFF",
    value: 20,
    type: discountType.percent,
    duration: discountDuration.forever,
    count: null,
    campaignStartsAt: new Date("2026-01-01T00:00:00.000Z"),
    campaignEndsAt: new Date("2026-12-31T23:59:59.000Z"),
    externalDiscountId: "discount_partner_20",
    createdAt: new Date("2026-05-01T00:00:00.000Z"),
    updatedAt: new Date("2026-05-01T00:00:00.000Z"),
    deletedAt: null,
    price: null as any,
} as DiscountModel;

export const MockPrice: PriceModel = {
    id: 1,
    productId: 1,
    cycle: billingCycle.monthly,
    type: billingType.licensed,
    value: 2999,
    version: 1,
    isActive: true,
    externalPriceId: "ext_price_123",
    createdAt: new Date("2026-05-01T00:00:00.000Z"),
    updatedAt: new Date("2026-05-01T00:00:00.000Z"),
    deletedAt: null,
    discounts: [MockDiscount],
    product: null as any,
} as PriceModel;

export const MockProduct: ProductModel = {
    id: 1,
    name: "Task Manager",
    kind: "TASK_MANAGER",
    isActive: true,
    externalProductId: null,
    prices: [MockPrice],
    createdAt: new Date("2026-05-01T00:00:00.000Z"),
    updatedAt: new Date("2026-05-01T00:00:00.000Z"),
    deletedAt: null,
} as ProductModel;

MockPrice.product = MockProduct;
MockDiscount.price = MockPrice;

export const MockRehydratedProducts: ProductModel[] = MockCreateProducts.map((product, productIndex) => {
    const productId = productIndex + 1;
    const model = new ProductModel();
    model.id = productId;
    model.name = product.name;
    model.kind = product.kind;
    model.isActive = true;
    model.createdAt = new Date(`2026-01-0${productId}T00:00:00.000Z`);
    model.updatedAt = new Date(`2026-02-0${productId}T00:00:00.000Z`);
    model.deletedAt = null;
    model.externalProductId = null;

    model.prices = product.prices.map((price, priceIndex) => {
        const pModel = new PriceModel();
        pModel.id = (productIndex * 10) + priceIndex + 1;
        pModel.productId = productId;
        pModel.cycle = price.cycle;
        pModel.type = price.type;
        pModel.value = price.value;
        pModel.version = price.version ?? 1;
        pModel.isActive = true;
        pModel.externalPriceId = price.externalPriceId ?? null;
        pModel.createdAt = new Date(`2026-03-${String(priceIndex + 1).padStart(2, "0")}T00:00:00.000Z`);
        pModel.updatedAt = new Date(`2026-04-${String(priceIndex + 1).padStart(2, "0")}T00:00:00.000Z`);
        pModel.deletedAt = null;
        pModel.discounts = [];
        pModel.product = model;
        return pModel;
    });

    return model;
});

export const MockPagination = {
    offset: 0,
    limit: 20,
    orderBy: "prices.value",
    sortOrder: "ASC",
    start: "2025-02-01",
    end: "2025-03-31",
    where: {
        kind: { op: "in", args: ["TASK_MANAGER", "STORAGE_GB"] },
        name: { op: "ilike", args: "%Task%" },
        "prices.cycle": "YEARLY",
        "prices.value": { op: "gte", args: 1000 },
        isActive: true,
    },
};
