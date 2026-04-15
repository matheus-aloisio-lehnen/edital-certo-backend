import { Currency } from "@domain/@shared/type/language.type";
import { Discount } from "@domain/product/entity/discount.entity";
import { Plan } from "@domain/product/entity/plan.entity";
import { Price } from "@domain/product/entity/price.entity";
import { CreateGatewayCouponDto } from "@domain/product/dto/create-gateway-coupon.dto";
import { CreateGatewayPriceDto } from "@domain/product/dto/create-gateway-price.dto";
import { CreateGatewayProductDto } from "@domain/product/dto/create-gateway-product.dto";
import { UpdateGatewayPriceDto } from "@domain/product/dto/update-gateway-price.dto";
import { UpdateGatewayProductDto } from "@domain/product/dto/update-gateway-product.dto";
import { IProductGatewayClient, IProductGatewayService } from "@domain/product/port/product-payment-gateway.port";
import { discountDuration, discountType } from "@domain/product/constant/discount.constant";
import { toGatewayCurrency, toGatewayDiscountDuration, toGatewayRecurringInterval } from "@domain/@shared/utils/helper.utils";
import { PlanKey } from "@domain/product/constant/plan-key.constant";

export class ProductGatewayService implements IProductGatewayService {

    constructor(private readonly gatewayClient: IProductGatewayClient) {}

    async syncPlan(plan: Plan): Promise<void> {
        const externalPlanId = await this.syncExternalPlan(plan);
        await Promise.all(plan.prices.map(price => this.syncPrice(plan.id, plan.key, externalPlanId, price)));
    }

    async syncPrice(planId: number, planKey: PlanKey, externalPlanId: string, price: Price): Promise<void> {
        if (!price.externalPriceId) {
            const dto: CreateGatewayPriceDto = {
                currency: toGatewayCurrency(price.currency),
                active: price.isActive,
                product: externalPlanId,
                recurring: {
                    interval: toGatewayRecurringInterval(price.billingCycle),
                },
                unit_amount: price.value.amount,
                lookup_key: price.key,
                metadata: {
                    planId: String(planId),
                    planKey: planKey,
                    priceId: String(price.id),
                    priceKey: price.key,
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

        await this.syncDiscount(price.currency, price.discount);
    }

    async syncDiscount(currency: Currency, discount: Discount): Promise<void> {
        if (discount.externalDiscountId)
            return;

        const createCouponDto: CreateGatewayCouponDto = {
            duration: toGatewayDiscountDuration(discount.duration),
            duration_in_months: discount.duration === discountDuration.repeating ? discount.count : null,
            percent_off: discount.type === discountType.percent ? discount.value : null,
            amount_off: discount.type === discountType.fixed ? discount.value : null,
            currency: discount.type === discountType.fixed ? toGatewayCurrency(currency) : null,
            metadata: {
                discountKey: discount.key,
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
                planKey: plan.key,
                planId: String(plan.id),
            },
        };

        const createdProduct = await this.gatewayClient.createProduct(dto);
        plan.linkExternalPlanId(createdProduct.id);

        return createdProduct.id;
    }
}