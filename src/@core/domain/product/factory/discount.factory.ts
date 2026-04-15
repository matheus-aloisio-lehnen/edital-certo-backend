import { Discount } from "@domain/product/entity/discount.entity";
import { CreateDiscountProps } from "@domain/product/props/create-discount.props";

export class DiscountFactory {

    static create(data: CreateDiscountProps): Discount {
        return new Discount(data);
    }

    static rehydrate(data: any): Discount {
        const discount = Object.create(Discount.prototype);
        Object.assign(discount, {
            _id: data.id,
            _priceId: data.priceId,
            _key: data.key,
            _name: data.name,
            _value: data.value,
            _type: data.type,
            _duration: data.duration,
            _count: data.count,
            _campaignStartsAt: data.campaignStartsAt,
            _campaignEndsAt: data.campaignEndsAt,
            _isActive: data.isActive,
            _externalDiscountId: data.externalDiscountId || data.externalCouponId,
            _createdAt: data.createdAt,
            _updatedAt: data.updatedAt,
            _deletedAt: data.deletedAt,
        });
        return discount;
    }

}
