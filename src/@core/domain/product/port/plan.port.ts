import { Plan } from "@product/entity/plan.entity";
import { PlanKey } from "@product/constant/plan-key.constant";
import { Page, PageParams } from "@domain/@shared/type/page.type";
import { CreatePlanProps } from "@product/props/create-plan.props";

export const planRepositoryPort = Symbol('planRepositoryPort');
export const findPlanUsecasePort = Symbol('findPlanUsecasePort');
export const createPlanUsecasePort = Symbol('createPlanUsecasePort');
export const updatePlanUsecasePort = Symbol('updatePlanUsecasePort');

export interface IPlanRepository {
    findAll(params: PageParams): Promise<Page<Plan>>;
    findAllByKey(keys: PlanKey[]): Promise<Plan[]>;
    findById(id: number): Promise<Plan | null>;
    findByKey(key: PlanKey): Promise<Plan | null>;
    save(plan: Plan): Promise<Plan>;
    saveBulk(plans: Plan[]): Promise<Plan[]>;
}

export interface IFindPlanUsecase {
    findAll(params: PageParams): Promise<Page<Plan>>;
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