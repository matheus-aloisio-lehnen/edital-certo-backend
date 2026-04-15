import { code } from "@domain/@shared/constant/code.constant";
import { AppException } from "@domain/@shared/exception/app.exception";
import { Currency } from "@domain/@shared/type/language.type";
import { Discount } from "@domain/product/entity/discount.entity";
import { Money } from "@domain/@shared/value-object/money.value-object";
import { billingCycle, BillingCycle } from "@domain/product/constant/billing-cycle.constant";
import { PriceKey } from "@domain/product/constant/price-key.constant";
import { CreatePriceProps } from "@domain/product/props/create-price.props";
import { hasValue } from "@domain/@shared/utils/helper.utils";

export class Price {

    private readonly _id?: number;
    private readonly _key: PriceKey;
    private readonly _planId?: number;
    private readonly _currency: Currency;
    private readonly _billingCycle: BillingCycle;
    private readonly _value: Money;
    private readonly _discount?: Discount;
    private _isActive: boolean;
    private _externalPriceId?: string;
    private readonly _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(data: CreatePriceProps) {
        this._planId = data.planId;
        this._key = data.key;
        this._currency = data.currency;
        this._billingCycle = data.billingCycle;
        this._value = Money.fromInteger(data.value, data.currency);
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
    get key() { return this._key; }
    get planId(): number {
        if (!hasValue(this._planId))
            throw new AppException(code.pricePlanIdEmptyError, 500);

        return this._planId;
    }
    get currency() { return this._currency; }
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

        if (!this._key || this._key.trim() === "")
            throw new AppException(code.priceKeyEmptyError, 400);

        if (!hasValue(this._billingCycle))
            throw new AppException(code.priceBillingCycleEmptyError, 400);

        if (this._billingCycle !== billingCycle.monthly && this._billingCycle !== billingCycle.yearly)
            throw new AppException(code.priceBillingCycleInvalidError, 400);

        if (this._value.code !== this._currency)
            throw new AppException(code.moneyCurrencyMismatchError, 400);

        if (this._value.amount < 0)
            throw new AppException(code.priceValueNegativeError, 400);

        if (hasValue(this._externalPriceId) && this._externalPriceId.trim() === "")
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

}