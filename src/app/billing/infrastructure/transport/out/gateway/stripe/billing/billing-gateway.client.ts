import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

import { CreateGatewayCouponDto } from "@billing/application/gateway/dto/create-gateway-coupon.dto";
import { CreateGatewayPriceDto, GatewayRecurringInterval } from "@billing/application/gateway/dto/create-gateway-price.dto";
import { CreateGatewayProductDto } from "@billing/application/gateway/dto/create-gateway-product.dto";
import { GatewayCoupon } from "@billing/application/gateway/dto/gateway-coupon.dto";
import { GatewayPrice } from "@billing/application/gateway/dto/gateway-price.dto";
import { GatewayProduct } from "@billing/application/gateway/dto/gateway-product.dto";
import { UpdateGatewayPriceDto } from "@billing/application/gateway/dto/update-gateway-price.dto";
import { UpdateGatewayProductDto } from "@billing/application/gateway/dto/update-gateway-product.dto";
import { type IBillingGatewayClient } from "@billing/application/gateway/port/billing-gateway.port";
import { toDomainCurrency } from "@billing/application/gateway/mapper/billing-gateway.mapper";
import { code } from "@shared/domain/constant/code.constant";
import { AppException } from "@shared/domain/exception/app.exception";
import { hasValue } from "@shared/domain/function/has-value.function";
import { appConfig, type AppConfig } from "@root/app.config";

@Injectable()
export class StripeBillingGatewayClient implements IBillingGatewayClient {

    private readonly stripe: InstanceType<typeof Stripe>;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const cfg = this.configService.get<AppConfig>(appConfig.KEY)?.paymentGateway;
        if (!cfg?.secretKey)
            throw new Error("Stripe secretKey not found");
        this.stripe = new Stripe(cfg.secretKey);
    }

    async createProduct(dto: CreateGatewayProductDto): Promise<GatewayProduct> {
        const product = await this.stripe.products.create(dto);

        return {
            id: product.id,
            active: product.active,
            name: product.name,
            description: product.description,
        };
    }

    async updateProduct(dto: UpdateGatewayProductDto): Promise<void> {
        await this.stripe.products.update(dto.productId, dto);
    }

    async createPrice(dto: CreateGatewayPriceDto): Promise<GatewayPrice> {
        const price = await this.stripe.prices.create(dto);

        if (!price.recurring?.interval)
            throw new AppException(code.stripePriceRecurringError, HttpStatus.BAD_REQUEST, "Stripe price recurring interval not found");

        return {
            id: price.id,
            active: price.active,
            product: typeof price.product === 'string' ? price.product : price.product.id,
            unit_amount: price.unit_amount ?? 0,
            recurring: {
                interval: price.recurring.interval as GatewayRecurringInterval,
            },
        };
    }

    async updatePrice(dto: UpdateGatewayPriceDto): Promise<void> {
        await this.stripe.prices.update(dto.priceId, dto);
    }

    async createCoupon(dto: CreateGatewayCouponDto): Promise<GatewayCoupon> {
        if (!hasValue(dto.currency))
            throw new AppException(code.stripeCouponCurrencyNotFoundError, HttpStatus.BAD_REQUEST, "Stripe coupon currency not found");

        const coupon = await this.stripe.coupons.create(dto);
        const currency = hasValue(coupon.currency)
            ? toDomainCurrency(coupon.currency)
            : toDomainCurrency(dto.currency);

        return {
            id: coupon.id,
            percent_off: coupon.percent_off,
            amount_off: coupon.amount_off,
            currency,
        };
    }

    async deleteCoupon(couponId: string): Promise<void> {
        await this.stripe.coupons.del(couponId);
    }

}
