import { code } from "@shared/domain/constant/errors.constant";
import { AppException } from "@shared/domain/exception/app.exception";
import { billingCycle, BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { billingType, BillingType } from "@billing/domain/price/constant/billing-type.constant";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";
import { hasValue } from "@shared/domain/function/has-value.function";
import { Discount } from "@billing/domain/discount/entity/discount.entity";

export class Price {

    private readonly _id?: number;
    private readonly _productId?: number;
    private readonly _cycle: BillingCycle;
    private readonly _type: BillingType;
    private readonly _value: number;
    private readonly _version: number;
    private _isActive: boolean;
    private _externalPriceId?: string | null;
    private _discount?: Discount;
    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;
    private readonly _deletedAt?: Date | null;

    constructor(data: CreatePriceProps) {
        this._productId = data.productId;
        this._cycle = data.cycle;
        this._type = data.type;
        this._value = data.value;
        this._version = data.version ?? 1;
        this._isActive = true;
        this._externalPriceId = data.externalPriceId ?? null;
        this._discount = data.discount ? new Discount(data.discount) : undefined;

        this.validate();
    }

    get id(): number {
        if (!hasValue(this._id))
            throw new AppException(code.priceIdEmptyError, 500);

        return this._id;
    }
    get productId() { return this._productId }
    get cycle() { return this._cycle }
    get type() { return this._type }
    get value() { return this._value }
    get version() { return this._version }
    get isActive() { return this._isActive }
    get externalPriceId() { return this._externalPriceId }
    get discount() { return this._discount }
    get createdAt() { return this._createdAt }
    get updatedAt() { return this._updatedAt }
    get deletedAt() { return this._deletedAt }

    private validate(): void {
        if (hasValue(this._productId) && this._productId < 1)
            throw new AppException(code.priceProductIdInvalidError, 400);

        if (!hasValue(this._cycle))
            throw new AppException(code.priceCycleEmptyError, 400);

        if (!Object.values(billingCycle).includes(this._cycle))
            throw new AppException(code.priceCycleInvalidError, 400);

        if (!hasValue(this._type))
            throw new AppException(code.priceTypeEmptyError, 400);

        if (!Object.values(billingType).includes(this._type))
            throw new AppException(code.priceTypeInvalidError, 400);

        if (!hasValue(this._value) || !Number.isInteger(this._value) || this._value < 0)
            throw new AppException(code.priceValueNegativeError, 400);

        if (!hasValue(this._version) || this._version < 1)
            throw new AppException(code.priceVersionInvalidError, 400);

        if (hasValue(this._externalPriceId) && this._externalPriceId.isBlank())
            throw new AppException(code.priceExternalIdEmptyError, 400);
    }

    linkExternalPriceId(externalPriceId: string | null): void {
        if (hasValue(externalPriceId) && externalPriceId.isBlank())
            throw new AppException(code.priceExternalIdEmptyError, 400);

        this._externalPriceId = externalPriceId;
    }

    attachDiscount(discount: Discount): void {
        this._discount = discount;
    }

    activate(): void {
        this._isActive = true;
    }

    deactivate(): void {
        this._isActive = false;
    }

}
