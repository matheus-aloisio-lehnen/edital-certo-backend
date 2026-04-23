import { Discount } from "@billing/domain/discount/entity/discount.entity";
import { CreateDiscountProps } from "@billing/domain/discount/props/create-discount.props";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";

export class DiscountFactory {

    static create(props: CreateDiscountProps): Discount {
        return new Discount(props);
    }

    static rehydrate(model: DiscountModel): Discount {
        const discount: Discount = Object.create(Discount.prototype);
        Object.assign(discount, {
            _id: model.id,
            _priceId: model.priceId,
            _name: model.name,
            _value: model.value,
            _type: model.type,
            _duration: model.duration,
            _count: model.count,
            _campaignStartsAt: model.campaignStartsAt,
            _campaignEndsAt: model.campaignEndsAt,
            _externalDiscountId: model.externalDiscountId,
            _createdAt: model.createdAt,
            _updatedAt: model.updatedAt,
            _deletedAt: model.deletedAt,
        });
        return discount;
    }

    static rehydrateBulk(modelList: DiscountModel[]): Discount[] {
        return modelList.map(model => this.rehydrate(model));
    }

    static toModel(discount: Discount): DiscountModel {
        const model: DiscountModel = Object.create(DiscountModel.prototype);

        model.id = discount.id;
        model.priceId = discount.priceId;
        model.name = discount.name;
        model.type = discount.type;
        model.value = discount.value;
        model.duration = discount.duration;
        model.count = discount.count ?? null;
        model.campaignStartsAt = discount.campaignStartsAt;
        model.campaignEndsAt = discount.campaignEndsAt;
        model.externalDiscountId = discount.externalDiscountId ?? null;

        if (discount.deletedAt !== undefined)
            model.deletedAt = discount.deletedAt;

        return model;
    }

    static toModelBulk(discountList: Discount[]): DiscountModel[] {
        return discountList.map(discount => this.toModel(discount));
    }

}
