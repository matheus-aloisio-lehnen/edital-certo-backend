import { Price } from "@billing/domain/price/entity/price.entity";
import { DiscountFactory } from "@billing/domain/discount/factory/discount.factory";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";

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

        Object.assign(price, {
            _id: model.id,
            _planId: model.planId,
            _billingCycle: model.billingCycle,
            _value: model.value,
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
        result.billingCycle = price.billingCycle;
        result.value = price.value;
        result.isActive = price.isActive;
        result.externalPriceId = price.externalPriceId ?? null;

        return result;
    }

    static toModelBulk(priceList: Price[]): PriceModel[] {
        return priceList.map(price => this.toModel(price));
    }

}
