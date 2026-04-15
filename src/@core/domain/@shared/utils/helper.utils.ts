import { billingCycle, BillingCycle } from "@domain/product/constant/billing-cycle.constant";
import { Currency } from "@domain/@shared/type/language.type";
import { Discount } from "@domain/product/entity/discount.entity";
import { DiscountDuration, discountDuration } from "@domain/product/constant/discount.constant";
import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";

export const hasValue = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;

export const toGatewayRecurringInterval = (cycle: BillingCycle): string =>
    cycle === billingCycle.monthly
        ? "month"
        : "year";

export const toGatewayCurrency = (currency: Currency): string => currency.toLowerCase();

export const toGatewayDiscountDuration = (duration: DiscountDuration): string => duration.toLowerCase();