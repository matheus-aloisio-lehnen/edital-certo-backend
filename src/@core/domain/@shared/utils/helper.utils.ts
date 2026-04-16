import { billingCycle, BillingCycle } from "@product/constant/billing-cycle.constant";
import { Currency } from "@domain/@shared/type/language.type";
import { DiscountDuration } from "@product/constant/discount.constant";

export const hasValue = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined && value !== '';

export const toGatewayRecurringInterval = (cycle: BillingCycle): string =>
    cycle === billingCycle.monthly
        ? "month"
        : "year";

export const toGatewayCurrency = (currency: Currency): string => currency.toLowerCase();

export const toGatewayDiscountDuration = (duration: DiscountDuration): string => duration.toLowerCase();