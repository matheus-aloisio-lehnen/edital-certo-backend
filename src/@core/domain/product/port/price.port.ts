import { Price } from "@domain/product/entity/price.entity";
import { PriceKey } from "@domain/product/constant/price-key.constant";
import { Page, PageParamsInput } from "@domain/@shared/type/page.type";
import { CreatePriceProps } from "@domain/product/props/create-price.props";

export interface IPriceRepository {
    findAll(params: PageParamsInput): Promise<Page<Price>>;
    findById(id: number): Promise<Price | null>;
    findByPlanIdAndKey(planId: number, key: PriceKey): Promise<Price | null>;
    save(price: Price): Promise<Price>;
    saveBulk(prices: Price[]): Promise<Price[]>;
}

export interface IFindPriceUsecase {
    findAll(params: PageParamsInput): Promise<Page<Price>>;
    findById(id: number): Promise<Price | null>;
}

export interface ICreatePriceUsecase {
    create(input: CreatePriceProps): Promise<Price>;
    createBulk(inputList: CreatePriceProps[]): Promise<Price[]>;
}

export interface IUpdatePriceUsecase {
    deactivate(id: number): Promise<Price>;
}