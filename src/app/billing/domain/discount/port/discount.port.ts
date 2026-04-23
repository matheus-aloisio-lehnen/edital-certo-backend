import { Page, PageParams } from "@shared/domain/type/page.type";
import { Discount } from "@billing/domain/discount/entity/discount.entity";
import { CreateDiscountProps } from "@billing/domain/discount/props/create-discount.props";

export const discountRepositoryPort = Symbol('discountRepositoryPort');
export const findDiscountUsecasePort = Symbol('findDiscountUsecasePort');
export const createDiscountUsecasePort = Symbol('createDiscountUsecasePort');
export const deleteDiscountUsecasePort = Symbol('deleteDiscountUsecasePort');

export interface IDiscountRepository {
    findAll(params: PageParams): Promise<Page<Discount>>;
    findAllByPriceId(priceId: number, params: PageParams): Promise<Page<Discount>>;
    findById(id: number): Promise<Discount | null>;
    save(discount: Discount): Promise<Discount>;
    delete(id: number): Promise<boolean>;
}

export interface IFindDiscountUsecase {
    findAll(params: PageParams): Promise<Page<Discount>>;
    findAllByPriceId(priceId: number, params: PageParams): Promise<Page<Discount>>;
    findById(id: number): Promise<Discount | null>;
}

export interface ICreateDiscountUsecase {
    execute(input: CreateDiscountProps): Promise<Discount>;
}

export interface IDeleteDiscountUsecase {
    delete(id: number): Promise<boolean>;
}
