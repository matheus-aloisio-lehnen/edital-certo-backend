import { Money } from "@domain/@shared/value-object/money.value-object";
import { Price } from "@product/entity/price.entity";
import { DiscountFactory } from "@product/factory/discount.factory";
import { CreatePriceProps } from "@product/props/create-price.props";
import { PriceModel } from "@persistence/database/postgres/typeorm/model/product/price.model";
import { Currency } from "@domain/@shared/type/language.type";

export class PriceFactory {

    static create(props: CreatePriceProps): Price {
        return new Price(props);
    }

    static createBulk(propsList: CreatePriceProps[]): Price[] {
        return propsList.map(props => this.create(props));
    }

    static rehydrate(model: PriceModel): Price {
        const price: Price = Object.create(Price.prototype);
        const discount = model.discounts?.first?.(); // ou [0]
        const currency = model.currency as Currency;

        Object.assign(price, {
            _id: model.id,
            _planId: model.planId,
            _key: model.key,
            _currency: model.currency,
            _billingCycle: model.billingCycle,
            _value: Money.fromInteger(model.value, currency),
            _externalPriceId: model.externalPriceId,
            _isActive: model.isActive,
            _createdAt: model.createdAt,
            _updatedAt: model.updatedAt,
        });

        if (discount)
            price.attachDiscount(DiscountFactory.rehydrate(discount))

        return price;
    }

    static rehydrateBulk(modelList: PriceModel[]): Price[] {
        return modelList.map(model => this.rehydrate(model));
    }

    static toModel(price: Price): PriceModel {
        const result = new PriceModel();

        result.id = price.id;
        result.planId = price.planId;
        result.key = price.key;
        result.currency = price.currency;
        result.billingCycle = price.billingCycle;
        result.value = price.value.amount;
        result.isActive = price.isActive;
        result.externalPriceId = price.externalPriceId ?? null;

        return result;
    }

    static toModelBulk(priceList: Price[]): PriceModel[] {
        return priceList.map(price => this.toModel(price));
    }

}