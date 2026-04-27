import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { CreateProductProps } from "@billing/domain/product/props/create-product.props";
import { Price } from "@billing/domain/price/entity/price.entity";
import { hasValue } from "@shared/domain/function/has-value.function";

export class Product {

    private readonly _id?: number;
    private readonly _name: string; // Stripe: Mapear para CreateGatewayProductDto.name como nome do produto que aparece no checkout e mapear em CreateGatewayProductDto.statementDescriptor para aparecer no extrato de invoice.
    private _isActive: boolean; // Stripe: Funciona para desativar no stripe mas manter o price la. Só nao aparece como opção
    private _externalProductId?: string | null; // Stripe: guarda o id externo do Product criado para este produto.
    private readonly _prices: Price[]; // Stripe: cada item desta colecao vira um CreateGatewayPriceDto ligado ao Product do produto.
    private readonly _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(data: CreateProductProps) {
        this._name = data.name;
        this._isActive = true;
        this._externalProductId = data.externalProductId ?? null;
        this._prices = data.prices.map((price) => new Price(price));

        this.validate();
    }

    get id() {
        if (!hasValue(this._id))
            throw new AppException(code.productIdEmptyError, 400);
        return this._id;
    }
    get name() { return this._name; }
    get isActive() { return this._isActive; }
    get externalProductId() { return this._externalProductId; }
    get prices() { return this._prices; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }

    private validate(): void {
        if (!this._name || this._name.isBlank())
            throw new AppException(code.productNameEmptyError, 400);

        if (!this._prices || this._prices.isEmpty())
            throw new AppException(code.productPricesEmptyError, 400);
    }

    deactivate(): void {
        this._isActive = false;
    }

    linkExternalProductId(externalProductId: string): void {
        this._externalProductId = externalProductId;
    }

}
