import { describe, expect, it } from "vitest";
import { Subscription } from "@billing/domain/subscription/entity/subscription.entity";
import { code } from "@shared/domain/constant/errors.constant";
import { AppException } from "@shared/domain/exception/app.exception";
import { subscriptionStatus } from "@billing/domain/subscription/constant/subscription-status.constant";

describe("Subscription", () => {
    const validProps = {
        priceId: 1,
        condominiumId: 10,
        invoiceEmail: "billing@example.com",
        units: 24,
        billingDay: 10,
        paymentMethod: "BOLETO",
        status: subscriptionStatus.active,
        externalCustomerId: "cus_123",
        externalSubscriptionId: "sub_123",
        startsAt: new Date("2026-01-01T00:00:00.000Z"),
        endsAt: new Date("2026-12-31T23:59:59.000Z"),
    };

    it("constructor should create subscription successfully", () => {
        const subscription = new Subscription(validProps);

        expect(subscription.priceId).toBe(validProps.priceId);
        expect(subscription.condominiumId).toBe(validProps.condominiumId);
        expect(subscription.invoiceEmail).toBe(validProps.invoiceEmail);
        expect(subscription.status).toBe(subscriptionStatus.active);
        expect(subscription.paymentMethod).toBe(validProps.paymentMethod);
        expect(subscription.units).toBe(validProps.units);
        expect(subscription.billingDay).toBe(validProps.billingDay);
    });

    it("should default status to active", () => {
        const subscription = new Subscription({
            priceId: 1,
            condominiumId: 10,
            units: 24,
        });

        expect(subscription.status).toBe(subscriptionStatus.active);
        expect(subscription.paymentMethod).toBe("BOLETO");
    });

    it("validate should throw if priceId is missing", () => {
        expect(() => new Subscription({ ...validProps, priceId: undefined as any })).toThrow(
            new AppException(code.subscriptionPriceIdEmptyError, 400)
        );
    });

    it("validate should throw if priceId is invalid", () => {
        expect(() => new Subscription({ ...validProps, priceId: 0 })).toThrow(
            new AppException(code.subscriptionPriceIdInvalidError, 400)
        );
    });

    it("validate should throw if condominiumId is missing", () => {
        expect(() => new Subscription({ ...validProps, condominiumId: undefined as any })).toThrow(
            new AppException(code.subscriptionCondominiumIdEmptyError, 400)
        );
    });

    it("validate should throw if condominiumId is invalid", () => {
        expect(() => new Subscription({ ...validProps, condominiumId: 0 })).toThrow(
            new AppException(code.subscriptionCondominiumIdInvalidError, 400)
        );
    });

    it("validate should throw if invoiceEmail is blank", () => {
        expect(() => new Subscription({ ...validProps, invoiceEmail: " " })).toThrow(
            new AppException(code.subscriptionInvoiceEmailEmptyError, 400)
        );
    });

    it("validate should throw if status is invalid", () => {
        expect(() => new Subscription({ ...validProps, status: "INVALID" as any })).toThrow(
            new AppException(code.subscriptionStatusInvalidError, 400)
        );
    });

    it("validate should throw if billingDay is invalid", () => {
        expect(() => new Subscription({ ...validProps, billingDay: 32 })).toThrow(
            new AppException(code.subscriptionBillingDayInvalidError, 400)
        );
    });

    it("validate should throw if units are invalid", () => {
        expect(() => new Subscription({ ...validProps, units: 0 })).toThrow(
            new AppException(code.subscriptionUnitsInvalidError, 400)
        );
    });

    it("validate should throw if external ids are blank", () => {
        expect(() => new Subscription({ ...validProps, externalCustomerId: " " })).toThrow(
            new AppException(code.subscriptionExternalCustomerIdEmptyError, 400)
        );
        expect(() => new Subscription({ ...validProps, externalSubscriptionId: " " })).toThrow(
            new AppException(code.subscriptionExternalSubscriptionIdEmptyError, 400)
        );
    });

    it("validate should throw if paymentMethod is empty or invalid", () => {
        expect(() => new Subscription({ ...validProps, paymentMethod: " " })).toThrow(
            new AppException(code.subscriptionPaymentMethodEmptyError, 400)
        );
        expect(() => new Subscription({ ...validProps, paymentMethod: "PIX" })).toThrow(
            new AppException(code.subscriptionPaymentMethodInvalidError, 400)
        );
    });

    it("validate should throw if endsAt is before startsAt", () => {
        expect(() => new Subscription({
            ...validProps,
            startsAt: new Date("2026-02-01T00:00:00.000Z"),
            endsAt: new Date("2026-01-01T00:00:00.000Z"),
        })).toThrow(new AppException(code.subscriptionEndsAtInvalidError, 400));
    });

    it("should change status through helper methods", () => {
        const subscription = new Subscription(validProps);
        const overdueSince = new Date("2026-02-10T00:00:00.000Z");
        const endsAt = new Date("2026-12-30T23:59:59.000Z");

        subscription.suspend(overdueSince, 1);
        expect(subscription.status).toBe(subscriptionStatus.suspended);
        expect(subscription.overdueSince).toBe(overdueSince);
        expect(subscription.overdueInvoiceId).toBe(1);

        subscription.markOverdue(overdueSince, 2);
        expect(subscription.status).toBe(subscriptionStatus.overdue);
        expect(subscription.overdueInvoiceId).toBe(2);

        subscription.cancel(endsAt);
        expect(subscription.status).toBe(subscriptionStatus.cancelled);
        expect(subscription.endsAt).toBe(endsAt);

        subscription.activate();
        expect(subscription.status).toBe(subscriptionStatus.active);
        expect(subscription.endsAt).toBeNull();
        expect(subscription.overdueSince).toBeNull();
        expect(subscription.overdueInvoiceId).toBeUndefined();
    });

    it("restore should reactivate subscription and clear cancellation/overdue state", () => {
        const subscription = new Subscription(validProps);
        const restoreStartsAt = new Date("2027-01-01T00:00:00.000Z");

        subscription.markOverdue(new Date("2026-02-10T00:00:00.000Z"), 10);
        subscription.cancel(new Date("2026-12-30T23:59:59.000Z"));
        subscription.restore(restoreStartsAt);

        expect(subscription.status).toBe(subscriptionStatus.active);
        expect(subscription.startsAt).toBe(restoreStartsAt);
        expect(subscription.endsAt).toBeNull();
        expect(subscription.overdueSince).toBeNull();
        expect(subscription.overdueInvoiceId).toBeUndefined();
    });

    it("should update external ids and invoice email", () => {
        const subscription = new Subscription(validProps);

        subscription.linkExternalCustomerId("cus_new");
        subscription.linkExternalSubscriptionId("sub_new");
        subscription.changeInvoiceEmail("new@example.com");

        expect(subscription.externalCustomerId).toBe("cus_new");
        expect(subscription.externalSubscriptionId).toBe("sub_new");
        expect(subscription.invoiceEmail).toBe("new@example.com");
    });

    it("id getter should throw if id is not set", () => {
        const subscription = new Subscription(validProps);
        expect(() => subscription.id).toThrow(new AppException(code.subscriptionIdEmptyError, 500));
    });
});
