import { code } from "@shared/domain/constant/errors.constant";
import { AppException } from "@shared/domain/exception/app.exception";
import { hasValue } from "@shared/domain/function/has-value.function";
import { subscriptionStatus, SubscriptionStatus } from "@billing/domain/subscription/constant/subscription-status.constant";
import { CreateSubscriptionProps } from "@billing/domain/subscription/props/create-subscription.props";

export class Subscription {

    private readonly _id?: number;
    private readonly _priceId: number;
    private readonly _condominiumId: number;
    private _invoiceEmail?: string | null;
    private _status: SubscriptionStatus;
    private _externalCustomerId?: string | null;
    private _externalSubscriptionId?: string | null;
    private readonly _paymentMethod: string;
    private readonly _billingDay?: number;
    private readonly _units: number;
    private _overdueInvoiceId?: number;
    private _overdueSince?: Date | null;
    private _startsAt?: Date | null;
    private _endsAt?: Date | null;
    private readonly _createdAt?: Date;
    private _updatedAt?: Date;
    private readonly _deletedAt?: Date | null;

    constructor(data: CreateSubscriptionProps) {
        this._priceId = data.priceId;
        this._condominiumId = data.condominiumId;
        this._invoiceEmail = data.invoiceEmail ?? null;
        this._status = data.status ?? subscriptionStatus.active;
        this._externalCustomerId = data.externalCustomerId ?? null;
        this._externalSubscriptionId = data.externalSubscriptionId ?? null;
        this._paymentMethod = data.paymentMethod ?? "BOLETO";
        this._billingDay = data.billingDay;
        this._units = data.units;
        this._overdueInvoiceId = data.overdueInvoiceId;
        this._overdueSince = data.overdueSince ?? null;
        this._startsAt = data.startsAt ?? null;
        this._endsAt = data.endsAt ?? null;

        this.validate();
    }

