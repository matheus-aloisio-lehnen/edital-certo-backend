import { Plan } from "@domain/product/entity/plan.entity";
import { PlanKey } from "@domain/product/constant/plan-key.constant";
import { Page, PageParamsInput } from "@domain/@shared/type/page.type";
import { CreatePlanProps } from "@domain/product/props/create-plan.props";

export interface IPlanRepository {
    findAll(params: PageParamsInput): Promise<Page<Plan>>;
    findAllByKey(keys: PlanKey[]): Promise<Plan[]>;
    findById(id: number): Promise<Plan | null>;
    findByKey(key: PlanKey): Promise<Plan | null>;
    save(plan: Plan): Promise<Plan>;
    saveBulk(plans: Plan[]): Promise<Plan[]>;
}

export interface IFindPlanUsecase {
    findAll(params: PageParamsInput): Promise<Page<Plan>>;
    findById(id: number): Promise<Plan | null>;
    findByKey(key: PlanKey): Promise<Plan | null>;
}

export interface ICreatePlanUsecase {
    create(input: CreatePlanProps): Promise<Plan>;
    createBulk(inputList: CreatePlanProps[]): Promise<Plan[]>;
}

export interface IUpdatePlanUsecase {
    deactivate(id: number): Promise<Plan>;
}