import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { CreatePlanProps } from "@billing/domain/plan/props/create-plan.props";
import { Price } from "@billing/domain/price/entity/price.entity";
import { hasValue } from "@shared/domain/function/has-value.function";

export class Plan {

    private readonly _id?: number;
    private readonly _name: string; // Stripe: Mapear para CreateGatewayProductDto.name como nome do plano que aparece no checkout e mapear em CreateGatewayProductDto.statementDescriptor para aparecer no extrato de invoice.
    private _isActive: boolean; // Stripe: Funciona para desativar no stripe mas manter o price la. Só nao aparece como opção
    private _externalPlanId?: string | null; // Stripe: guarda o id externo do Product criado para este plano.
    private readonly _prices: Price[]; // Stripe: cada item desta colecao vira um CreateGatewayPriceDto ligado ao Product do plano.
    private readonly _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(data: CreatePlanProps) {
        this._name = data.name;
        this._isActive = true;
        this._externalPlanId = data.externalProductId ?? null;
        this._prices = data.prices.map((price) => new Price(price));

        this.validate();
    }

    get id() {
        if (!hasValue(this._id))
            throw new AppException(code.planIdEmptyError, 400);
        return this._id;
    }
    get name() { return this._name; }
    get isActive() { return this._isActive; }
    get externalPlanId() { return this._externalPlanId; }
    get prices() { return this._prices; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }

    private validate(): void {
        if (!this._name || this._name.isBlank())
            throw new AppException(code.planNameEmptyError, 400);

        if (!this._prices || this._prices.isEmpty())
            throw new AppException(code.planPricesEmptyError, 400);
    }

    deactivate(): void {
        this._isActive = false;
    }

    linkExternalPlanId(externalPlanId: string): void {
        this._externalPlanId = externalPlanId;
    }

}
