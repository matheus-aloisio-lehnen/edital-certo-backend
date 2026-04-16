import { Plan } from "@domain/product/entity/plan.entity";
import { FeatureFactory } from "@domain/product/factory/feature.factory";
import { PriceFactory } from "@domain/product/factory/price.factory";
import { CreatePlanProps } from "@domain/product/props/create-plan.props";
import { PlanModel } from "@persistence/database/postgres/typeorm/model/product/plan.model";

export class PlanFactory {

    static create(props: CreatePlanProps): Plan {
        return new Plan(props);
    }

    static createBulk(propsList: CreatePlanProps[]): Plan[] {
        return propsList.map(props => this.create(props));
    }

    static rehydrate(model: PlanModel): Plan {
        const plan: Plan = Object.create(Plan.prototype);
        Object.assign(plan, {
            _id: model.id,
            _key: model.key,
            _name: model.name,
            _isActive: model.isActive,
            _externalPlanId: model.externalPlanId,
            _features: model.features ? FeatureFactory.rehydrateBulk(model.features) : [],
            _prices: model.prices ? PriceFactory.rehydrateBulk(model.prices) : [],
            _createdAt: model.createdAt,
            _updatedAt: model.updatedAt,
        });
        return plan;
    }

    static rehydrateBulk(modelList: PlanModel[]): Plan[] {
        return modelList.map(model => this.rehydrate(model));
    }

    static toModel(plan: Plan): PlanModel {
        const model: PlanModel = Object.create(PlanModel.prototype) as PlanModel;

        model.id = plan.id;
        model.key = plan.key;
        model.name = plan.name;
        model.isActive = plan.isActive;
        model.externalPlanId = plan.externalPlanId ?? null;
        model.features = plan.features.map(feature => FeatureFactory.toModel(feature));
        model.prices = plan.prices.map(price => PriceFactory.toModel(price));

        return model;
    }

    static toModelBulk(planList: Plan[]): PlanModel[] {
        return planList.map(plan => this.toModel(plan));
    }

}