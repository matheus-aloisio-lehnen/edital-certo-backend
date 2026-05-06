import { describe, expect, it } from "vitest";
import { SubscriptionFactory } from "@billing/domain/subscription/factory/subscription.factory";
import { Subscription } from "@billing/domain/subscription/entity/subscription.entity";
import { subscriptionStatus } from "@billing/domain/subscription/constant/subscription-status.constant";

describe("SubscriptionFactory", () => {
    const input = {
        priceId: 1,
        condominiumId: 10,
        invoiceEmail: "billing@example.com",
        status: subscriptionStatus.active,
        externalCustomerId: "cus_123",
        externalSubscriptionId: "sub_123",
        paymentMethod: "BOLETO",
        billingDay: 10,
        units: 24,
        overdueInvoiceId: 99,
        overdueSince: new Date("2026-02-11T00:00:00.000Z"),
        startsAt: new Date("2026-01-01T00:00:00.000Z"),
        endsAt: new Date("2026-12-31T23:59:59.000Z"),
    };

    const model = {
        id: 1,
        ...input,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-02T00:00:00.000Z"),
        deletedAt: null,
    };

    it("create should create a subscription successfully", () => {
        const subscription = SubscriptionFactory.create(input);
        expect(subscription).toBeInstanceOf(Subscription);
        expect(subscription.priceId).toBe(input.priceId);
    });

    it("createBulk should create bulk subscriptions successfully", () => {
        const list = SubscriptionFactory.createBulk([input]);
        expect(list).toHaveLength(1);
        expect(list[0]).toBeInstanceOf(Subscription);
    });

    it("rehydrate should rehydrate a subscription successfully", () => {
        const subscription = SubscriptionFactory.rehydrate(model);
        expect(subscription).toBeInstanceOf(Subscription);
        expect(subscription.id).toBe(model.id);
        expect(subscription.priceId).toBe(model.priceId);
        expect(subscription.status).toBe(model.status);
        expect(subscription.paymentMethod).toBe(model.paymentMethod);
        expect(subscription.units).toBe(model.units);
    });

    it("rehydrateBulk should rehydrate bulk subscriptions successfully", () => {
        const list = SubscriptionFactory.rehydrateBulk([model]);
        expect(list).toHaveLength(1);
        expect(list[0]).toBeInstanceOf(Subscription);
    });

    it("toModel should map a subscription successfully", () => {
        const subscription = SubscriptionFactory.create(input);
        const mapped = SubscriptionFactory.toModel(subscription);

        expect(mapped.priceId).toBe(input.priceId);
        expect(mapped.condominiumId).toBe(input.condominiumId);
        expect(mapped.status).toBe(input.status);
        expect(mapped.paymentMethod).toBe(input.paymentMethod);
        expect(mapped.units).toBe(input.units);
    });
});
