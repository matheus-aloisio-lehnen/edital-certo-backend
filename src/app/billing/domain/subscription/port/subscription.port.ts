import { Page, PageParams } from "@shared/domain/type/page.type";
import { Subscription } from "@billing/domain/subscription/entity/subscription.entity";
import { CreateSubscriptionProps } from "@billing/domain/subscription/props/create-subscription.props";

export const subscriptionRepositoryPort = Symbol("subscriptionRepositoryPort");
export const findSubscriptionUsecasePort = Symbol("findSubscriptionUsecasePort");
export const createSubscriptionUsecasePort = Symbol("createSubscriptionUsecasePort");

export interface ISubscriptionRepository {
    findAll(params: PageParams): Promise<Page<Subscription>>;
    findById(id: number): Promise<Subscription | null>;
    save(subscription: Subscription): Promise<Subscription>;
}

export interface IFindSubscriptionUsecase {
    findAll(params: PageParams): Promise<Page<Subscription>>;
    findById(id: number): Promise<Subscription | null>;
}

export interface ICreateSubscriptionUsecase {
    execute(input: CreateSubscriptionProps): Promise<Subscription>;
}
