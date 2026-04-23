import { code } from "@shared/domain/constant/code.constant";
import { AppException } from "@shared/domain/exception/app.exception";
import { Discount } from "@billing/domain/discount/entity/discount.entity";
import { billingCycle, BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";
import { hasValue } from "@shared/domain/function/has-value.function";

export class Price {

    private readonly _id?: number;
    private readonly _planId?: number;
    private readonly _billingCycle: BillingCycle;
    private readonly _value: number;
    private _discount?: Discount;
    private _isActive: boolean;
    private _externalPriceId?: string;
    private readonly _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(data: CreatePriceProps) {
        this._planId = data.planId;
        this._billingCycle = data.billingCycle;
        this._value = data.value;
        this._discount = data.discount ? new Discount(data.discount) : undefined;
        this._isActive = true;
        this._externalPriceId = data.externalPriceId;

        this.validate();
    }

    get id(): number {
        if (!hasValue(this._id))
            throw new AppException(code.priceIdEmptyError, 500);

        return this._id;
    }
    get planId(): number {
        if (!hasValue(this._planId))
            throw new AppException(code.pricePlanIdEmptyError, 500);

        return this._planId;
    }
    get billingCycle() { return this._billingCycle; }
    get value() { return this._value; }
    get discount() { return this._discount; }
    get isActive() { return this._isActive; }
    get externalPriceId() { return this._externalPriceId; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }

    private validate(): void {
        if (hasValue(this._planId) && this._planId < 1)
            throw new AppException(code.pricePlanIdInvalidError, 400);

        if (!hasValue(this._billingCycle))
            throw new AppException(code.priceBillingCycleEmptyError, 400);

        if (this._billingCycle !== billingCycle.monthly && this._billingCycle !== billingCycle.yearly)
            throw new AppException(code.priceBillingCycleInvalidError, 400);

        if (!hasValue(this._value) || this._value < 0)
            throw new AppException(code.priceValueNegativeError, 400);

        if (hasValue(this._externalPriceId) && this._externalPriceId.isBlank())
            throw new AppException(code.priceExternalIdEmptyError, 400);
    }

    activate(): void {
        this._isActive = true;
    }

    deactivate(): void {
        this._isActive = false;
    }

    linkExternalPriceId(externalPriceId: string): void {
        this._externalPriceId = externalPriceId;
    }

    attachDiscount(discount: Discount): void {
        this._discount = discount;
    }


}
