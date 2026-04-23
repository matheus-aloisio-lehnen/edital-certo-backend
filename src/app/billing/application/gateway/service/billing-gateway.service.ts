import { currency } from "@shared/domain/type/language.type";
import { discountDuration, discountType } from "@billing/domain/discount/constant/discount.constant";
import { Discount } from "@billing/domain/discount/entity/discount.entity";
import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { Price } from "@billing/domain/price/entity/price.entity";
import { CreateGatewayCouponDto } from "@billing/application/gateway/dto/create-gateway-coupon.dto";
import { CreateGatewayPriceDto } from "@billing/application/gateway/dto/create-gateway-price.dto";
import { CreateGatewayProductDto } from "@billing/application/gateway/dto/create-gateway-product.dto";
import { UpdateGatewayPriceDto } from "@billing/application/gateway/dto/update-gateway-price.dto";
import { UpdateGatewayProductDto } from "@billing/application/gateway/dto/update-gateway-product.dto";
import { toGatewayCurrency, toGatewayDiscountDuration, toGatewayRecurringInterval } from "@billing/application/gateway/mapper/billing-gateway.mapper";
import { IBillingGatewayClient, IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";

export class BillingGatewayService implements IBillingGatewayService {

    constructor(
        private readonly gatewayClient: IBillingGatewayClient
    ) {
    }

    async syncPlan(plan: Plan): Promise<void> {
        const externalPlanId = await this.syncExternalPlan(plan);
        await Promise.all(plan.prices.map(price => this.syncPrice(plan.id, externalPlanId, price)));
    }

    async syncPrice(planId: number, externalPlanId: string, price: Price): Promise<void> {
        if (!price.externalPriceId) {
            const dto: CreateGatewayPriceDto = {
                currency: toGatewayCurrency(currency.brl),
                active: price.isActive,
                product: externalPlanId,
                recurring: {
                    interval: toGatewayRecurringInterval(price.billingCycle),
                },
                unit_amount: price.value,
                metadata: {
                    planId: String(planId),
                    priceId: String(price.id),
                    billingCycle: price.billingCycle,
                },
            };

            const createdPrice = await this.gatewayClient.createPrice(dto);
            price.linkExternalPriceId(createdPrice.id);
        }

        const dto: UpdateGatewayPriceDto = {
            priceId: price.externalPriceId!,
            active: price.isActive,
        };

        await this.gatewayClient.updatePrice(dto);

        if (!price.discount)
            return;

        await this.syncDiscount(price.discount);
    }

    async syncDiscount(discount: Discount): Promise<void> {
        if (discount.externalDiscountId)
            return;

        const createCouponDto: CreateGatewayCouponDto = {
            duration: toGatewayDiscountDuration(discount.duration),
            duration_in_months: discount.duration === discountDuration.repeating ? discount.count : undefined,
            percent_off: discount.type === discountType.percent ? discount.value : undefined,
            amount_off: discount.type === discountType.fixed ? discount.value : undefined,
            currency: discount.type === discountType.fixed ? toGatewayCurrency(currency.brl) : undefined,
            metadata: {
                discountId: String(discount.id),
            },
        };

        const createdCoupon = await this.gatewayClient.createCoupon(createCouponDto);
        discount.linkExternalDiscountId(createdCoupon.id);
    }

    async deactivatePlan(plan: Plan): Promise<void> {
        if (!plan.externalPlanId)
            return;

        const dto: UpdateGatewayProductDto = {
            productId: plan.externalPlanId,
            active: false,
        };

        await this.gatewayClient.updateProduct(dto);
    }

    async deactivatePrice(price: Price): Promise<void> {
        if (!price.externalPriceId)
            return;

        const dto: UpdateGatewayPriceDto = {
            priceId: price.externalPriceId,
            active: false,
        };

        await this.gatewayClient.updatePrice(dto);
    }

    async deleteDiscount(discount: Discount): Promise<void> {
        if (!discount.externalDiscountId)
            return;

        await this.gatewayClient.deleteCoupon(discount.externalDiscountId);
    }

    private async syncExternalPlan(plan: Plan): Promise<string> {
        if (plan.externalPlanId) {
            const dto: UpdateGatewayProductDto = {
                productId: plan.externalPlanId,
                active: plan.isActive,
            };

            await this.gatewayClient.updateProduct(dto);

            return plan.externalPlanId;
        }

        const dto: CreateGatewayProductDto = {
            name: plan.name,
            active: plan.isActive,
            statement_descriptor: plan.name,
            metadata: {
                planId: String(plan.id),
            },
        };

        const createdProduct = await this.gatewayClient.createProduct(dto);
        plan.linkExternalPlanId(createdProduct.id);

        return createdProduct.id;
    }
}
