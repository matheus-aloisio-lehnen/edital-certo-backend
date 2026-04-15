import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { PlanKey } from "@domain/product/constant/plan-key.constant";
import { CreatePlanProps } from "@domain/product/props/create-plan.props";
import { Feature } from "@domain/product/entity/feature.entity";
import { Price } from "@domain/product/entity/price.entity";
import { hasValue } from "@domain/@shared/utils/helper.utils";

export class Plan {

    private readonly _id?: number;
    private readonly _key: PlanKey; // Stripe: pode ser usado no metadata do CreateGatewayProductDto para rastrear o plano interno.
    private readonly _name: string; // Stripe: Mapear para CreateGatewayProductDto.name como nome do plano que aparece no checkout e mapear em CreateGatewayProductDto.statementDescriptor para aparecer no extrato de invoice.
    private _isActive: boolean; // Stripe: Funciona para desativar no stripe mas manter o price la. Só nao aparece como opção
    private _externalPlanId?: string | null; // Stripe: guarda o id externo do Product criado para este plano.
    private readonly _prices: Price[]; // Stripe: cada item desta colecao vira um CreateGatewayPriceDto ligado ao Product do plano.
    private readonly _features: Feature[]; // Stripe: vai para marketing feature name
    private readonly _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(data: CreatePlanProps) {
        this._name = data.name;
        this._key = data.key;
        this._isActive = true;
        this._externalPlanId = data.externalProductId ?? null;
        this._features = data.features.map((feature) => new Feature(feature));
        this._prices = data.prices.map((price) => new Price(price));

        this.validate();
    }

    get id() {
        if (!hasValue(this._id))
            throw new AppException(code.planIdEmptyError, 400);
        return this._id;
    }
    get key() { return this._key; }
    get name() { return this._name; }
    get isActive() { return this._isActive; }
    get externalPlanId() { return this._externalPlanId; }
    get features() { return this._features; }
    get prices() { return this._prices; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }

    private validate(): void {
        if (!this._name || this._name.trim() === "")
            throw new AppException(code.planNameEmptyError, 400);

        if (!this._key || this._key.trim() === "")
            throw new AppException(code.planKeyEmptyError, 400);

        if (!this._features || this._features.length === 0)
            throw new AppException(code.planFeaturesEmptyError, 400);

        if (!this._prices || this._prices.length === 0)
            throw new AppException(code.planPricesEmptyError, 400);
    }

    deactivate(): void {
        this._isActive = false;
    }

    linkExternalPlanId(externalPlanId: string): void {
        this._externalPlanId = externalPlanId;
    }

}
