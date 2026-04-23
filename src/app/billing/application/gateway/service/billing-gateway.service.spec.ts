import { describe, it, expect, beforeEach, Mock } from "vitest";
import { createBillingGatewayClientMock } from "@mock/tests.mock";
import { MockCreatePlans, MockPlan } from "@mock/in-memory.mock";
import { type IBillingGatewayClient } from "@billing/application/gateway/port/billing-gateway.port";
import { PlanFactory } from "@billing/domain/plan/factory/plan.factory";

import { BillingGatewayService } from "./billing-gateway.service";

describe("BillingGatewayService", () => {
    let service: BillingGatewayService;
    let gatewayClient: IBillingGatewayClient;

    beforeEach(() => {
        gatewayClient = createBillingGatewayClientMock();
        service = new BillingGatewayService(gatewayClient);
    });

    it("syncPlan should sync a new plan and its prices", async () => {
        const plan = PlanFactory.create(MockCreatePlans[1]);
        Object.assign(plan, { _id: 1 });
        plan.prices.forEach(p => {
            Object.assign(p, { _id: 1 });
            p.linkExternalPriceId(null as any);
            if (p.discount) {
                Object.assign(p.discount, { _id: 1 });
                p.discount.linkExternalDiscountId(null as any);
            }
        });
        const price = plan.prices.find(p => !!p.discount)!;
        plan.linkExternalPlanId(null as any);

        (gatewayClient.createProduct as Mock).mockResolvedValue({ id: "ext_prod_new" });
        (gatewayClient.createPrice as Mock).mockResolvedValue({ id: "ext_price_new" });
        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);
        (gatewayClient.createCoupon as Mock).mockResolvedValue({ id: "ext_coupon_new" });

        await service.syncPlan(plan);

        expect(gatewayClient.createProduct).toHaveBeenCalledTimes(1);
        expect(gatewayClient.createPrice).toHaveBeenCalledTimes(plan.prices.length);
        expect(gatewayClient.updatePrice).toHaveBeenCalledTimes(plan.prices.length);
        expect(gatewayClient.createCoupon).toHaveBeenCalledTimes(1);
        expect(plan.externalPlanId).toBe("ext_prod_new");
        expect(price.externalPriceId).toBe("ext_price_new");
        expect(price.discount?.externalDiscountId).toBe("ext_coupon_new");
    });

    it("syncPlan should update an existing plan and its prices", async () => {
        const plan = PlanFactory.rehydrate(MockPlan);
        plan.linkExternalPlanId("ext_prod_existing");

        (gatewayClient.updateProduct as Mock).mockResolvedValue(undefined);
        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);

        await service.syncPlan(plan);

        expect(gatewayClient.updateProduct).toHaveBeenCalledTimes(1);
        expect(gatewayClient.updateProduct).toHaveBeenCalledWith({
            productId: "ext_prod_existing",
            active: true,
        });
        expect(gatewayClient.updatePrice).toHaveBeenCalledTimes(1);
        expect(gatewayClient.createProduct).not.toHaveBeenCalled();
        expect(gatewayClient.createPrice).not.toHaveBeenCalled();
    });

    it("syncPrice should create price if externalPriceId is missing", async () => {
        const plan = PlanFactory.rehydrate(MockPlan);
        const price = plan.prices[0];
        price.linkExternalPriceId(null as any);

        (gatewayClient.createPrice as Mock).mockResolvedValue({ id: "new_price_id" });
        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);

        await service.syncPrice(plan.id, "ext_prod_123", price);

        expect(gatewayClient.createPrice).toHaveBeenCalledTimes(1);
        expect(gatewayClient.updatePrice).toHaveBeenCalledTimes(1);
        expect(price.externalPriceId).toBe("new_price_id");
    });

    it("syncPrice should only update price if externalPriceId exists", async () => {
        const plan = PlanFactory.rehydrate(MockPlan);
        const price = plan.prices[0];

        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);

        await service.syncPrice(plan.id, "ext_prod_123", price);

        expect(gatewayClient.createPrice).not.toHaveBeenCalled();
        expect(gatewayClient.updatePrice).toHaveBeenCalledTimes(1);
    });

    it("syncDiscount should create coupon if externalDiscountId is missing", async () => {
        const plan = PlanFactory.create(MockCreatePlans[1]);
        const price = plan.prices.find(p => !!p.discount)!;
        const discount = price.discount!;
        Object.assign(discount, { _id: 1 });
        discount.linkExternalDiscountId(null as any);

        (gatewayClient.createCoupon as Mock).mockResolvedValue({ id: "new_coupon_id" });

        await service.syncDiscount(discount);

        expect(gatewayClient.createCoupon).toHaveBeenCalledTimes(1);
        expect(discount.externalDiscountId).toBe("new_coupon_id");
    });

    it("syncDiscount should not create coupon if externalDiscountId already exists", async () => {
        const plan = PlanFactory.create(MockCreatePlans[1]);
        const price = plan.prices.find(p => !!p.discount)!;
        const discount = price.discount!;
        Object.assign(discount, { _id: 1 });
        discount.linkExternalDiscountId("ext_coupon_existing");

        (gatewayClient.createCoupon as Mock).mockResolvedValue({ id: "new_coupon_id" });

        await service.syncDiscount(discount);

        expect(gatewayClient.createCoupon).not.toHaveBeenCalled();
    });

    it("deactivatePlan should call updateProduct with active false", async () => {
        const plan = PlanFactory.rehydrate(MockPlan);
        plan.linkExternalPlanId("ext_prod_existing");
        (gatewayClient.updateProduct as Mock).mockResolvedValue(undefined);

        await service.deactivatePlan(plan);

        expect(gatewayClient.updateProduct).toHaveBeenCalledWith({
            productId: "ext_prod_existing",
            active: false,
        });
    });

    it("deactivatePlan should do nothing if plan has no externalPlanId", async () => {
        const plan = PlanFactory.rehydrate({ ...MockPlan, externalPlanId: null });

        await service.deactivatePlan(plan);

        expect(gatewayClient.updateProduct).not.toHaveBeenCalled();
    });

    it("deactivatePrice should call updatePrice with active false", async () => {
        const plan = PlanFactory.rehydrate(MockPlan);
        const price = plan.prices[0];
        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);

        await service.deactivatePrice(price);

        expect(gatewayClient.updatePrice).toHaveBeenCalledWith({
            priceId: price.externalPriceId,
            active: false,
        });
    });

    it("deleteDiscount should call deleteCoupon", async () => {
        const plan = PlanFactory.create(MockCreatePlans[1]);
        const price = plan.prices.find(p => !!p.discount)!;
        const discount = price.discount!;
        discount.linkExternalDiscountId("ext_coupon_123");

        (gatewayClient.deleteCoupon as Mock).mockResolvedValue(undefined);

        await service.deleteDiscount(discount);

        expect(gatewayClient.deleteCoupon).toHaveBeenCalledWith(discount.externalDiscountId);
    });

    it("deleteDiscount should do nothing if discount has no externalDiscountId", async () => {
        const plan = PlanFactory.create(MockCreatePlans[1]);
        const price = plan.prices.find(p => !!p.discount)!;
        const discount = price.discount!;
        discount.linkExternalDiscountId(null as any);

        await service.deleteDiscount(discount);

        expect(gatewayClient.deleteCoupon).not.toHaveBeenCalled();
    });
});
