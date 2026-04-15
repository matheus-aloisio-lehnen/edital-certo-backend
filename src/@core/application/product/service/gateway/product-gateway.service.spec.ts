import { describe, it, expect, beforeEach, vi } from "vitest";
import { createProductGatewayClientMock } from "@mock/tests.mock";
import { MockPlan } from "@mock/in-memory.mock";
import { PlanFactory } from "@domain/product/factory/plan.factory";
import { currency } from "@domain/@shared/type/language.type";
import { ProductGatewayService } from "./product-gateway.service";

describe("ProductGatewayService", () => {
    let service: ProductGatewayService;
    let gatewayClient: any;

    beforeEach(() => {
        gatewayClient = createProductGatewayClientMock();
        service = new ProductGatewayService(gatewayClient);
    });

    describe("syncPlan", () => {
        it("should sync a new plan and its prices", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            
            // Usando as propriedades privadas via rehydrate para simular estado novo
            Object.assign(plan, { _externalPlanId: undefined });
            plan.prices.forEach(price => {
                 Object.assign(price, { _externalPriceId: undefined });
                 if (price.discount) {
                    Object.assign(price.discount, { _externalDiscountId: undefined });
                 }
            });

            gatewayClient.createProduct.mockResolvedValue({ id: "ext_prod_new" });
            gatewayClient.createPrice.mockResolvedValue({ id: "ext_price_new" });
            gatewayClient.updatePrice.mockResolvedValue(undefined);
            gatewayClient.createCoupon.mockResolvedValue({ id: "ext_coupon_new" });

            await service.syncPlan(plan);

            expect(gatewayClient.createProduct).toHaveBeenCalled();
            expect(gatewayClient.createPrice).toHaveBeenCalled();
            expect(gatewayClient.updatePrice).toHaveBeenCalled();
            expect(gatewayClient.createCoupon).toHaveBeenCalled();
            expect(plan.externalPlanId).toBe("ext_prod_new");
        });

        it("should update an existing plan and its prices", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            
            gatewayClient.updateProduct.mockResolvedValue(undefined);
            gatewayClient.updatePrice.mockResolvedValue(undefined);

            await service.syncPlan(plan);

            expect(gatewayClient.updateProduct).toHaveBeenCalled();
            expect(gatewayClient.updatePrice).toHaveBeenCalled();
            expect(gatewayClient.createProduct).not.toHaveBeenCalled();
        });
    });

    describe("syncPrice", () => {
        it("should create price if externalPriceId is missing", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            const price = plan.prices[0];
            Object.assign(price, { _externalPriceId: undefined });
            
            gatewayClient.createPrice.mockResolvedValue({ id: "new_price_id" });

            await service.syncPrice(plan.id, plan.key, "ext_prod_123", price);

            expect(gatewayClient.createPrice).toHaveBeenCalled();
            expect(price.externalPriceId).toBe("new_price_id");
        });

        it("should only update price if externalPriceId exists", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            const price = plan.prices[0];
            
            await service.syncPrice(plan.id, plan.key, "ext_prod_123", price);

            expect(gatewayClient.createPrice).not.toHaveBeenCalled();
            expect(gatewayClient.updatePrice).toHaveBeenCalled();
        });
    });

    describe("syncDiscount", () => {
        it("should create coupon if externalDiscountId is missing", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            const discount = plan.prices[0].discount!;
            Object.assign(discount, { _externalDiscountId: undefined });
            
            gatewayClient.createCoupon.mockResolvedValue({ id: "new_coupon_id" });

            await service.syncDiscount(currency.brl, discount);

            expect(gatewayClient.createCoupon).toHaveBeenCalled();
            expect(discount.externalDiscountId).toBe("new_coupon_id");
        });

        it("should not create coupon if externalDiscountId already exists", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            const discount = plan.prices[0].discount!;
            
            await service.syncDiscount(currency.brl, discount);

            expect(gatewayClient.createCoupon).not.toHaveBeenCalled();
        });
    });

    describe("deactivatePlan", () => {
        it("should call updateProduct with active false", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            
            await service.deactivatePlan(plan);

            expect(gatewayClient.updateProduct).toHaveBeenCalledWith({
                productId: plan.externalPlanId,
                active: false
            });
        });

        it("should do nothing if plan has no externalPlanId", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            Object.assign(plan, { _externalPlanId: undefined });
            
            await service.deactivatePlan(plan);

            expect(gatewayClient.updateProduct).not.toHaveBeenCalled();
        });
    });

    describe("deactivatePrice", () => {
        it("should call updatePrice with active false", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            const price = plan.prices[0];
            
            await service.deactivatePrice(price);

            expect(gatewayClient.updatePrice).toHaveBeenCalledWith({
                priceId: price.externalPriceId,
                active: false
            });
        });
    });

    describe("deleteDiscount", () => {
        it("should call deleteCoupon", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            const discount = plan.prices[0].discount!;
            
            await service.deleteDiscount(discount);

            expect(gatewayClient.deleteCoupon).toHaveBeenCalledWith(discount.externalDiscountId);
        });

        it("should do nothing if discount has no externalDiscountId", async () => {
            const plan = PlanFactory.rehydrate(MockPlan);
            const discount = plan.prices[0].discount!;
            Object.assign(discount, { _externalDiscountId: undefined });
            
            await service.deleteDiscount(discount);

            expect(gatewayClient.deleteCoupon).not.toHaveBeenCalled();
        });
    });
});
