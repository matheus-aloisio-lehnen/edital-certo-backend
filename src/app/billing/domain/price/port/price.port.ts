import { Page, PageParams } from "@shared/domain/type/page.type";
import { Price } from "@billing/domain/price/entity/price.entity";
import { BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";

export const priceRepositoryPort = Symbol('priceRepositoryPort');
export const findPriceUsecasePort = Symbol('findPriceUsecasePort');
export const createPriceUsecasePort = Symbol('createPriceUsecasePort');
export const deactivatePriceUsecasePort = Symbol('deactivatePriceUsecasePort');

export interface IPriceRepository {
    findAll(params: PageParams): Promise<Page<Price>>;
    findById(id: number): Promise<Price | null>;
    findByProductIdAndBillingCycle(productId: number, billingCycle: BillingCycle): Promise<Price | null>;
    save(price: Price): Promise<Price>;
}

export interface IFindPriceUsecase {
    findAll(params: PageParams): Promise<Page<Price>>;
    findById(id: number): Promise<Price | null>;
}

export interface ICreatePriceUsecase {
    execute(input: CreatePriceProps): Promise<Price>;
}

export interface IDeactivatePriceUsecase {
    execute(id: number): Promise<Price>;
}
