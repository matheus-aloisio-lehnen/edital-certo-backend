import { Feature } from "@domain/product/entity/feature.entity";
import { FeatureKey } from "@domain/product/constant/feature-key.constant";
import { Page, PageParamsInput } from "@domain/@shared/type/page.type";
import { CreateFeatureProps } from "@domain/product/props/create-feature.props";
import { QuotaRenewalCycle } from "@domain/product/constant/quota-renewal-cycle.constant";

export interface IFeatureRepository {
    findAll(params: PageParamsInput): Promise<Page<Feature>>;
    findAllByPlanId(planId: number, params: PageParamsInput): Promise<Page<Feature>>;
    findById(id: number): Promise<Feature | null>;
    findByPlanIdAndKey(planId: number, key: FeatureKey): Promise<Feature | null>;
    save(feature: Feature): Promise<Feature>;
    saveBulk(features: Feature[]): Promise<Feature[]>;
}

export interface IFindFeatureUsecase {
    findAll(params: PageParamsInput): Promise<Page<Feature>>;
    findById(id: number): Promise<Feature | null>;
    findByPlanIdAndKey(planId: number, key: FeatureKey): Promise<Feature | null>;
}

export interface ICreateFeatureUsecase {
    create(input: CreateFeatureProps): Promise<Feature>;
    createBulk(inputList: CreateFeatureProps[]): Promise<Feature[]>;
}

export interface IUpdateFeatureUsecase {
    activate(id: number): Promise<Feature>;
    deactivate(id: number): Promise<Feature>;
    hide(id: number): Promise<Feature>;
    show(id: number): Promise<Feature>;
    enableQuota(id: number, quota: number, cycle: QuotaRenewalCycle): Promise<Feature>;
    disableQuota(id: number): Promise<Feature>;
    changeQuota(id: number, quota: number): Promise<Feature>;
}