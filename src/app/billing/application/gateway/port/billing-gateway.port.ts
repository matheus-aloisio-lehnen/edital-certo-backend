import { CreateGatewayProductDto } from "@billing/application/gateway/dto/create-gateway-product.dto";
import { UpdateGatewayProductDto } from "@billing/application/gateway/dto/update-gateway-product.dto";
import { UpdateGatewayPriceDto } from "@billing/application/gateway/dto/update-gateway-price.dto";
import { CreateGatewayPriceDto } from "@billing/application/gateway/dto/create-gateway-price.dto";
import { CreateGatewayCouponDto } from "@billing/application/gateway/dto/create-gateway-coupon.dto";
import { GatewayProduct } from "@billing/application/gateway/dto/gateway-product.dto";
import { GatewayPrice } from "@billing/application/gateway/dto/gateway-price.dto";
import { Price } from "@billing/domain/price/entity/price.entity";
import { Discount } from "@billing/domain/discount/entity/discount.entity";
import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { GatewayCoupon } from "@billing/application/gateway/dto/gateway-coupon.dto";

export const billingGatewayClientPort = Symbol('billingGatewayClientPort');
export const billingGatewayServicePort = Symbol('billingGatewayServicePort');

export interface IBillingGatewayClient {
    createProduct(dto: CreateGatewayProductDto): Promise<GatewayProduct>;
    updateProduct(dto: UpdateGatewayProductDto): Promise<void>;
    createPrice(dto: CreateGatewayPriceDto): Promise<GatewayPrice>;
    updatePrice(dto: UpdateGatewayPriceDto): Promise<void>;
    createCoupon(dto: CreateGatewayCouponDto): Promise<GatewayCoupon>;
    deleteCoupon(couponId: string): Promise<void>;
}

export interface IBillingGatewayService {
    syncPlan(plan: Plan): Promise<void>;
    syncPrice(planId: number, externalPlanId: string, price: Price): Promise<void>;
    syncDiscount(discount: Discount): Promise<void>;
    deactivatePlan(plan: Plan): Promise<void>;
    deactivatePrice(price: Price): Promise<void>;
    deleteDiscount(discount: Discount): Promise<void>;
}
