import { QuotaRenewalCycle } from "@domain/product/constant/quota-renewal-cycle.constant";
import { FeatureKey } from "@domain/product/constant/feature-key.constant";
import { CreateFeatureProps } from "@domain/product/props/create-feature.props";
import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { hasValue } from "@domain/@shared/utils/helper.utils";

export class Feature {

    private readonly _id?: number;
    private readonly _key: FeatureKey;
    private readonly _planId?: number;

    private readonly _name: string;
    private _hidden: boolean;
    private _isActive: boolean;

    private _hasQuota: boolean;
    private _quota: number;
    private _quotaRenewalCycle: QuotaRenewalCycle;

    private readonly _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(data: CreateFeatureProps) {
        this._name = data.name;
        this._key = data.key;
        this._planId = data.planId;

        this._hidden = data.hidden ?? true;
        this._isActive = data.isActive ?? false;

        this._hasQuota = data.hasQuota ?? false;
        this._quota = data.quota ?? 0;
        this._quotaRenewalCycle = data.quotaRenewalCycle;

        this.validate();
    }

    get id(): number {
        if (!hasValue(this._id))
            throw new AppException(code.featureIdEmptyError, 500);

        return this._id;
    }

    get key() {
        return this._key;
    }

    get planId(): number {
        if (!hasValue(this._planId))
            throw new AppException(code.featurePlanIdEmptyError, 500);

        return this._planId;
    }

    get name() {
        return this._name;
    }

    get hidden() {
        return this._hidden;
    }

    get isActive() {
        return this._isActive;
    }

    get hasQuota() {
        return this._hasQuota;
    }

    get quota() {
        return this._quota;
    }

    get quotaRenewalCycle() {
        return this._quotaRenewalCycle;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    private validate(): void {
        if (!this._name || this._name.trim() === "")
            throw new AppException(code.featureNameEmptyError, 400);

        if (!this._key || this._key.trim() === "")
            throw new AppException(code.featureKeyEmptyError, 400);

        if (hasValue(this._planId) && this._planId < 1)
            throw new AppException(code.featurePlanIdInvalidError, 400);

        if (this._hasQuota && this._quota < -1)
            throw new AppException(code.featureQuotaOutOfBoundsError, 400);

        if (!this._hasQuota && this._quota !== 0)
            throw new AppException(code.featureQuotaDisabledMustBeZeroError, 400);
    }

    activate(): void {
        this._isActive = true;
    }

    deactivate(): void {
        this._isActive = false;
    }

    hide(): void {
        this._hidden = true;
    }

    show(): void {
        this._hidden = false;
    }

    enableQuota(quota: number, cycle: QuotaRenewalCycle): void {
        if (quota < -1)
            throw new AppException(code.featureQuotaOutOfBoundsError, 400);

        this._hasQuota = true;
        this._quota = quota;
        this._quotaRenewalCycle = cycle;
    }

    disableQuota(): void {
        this._hasQuota = false;
        this._quota = 0;
    }

    changeQuota(quota: number): void {
        if (!this._hasQuota)
            throw new AppException(code.featureQuotaNotEnabledError, 400);

        if (quota < -1)
            throw new AppException(code.featureQuotaOutOfBoundsError, 400);

        this._quota = quota;
    }

}