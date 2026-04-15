import { Plan } from "@domain/product/entity/plan.entity";
import { FeatureFactory } from "@domain/product/factory/feature.factory";
import { PriceFactory } from "@domain/product/factory/price.factory";
import { CreatePlanProps } from "@domain/product/props/create-plan.props";

export class PlanFactory {

    static create(data: CreatePlanProps): Plan {
        return new Plan(data);
    }

    static createBulk(data: CreatePlanProps[]): Plan[] {
        return data.map(data => this.create(data));
    }

    static rehydrate(data: any): Plan {
        const plan = Object.create(Plan.prototype);
        Object.assign(plan, {
            _id: data.id,
            _key: data.key,
            _name: data.name,
            _isActive: data.isActive,
            _externalPlanId: data.externalProductId,
            _features: data.features ? FeatureFactory.rehydrateBulk(data.features) : [],
            _prices: data.prices ? PriceFactory.rehydrateBulk(data.prices) : [],
            _createdAt: data.createdAt,
            _updatedAt: data.updatedAt,
            _deletedAt: data.deletedAt,
        });
        return plan;
    }

    static rehydrateBulk(dataList: any[]): Plan[] {
        return dataList.map(data => this.rehydrate(data));
    }

}
