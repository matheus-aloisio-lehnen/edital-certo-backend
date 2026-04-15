import { CreateGatewayCouponDto } from "@domain/product/dto/create-gateway-coupon.dto";
import { CreateGatewayPriceDto } from "@domain/product/dto/create-gateway-price.dto";
import { CreateGatewayProductDto } from "@domain/product/dto/create-gateway-product.dto";
import { GatewayCoupon } from "@domain/product/dto/gateway-coupon.dto";
import { GatewayPrice } from "@domain/product/dto/gateway-price.dto";
import { GatewayProduct } from "@domain/product/dto/gateway-product.dto";
import { UpdateGatewayPriceDto } from "@domain/product/dto/update-gateway-price.dto";
import { UpdateGatewayProductDto } from "@domain/product/dto/update-gateway-product.dto";
import { Currency } from "@domain/@shared/type/language.type";
import { Plan } from "@domain/product/entity/plan.entity";
import { Price } from "@domain/product/entity/price.entity";
import { Discount } from "@domain/product/entity/discount.entity";
import { PlanKey } from "@domain/product/constant/plan-key.constant";

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