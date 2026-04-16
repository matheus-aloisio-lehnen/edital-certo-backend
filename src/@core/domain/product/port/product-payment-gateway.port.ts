import { CreateGatewayCouponDto } from "@product/dto/create-gateway-coupon.dto";
import { CreateGatewayPriceDto } from "@product/dto/create-gateway-price.dto";
import { CreateGatewayProductDto } from "@product/dto/create-gateway-product.dto";
import { GatewayCoupon } from "@product/dto/gateway-coupon.dto";
import { GatewayPrice } from "@product/dto/gateway-price.dto";
import { GatewayProduct } from "@product/dto/gateway-product.dto";
import { UpdateGatewayPriceDto } from "@product/dto/update-gateway-price.dto";
import { UpdateGatewayProductDto } from "@product/dto/update-gateway-product.dto";
import { Currency } from "@domain/@shared/type/language.type";
import { Plan } from "@product/entity/plan.entity";
import { Price } from "@product/entity/price.entity";
import { Discount } from "@product/entity/discount.entity";
import { PlanKey } from "@product/constant/plan-key.constant";

export const productGatewayClientPort = Symbol('productGatewayClientPort');
export const productGatewayServicePort = Symbol('productGatewayServicePort');

export interface IProductGatewayClient {
    createProduct(dto: CreateGatewayProductDto): Promise<GatewayProduct>;
    updateProduct(dto: UpdateGatewayProductDto): Promise<void>;
    createPrice(dto: CreateGatewayPriceDto): Promise<GatewayPrice>;
    updatePrice(dto: UpdateGatewayPriceDto): Promise<void>;
    createCoupon(dto: CreateGatewayCouponDto): Promise<GatewayCoupon>;
    deleteCoupon(couponId: string): Promise<void>;
}

export interface IProductGatewayService {
    syncPlan(plan: Plan): Promise<void>;
    syncPrice(planId: number, planKey: PlanKey, externalPlanId: string, price: Price): Promise<void>;
    syncDiscount(currency: Currency, discount: Discount): Promise<void>;
    deactivatePlan(plan: Plan): Promise<void>;
    deactivatePrice(price: Price): Promise<void>;
    deleteDiscount(discount: Discount): Promise<void>;
}