import { Subscription } from "@billing/domain/subscription/entity/subscription.entity";
import { CreateSubscriptionProps } from "@billing/domain/subscription/props/create-subscription.props";

export class SubscriptionFactory {

    static create(props: CreateSubscriptionProps): Subscription {
        return new Subscription(props);
    }

    static createBulk(propsList: CreateSubscriptionProps[]): Subscription[] {
        return propsList.map(props => this.create(props));
    }

    static rehydrate(model: any): Subscription {
        const subscription: Subscription = Object.create(Subscription.prototype);

        Object.assign(subscription, {
            _id: model.id,
            _priceId: model.priceId,
            _condominiumId: model.condominiumId,
            _invoiceEmail: model.invoiceEmail ?? null,
            _status: model.status,
            _externalCustomerId: model.externalCustomerId ?? null,
            _externalSubscriptionId: model.externalSubscriptionId ?? null,
            _paymentMethod: model.paymentMethod,
            _billingDay: model.billingDay,
            _units: model.units,
            _overdueInvoiceId: model.overdueInvoiceId,
            _overdueSince: model.overdueSince ?? null,
            _startsAt: model.startsAt ?? null,
            _endsAt: model.endsAt ?? null,
            _createdAt: model.createdAt,
            _updatedAt: model.updatedAt,
            _deletedAt: model.deletedAt ?? null,
        });

        return subscription;
    }

    static rehydrateBulk(modelList: any[]): Subscription[] {
        return modelList.map(model => this.rehydrate(model));
    }

    static toModel(subscription: Subscription): any {
        return {
            priceId: subscription.priceId,
            condominiumId: subscription.condominiumId,
            invoiceEmail: subscription.invoiceEmail ?? null,
            status: subscription.status,
            externalCustomerId: subscription.externalCustomerId ?? null,
            externalSubscriptionId: subscription.externalSubscriptionId ?? null,
            paymentMethod: subscription.paymentMethod,
            billingDay: subscription.billingDay,
            units: subscription.units,
            overdueInvoiceId: subscription.overdueInvoiceId,
            overdueSince: subscription.overdueSince ?? null,
            startsAt: subscription.startsAt ?? null,
            endsAt: subscription.endsAt ?? null,
        };
    }

    static toModelBulk(subscriptionList: Subscription[]): any[] {
        return subscriptionList.map(subscription => this.toModel(subscription));
    }

}
