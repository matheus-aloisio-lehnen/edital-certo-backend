import { Product } from "@billing/domain/product/entity/product.entity";
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { CreateProductProps } from "@billing/domain/product/props/create-product.props";
import { ProductModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/product.model";

export class ProductFactory {

    static create(props: CreateProductProps): Product {
        return new Product(props);
    }

    static createBulk(propsList: CreateProductProps[]): Product[] {
        return propsList.map(props => this.create(props));
    }

    static rehydrate(model: ProductModel): Product {
        const product: Product = Object.create(Product.prototype);
        Object.assign(product, {
            _id: model.id,
            _name: model.name,
            _isActive: model.isActive,
            _externalProductId: model.externalProductId,
            _prices: model.prices ? PriceFactory.rehydrateBulk(model.prices) : [],
            _createdAt: model.createdAt,
            _updatedAt: model.updatedAt,
        });
        return product;
    }

    static rehydrateBulk(modelList: ProductModel[]): Product[] {
        return modelList.map(model => this.rehydrate(model));
    }

    static toModel(product: Product): ProductModel {
        const model: ProductModel = Object.create(ProductModel.prototype) as ProductModel;

        model.id = product.id;
        model.name = product.name;
        model.isActive = product.isActive;
        model.externalProductId = product.externalProductId ?? null;
        model.prices = product.prices.map(price => PriceFactory.toModel(price));

        return model;
    }

    static toModelBulk(productList: Product[]): ProductModel[] {
        return productList.map(product => this.toModel(product));
    }

}
