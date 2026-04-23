import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { CreatePlanProps } from "@billing/domain/plan/props/create-plan.props";
import { PlanModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/plan.model";

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
            _name: model.name,
            _isActive: model.isActive,
            _externalPlanId: model.externalPlanId,
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
        model.name = plan.name;
        model.isActive = plan.isActive;
        model.externalPlanId = plan.externalPlanId ?? null;
        model.prices = plan.prices.map(price => PriceFactory.toModel(price));

        return model;
    }

    static toModelBulk(planList: Plan[]): PlanModel[] {
        return planList.map(plan => this.toModel(plan));
    }

}