    get id() {
        if (!hasValue(this._id))
            throw new AppException(code.subscriptionIdEmptyError, 500);
        return this._id;
    }
    get priceId() { return this._priceId; }
    get condominiumId() { return this._condominiumId; }
    get invoiceEmail() { return this._invoiceEmail; }
    get status() { return this._status; }
    get externalCustomerId() { return this._externalCustomerId; }
    get externalSubscriptionId() { return this._externalSubscriptionId; }
    get paymentMethod() { return this._paymentMethod; }
    get billingDay() { return this._billingDay; }
    get units() { return this._units; }
    get overdueInvoiceId() { return this._overdueInvoiceId; }
    get overdueSince() { return this._overdueSince; }
    get startsAt() { return this._startsAt; }
    get endsAt() { return this._endsAt; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get deletedAt() { return this._deletedAt; }

    private validate(): void {
        if (!hasValue(this._priceId))
            throw new AppException(code.subscriptionPriceIdEmptyError, 400);

        if (this._priceId < 1)
            throw new AppException(code.subscriptionPriceIdInvalidError, 400);

        if (!hasValue(this._condominiumId))
            throw new AppException(code.subscriptionCondominiumIdEmptyError, 400);

        if (this._condominiumId < 1)
            throw new AppException(code.subscriptionCondominiumIdInvalidError, 400);

        if (hasValue(this._invoiceEmail) && this._invoiceEmail.isBlank())
            throw new AppException(code.subscriptionInvoiceEmailEmptyError, 400);

        if (!hasValue(this._status))
            throw new AppException(code.subscriptionStatusEmptyError, 400);

        if (!Object.values(subscriptionStatus).includes(this._status))
            throw new AppException(code.subscriptionStatusInvalidError, 400);

        if (hasValue(this._externalCustomerId) && this._externalCustomerId.isBlank())
            throw new AppException(code.subscriptionExternalCustomerIdEmptyError, 400);

        if (hasValue(this._externalSubscriptionId) && this._externalSubscriptionId.isBlank())
            throw new AppException(code.subscriptionExternalSubscriptionIdEmptyError, 400);

        if (!hasValue(this._paymentMethod) || this._paymentMethod.isBlank())
            throw new AppException(code.subscriptionPaymentMethodEmptyError, 400);

        if (!["CREDIT_CARD", "BOLETO"].includes(this._paymentMethod))
            throw new AppException(code.subscriptionPaymentMethodInvalidError, 400);

        if (hasValue(this._billingDay) && (!Number.isInteger(this._billingDay) || this._billingDay < 1 || this._billingDay > 31))
            throw new AppException(code.subscriptionBillingDayInvalidError, 400);

        if (!hasValue(this._units))
            throw new AppException(code.subscriptionUnitsEmptyError, 400);

        if (!Number.isInteger(this._units) || this._units < 1)
            throw new AppException(code.subscriptionUnitsInvalidError, 400);

        if (hasValue(this._overdueInvoiceId) && this._overdueInvoiceId < 1)
            throw new AppException(code.subscriptionOverdueInvoiceIdInvalidError, 400);

        if (hasValue(this._startsAt) && hasValue(this._endsAt) && this._endsAt < this._startsAt)
            throw new AppException(code.subscriptionEndsAtInvalidError, 400);
    }

    activate(): void {
        this._status = subscriptionStatus.active;
        this._endsAt = null;
        this._overdueSince = null;
        this._overdueInvoiceId = undefined;
    }

    suspend(overdueSince: Date, overdueInvoiceId: number): void {
        if (!hasValue(overdueSince))
            throw new AppException(code.subscriptionEndsAtInvalidError, 400);

        if (!hasValue(overdueInvoiceId) || overdueInvoiceId < 1)
            throw new AppException(code.subscriptionOverdueInvoiceIdInvalidError, 400);

        this._status = subscriptionStatus.suspended;
        this._overdueSince = overdueSince;
        this._overdueInvoiceId = overdueInvoiceId;
    }

    markOverdue(overdueSince: Date, overdueInvoiceId: number): void {
        if (!hasValue(overdueSince))
            throw new AppException(code.subscriptionEndsAtInvalidError, 400);

        if (!hasValue(overdueInvoiceId) || overdueInvoiceId < 1)
            throw new AppException(code.subscriptionOverdueInvoiceIdInvalidError, 400);

        this._status = subscriptionStatus.overdue;
        this._overdueSince = overdueSince;
        this._overdueInvoiceId = overdueInvoiceId;
    }

    cancel(endsAt: Date): void {
        if (!hasValue(endsAt))
            throw new AppException(code.subscriptionEndsAtInvalidError, 400);

        if (hasValue(this._startsAt) && endsAt < this._startsAt)
            throw new AppException(code.subscriptionEndsAtInvalidError, 400);

        this._status = subscriptionStatus.cancelled;
        this._endsAt = endsAt;
    }

    restore(startsAt?: Date | null): void {
        if (hasValue(startsAt))
            this._startsAt = startsAt;

        this._status = subscriptionStatus.active;
        this._endsAt = null;
        this._overdueSince = null;
        this._overdueInvoiceId = undefined;
    }

    linkExternalCustomerId(externalCustomerId: string | null): void {
        if (hasValue(externalCustomerId) && externalCustomerId.isBlank())
            throw new AppException(code.subscriptionExternalCustomerIdEmptyError, 400);

        this._externalCustomerId = externalCustomerId;
    }

    linkExternalSubscriptionId(externalSubscriptionId: string | null): void {
        if (hasValue(externalSubscriptionId) && externalSubscriptionId.isBlank())
            throw new AppException(code.subscriptionExternalSubscriptionIdEmptyError, 400);

        this._externalSubscriptionId = externalSubscriptionId;
    }

    changeInvoiceEmail(invoiceEmail: string | null): void {
        if (hasValue(invoiceEmail) && invoiceEmail.isBlank())
            throw new AppException(code.subscriptionInvoiceEmailEmptyError, 400);

        this._invoiceEmail = invoiceEmail;
    }

}
