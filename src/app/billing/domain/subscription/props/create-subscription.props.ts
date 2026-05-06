import { SubscriptionStatus } from "@billing/domain/subscription/constant/subscription-status.constant";

export type CreateSubscriptionProps = {
    priceId: number;
    condominiumId: number;
    invoiceEmail?: string | null;
    status?: SubscriptionStatus;
    externalCustomerId?: string | null;
    externalSubscriptionId?: string | null;
    paymentMethod?: string;
    billingDay?: number;
    units: number;
    overdueInvoiceId?: number;
    overdueSince?: Date | null;
    startsAt?: Date | null;
    endsAt?: Date | null;
};
