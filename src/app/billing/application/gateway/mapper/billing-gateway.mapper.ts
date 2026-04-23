import { billingCycle, BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { GatewayRecurringInterval } from "@billing/application/gateway/dto/create-gateway-price.dto";
import { DiscountDuration } from "@billing/domain/discount/constant/discount.constant";
import { Currency } from "@shared/domain/type/language.type";
import { GatewayDiscountDuration } from "@billing/application/gateway/dto/create-gateway-coupon.dto";

export const toGatewayRecurringInterval = (cycle: BillingCycle): GatewayRecurringInterval =>
    cycle === billingCycle.monthly
        ? "month"
        : "year";

export const toGatewayCurrency = (currency: Currency): string => currency.toLowerCase();
export const toGatewayDiscountDuration = (duration: DiscountDuration) => duration.toLowerCase() as GatewayDiscountDuration;

export const toDomainCurrency = (value: string) => value.toUpperCase() as Currency;
