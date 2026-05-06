import { Price } from "@billing/domain/price/entity/price.entity";
import { DiscountFactory } from "@billing/domain/discount/factory/discount.factory";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";
import { hasValue } from "@shared/domain/function/has-value.function";

export class PriceFactory {

    static create(props: CreatePriceProps): Price {
        return new Price(props);
    }

    static createBulk(propsList: CreatePriceProps[]): Price[] {
        return propsList.map(props => this.create(props));
    }

    static rehydrate(model: PriceModel): Price {
        const price: Price = Object.create(Price.prototype);
        const discount = model.discounts?.length
            ? DiscountFactory.rehydrate(model.discounts.first()!)
            : undefined;

        Object.assign(price, {
            _id: model.id,
            _productId: model.productId,
            _cycle: model.cycle,
            _type: model.type,
            _value: model.value,
            _version: model.version,
            _isActive: model.isActive,
            _externalPriceId: model.externalPriceId,
            _discount: discount,
            _createdAt: model.createdAt,
            _updatedAt: model.updatedAt,
            _deletedAt: model.deletedAt ?? null,
        });

        return price;
    }

    static rehydrateBulk(modelList: PriceModel[]): Price[] {
        return modelList.map(model => this.rehydrate(model));
    }

    static toModel(price: Price): PriceModel {
        const result = new PriceModel();

        result.cycle = price.cycle;
        result.type = price.type;
        result.value = price.value;
        result.version = price.version;
        result.isActive = price.isActive;
        result.externalPriceId = price.externalPriceId ?? null;
        if (hasValue(price.productId))
            result.productId = price.productId;
        result.discounts = price.discount ? [DiscountFactory.toModel(price.discount)] : [];

        return result;
    }

    static toModelBulk(priceList: Price[]): PriceModel[] {
        return priceList.map(price => this.toModel(price));
    }

}
