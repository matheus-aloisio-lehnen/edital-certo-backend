import { describe, it, expect, beforeEach, Mock } from "vitest";
import { createBillingGatewayClientMock } from "@mock/tests.mock";
import { MockCreateProducts, MockProduct } from "@mock/in-memory.mock";
import { type IBillingGatewayClient } from "@billing/application/gateway/port/billing-gateway.port";
import { ProductFactory } from "@billing/domain/product/factory/product.factory";

import { BillingGatewayService } from "./billing-gateway.service";

describe("BillingGatewayService", () => {
    let service: BillingGatewayService;
    let gatewayClient: IBillingGatewayClient;

    beforeEach(() => {
        gatewayClient = createBillingGatewayClientMock();
        service = new BillingGatewayService(gatewayClient);
    });

    it("syncProduct should sync a new product and its prices", async () => {
        const product = ProductFactory.create(MockCreateProducts[1]);
        Object.assign(product, { _id: 1 });
        product.prices.forEach(p => {
            Object.assign(p, { _id: 1 });
            p.linkExternalPriceId(null as any);
            if (p.discount) {
                Object.assign(p.discount, { _id: 1 });
                p.discount.linkExternalDiscountId(null as any);
            }
        });
        const price = product.prices.find(p => !!p.discount)!;
        product.linkExternalProductId(null as any);

        (gatewayClient.createProduct as Mock).mockResolvedValue({ id: "ext_prod_new" });
        (gatewayClient.createPrice as Mock).mockResolvedValue({ id: "ext_price_new" });
        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);
        (gatewayClient.createCoupon as Mock).mockResolvedValue({ id: "ext_coupon_new" });

        await service.syncProduct(product);

        expect(gatewayClient.createProduct).toHaveBeenCalledTimes(1);
        expect(gatewayClient.createPrice).toHaveBeenCalledTimes(product.prices.length);
        expect(gatewayClient.updatePrice).toHaveBeenCalledTimes(product.prices.length);
        expect(gatewayClient.createCoupon).toHaveBeenCalledTimes(1);
        expect(product.externalProductId).toBe("ext_prod_new");
        expect(price.externalPriceId).toBe("ext_price_new");
        expect(price.discount?.externalDiscountId).toBe("ext_coupon_new");
    });

    it("syncProduct should update an existing product and its prices", async () => {
        const product = ProductFactory.rehydrate(MockProduct);
        product.linkExternalProductId("ext_prod_existing");

        (gatewayClient.updateProduct as Mock).mockResolvedValue(undefined);
        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);

        await service.syncProduct(product);

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
        const product = ProductFactory.rehydrate(MockProduct);
        const price = product.prices[0];
        price.linkExternalPriceId(null as any);

        (gatewayClient.createPrice as Mock).mockResolvedValue({ id: "new_price_id" });
        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);

        await service.syncPrice(product.id, "ext_prod_123", price);

        expect(gatewayClient.createPrice).toHaveBeenCalledTimes(1);
        expect(gatewayClient.updatePrice).toHaveBeenCalledTimes(1);
        expect(price.externalPriceId).toBe("new_price_id");
    });

    it("syncPrice should only update price if externalPriceId exists", async () => {
        const product = ProductFactory.rehydrate(MockProduct);
        const price = product.prices[0];

        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);

        await service.syncPrice(product.id, "ext_prod_123", price);

        expect(gatewayClient.createPrice).not.toHaveBeenCalled();
        expect(gatewayClient.updatePrice).toHaveBeenCalledTimes(1);
    });

    it("syncDiscount should create coupon if externalDiscountId is missing", async () => {
        const product = ProductFactory.create(MockCreateProducts[1]);
        const price = product.prices.find(p => !!p.discount)!;
        const discount = price.discount!;
        Object.assign(discount, { _id: 1 });
        discount.linkExternalDiscountId(null as any);

        (gatewayClient.createCoupon as Mock).mockResolvedValue({ id: "new_coupon_id" });

        await service.syncDiscount(discount);

        expect(gatewayClient.createCoupon).toHaveBeenCalledTimes(1);
        expect(discount.externalDiscountId).toBe("new_coupon_id");
    });

    it("syncDiscount should not create coupon if externalDiscountId already exists", async () => {
        const product = ProductFactory.create(MockCreateProducts[1]);
        const price = product.prices.find(p => !!p.discount)!;
        const discount = price.discount!;
        Object.assign(discount, { _id: 1 });
        discount.linkExternalDiscountId("ext_coupon_existing");

        (gatewayClient.createCoupon as Mock).mockResolvedValue({ id: "new_coupon_id" });

        await service.syncDiscount(discount);

        expect(gatewayClient.createCoupon).not.toHaveBeenCalled();
    });

    it("deactivateProduct should call updateProduct with active false", async () => {
        const product = ProductFactory.rehydrate(MockProduct);
        product.linkExternalProductId("ext_prod_existing");
        (gatewayClient.updateProduct as Mock).mockResolvedValue(undefined);

        await service.deactivateProduct(product);

        expect(gatewayClient.updateProduct).toHaveBeenCalledWith({
            productId: "ext_prod_existing",
            active: false,
        });
    });

    it("deactivateProduct should do nothing if product has no externalProductId", async () => {
        const product = ProductFactory.rehydrate({ ...MockProduct, externalProductId: null });

        await service.deactivateProduct(product);

        expect(gatewayClient.updateProduct).not.toHaveBeenCalled();
    });

    it("deactivatePrice should call updatePrice with active false", async () => {
        const product = ProductFactory.rehydrate(MockProduct);
        const price = product.prices[0];
        (gatewayClient.updatePrice as Mock).mockResolvedValue(undefined);

        await service.deactivatePrice(price);

        expect(gatewayClient.updatePrice).toHaveBeenCalledWith({
            priceId: price.externalPriceId,
            active: false,
        });
    });

    it("deleteDiscount should call deleteCoupon", async () => {
        const product = ProductFactory.create(MockCreateProducts[1]);
        const price = product.prices.find(p => !!p.discount)!;
        const discount = price.discount!;
        discount.linkExternalDiscountId("ext_coupon_123");

        (gatewayClient.deleteCoupon as Mock).mockResolvedValue(undefined);

        await service.deleteDiscount(discount);

        expect(gatewayClient.deleteCoupon).toHaveBeenCalledWith(discount.externalDiscountId);
    });

    it("deleteDiscount should do nothing if discount has no externalDiscountId", async () => {
        const product = ProductFactory.create(MockCreateProducts[1]);
        const price = product.prices.find(p => !!p.discount)!;
        const discount = price.discount!;
        discount.linkExternalDiscountId(null as any);

        await service.deleteDiscount(discount);

        expect(gatewayClient.deleteCoupon).not.toHaveBeenCalled();
    });
});
