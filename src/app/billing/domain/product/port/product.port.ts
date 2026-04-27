import { Page, PageParams } from "@shared/domain/type/page.type";
import { Product } from "@billing/domain/product/entity/product.entity";
import { CreateProductProps } from "@billing/domain/product/props/create-product.props";

export const productRepositoryPort = Symbol('productRepositoryPort');
export const findProductUsecasePort = Symbol('findProductUsecasePort');
export const createProductUsecasePort = Symbol('createProductUsecasePort');
export const deactivateProductUsecasePort = Symbol('deactivateProductUsecasePort');

export interface IProductRepository {
    findAll(params: PageParams): Promise<Page<Product>>;
    findById(id: number): Promise<Product | null>;
    save(product: Product): Promise<Product>;
}

export interface IFindProductUsecase {
    findAll(params: PageParams): Promise<Page<Product>>;
    findById(id: number): Promise<Product | null>;
}

export interface ICreateProductUsecase {
    execute(input: CreateProductProps): Promise<Product>;
}

export interface IDeactivateProductUsecase {
    execute(id: number): Promise<Product>;
}
