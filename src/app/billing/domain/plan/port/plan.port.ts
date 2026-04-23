import { Page, PageParams } from "@shared/domain/type/page.type";
import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { CreatePlanProps } from "@billing/domain/plan/props/create-plan.props";

export const planRepositoryPort = Symbol('planRepositoryPort');
export const findPlanUsecasePort = Symbol('findPlanUsecasePort');
export const createPlanUsecasePort = Symbol('createPlanUsecasePort');
export const deactivatePlanUsecasePort = Symbol('deactivatePlanUsecasePort');

export interface IPlanRepository {
    findAll(params: PageParams): Promise<Page<Plan>>;
    findById(id: number): Promise<Plan | null>;
    save(plan: Plan): Promise<Plan>;
}

export interface IFindPlanUsecase {
    findAll(params: PageParams): Promise<Page<Plan>>;
    findById(id: number): Promise<Plan | null>;
}

export interface ICreatePlanUsecase {
    execute(input: CreatePlanProps): Promise<Plan>;
}

export interface IDeactivatePlanUsecase {
    execute(id: number): Promise<Plan>;
}
