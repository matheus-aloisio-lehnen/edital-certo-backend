import { Money } from "@domain/@shared/value-object/money.value-object";
import { Price } from "@domain/product/entity/price.entity";
import { DiscountFactory } from "@domain/product/factory/discount.factory";
import { CreatePriceProps } from "@domain/product/props/create-price.props";

export class PriceFactory {

    static create(data: CreatePriceProps): Price {
        return new Price(data);
    }

    static createBulk(dataList: CreatePriceProps[]): Price[] {
        return dataList.map(data => this.create(data));
    }

    static rehydrate(data: any): Price {
        const price = Object.create(Price.prototype);
        Object.assign(price, {
            _id: data.id,
            _planId: data.planId,
            _key: data.key,
            _currency: data.currency,
            _billingCycle: data.billingCycle,
            _value: data.value ? Money.fromInteger(data.value.amount, data.value.code) : data.value,
            _discount: data.discount ? DiscountFactory.rehydrate(data.discount) : null,
            _externalPriceId: data.externalPriceId,
            _isActive: data.isActive,
            _createdAt: data.createdAt,
            _updatedAt: data.updatedAt,
            _deletedAt: data.deletedAt,
        });
        return price;
    }

    static rehydrateBulk(dataList: any[]): Price[] {
        return dataList.map(data => this.rehydrate(data));
    }

}
