import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { discountDuration, DiscountDuration, discountType, DiscountType } from "@product/constant/discount.constant";
import { CreateDiscountProps } from "@product/props/create-discount.props";
import { hasValue } from "@domain/@shared/utils/helper.utils";

export class Discount {

    private readonly _id?: number;
    private readonly _priceId?: number;
    private readonly _key: string;
    private readonly _name: string;
    private readonly _value: number;
    private readonly _type: DiscountType;
    private readonly _duration: DiscountDuration;
    private readonly _count?: number;
    private readonly _campaignStartsAt: Date;
    private readonly _campaignEndsAt: Date;
    private _externalDiscountId: string | null;
    private readonly _createdAt?: Date;
    private _updatedAt?: Date;
    private _deletedAt?: Date | null;

    constructor(data: CreateDiscountProps) {
        this._priceId = data.priceId;
        this._key = data.key;
        this._name = data.name;
        this._type = data.type;
        this._value = data.value;
        this._duration = data.duration;
        this._count = data.count;
        this._campaignStartsAt = data.campaignStartsAt;
        this._campaignEndsAt = data.campaignEndsAt;
        this._externalDiscountId = data.externalDiscountId ?? null;

        this.validate();
    }

    get id(): number {
        if (!hasValue(this._id))
            throw new AppException(code.discountIdEmptyError, 500);

        return this._id;
    }
    get priceId(): number {
        if (!hasValue(this._priceId))
            throw new AppException(code.discountPriceIdEmptyError, 500);

        return this._priceId;
    }
    get key() { return this._key; }
    get name() { return this._name; }
    get value() { return this._value; }
    get type() { return this._type; }
    get duration() { return this._duration; }
    get count() { return this._count; }
    get campaignStartsAt() { return this._campaignStartsAt; }
    get campaignEndsAt() { return this._campaignEndsAt; }
    get externalDiscountId() { return this._externalDiscountId; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get deletedAt() { return this._deletedAt; }

    private validate(): void {
        const isPercent = this._type === discountType.percent;
        const isFixed = this._type === discountType.fixed;
        const isRepeating = this._duration === discountDuration.repeating;
        const isOnce = this._duration === discountDuration.once;
        const isForever = this._duration === discountDuration.forever;
        const isPercentValueValid = this._value > 0 && this._value < 100;

        if (hasValue(this._priceId) && this._priceId < 1)
            throw new AppException(code.discountPriceIdInvalidError, 400);

        if (!this._key || this._key.trim() === "")
            throw new AppException(code.discountKeyEmptyError, 400);

        if (!this._name || this._name.trim() === "")
            throw new AppException(code.discountNameEmptyError, 400);

        if (!hasValue(this._type))
            throw new AppException(code.discountTypeEmptyError, 400);

        if (!isPercent && !isFixed)
            throw new AppException(code.discountTypeInvalidError, 400);

        if (isPercent && !isPercentValueValid)
            throw new AppException(code.discountPercentValueOutOfBoundsError, 400);

        if (isFixed && this._value < 0)
            throw new AppException(code.discountValueNegativeError, 400);

        if (!hasValue(this._duration))
            throw new AppException(code.discountDurationEmptyError, 400);

        if (!isRepeating && !isOnce && !isForever)
            throw new AppException(code.discountDurationInvalidError, 400);

        if (isRepeating && !hasValue(this._count))
            throw new AppException(code.discountCountEmptyError, 400);

        if (!isRepeating && hasValue(this._count))
            throw new AppException(code.discountCountNotAllowedError, 400);

        if (hasValue(this._count) && this._count < 0)
            throw new AppException(code.discountCountNegativeError, 400);

        if (!hasValue(this._campaignStartsAt))
            throw new AppException(code.discountCampaignStartsAtEmptyError, 400);

        if (!hasValue(this._campaignEndsAt))
            throw new AppException(code.discountCampaignEndsAtEmptyError, 400);

        if (this._campaignEndsAt < this._campaignStartsAt)
            throw new AppException(code.discountCampaignEndsAtInvalidError, 400);

        if (hasValue(this._externalDiscountId) && this._externalDiscountId.trim() === "")
            throw new AppException(code.discountExternalIdEmptyError, 400);
    }

    linkExternalDiscountId(externalDiscountId: string): void {
        this._externalDiscountId = externalDiscountId;
    }

}