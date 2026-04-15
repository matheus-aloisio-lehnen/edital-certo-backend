import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { QuotaRenewalCycle } from "@domain/product/constant/quota-renewal-cycle.constant";
import { Feature } from "@domain/product/entity/feature.entity";
import { IFeatureRepository, IUpdateFeatureUsecase } from "@domain/product/port/feature.port";

export class UpdateFeatureUseCase implements IUpdateFeatureUsecase {

    constructor(
        private readonly featureRepository: IFeatureRepository,
        private readonly transactionManager: ITransactionManager,
    ) {}

    async activate(id: number): Promise<Feature> {
        const feature = await this.getFeature(id);
        feature.activate();

        const metadata = { name: "UpdateFeatureUseCase.activate", data: { id }, metrics: { featureKey: feature.key, planId: String(feature.planId) } };
        return this.transactionManager.run(async () => this.featureRepository.save(feature), metadata);
    }

    async deactivate(id: number): Promise<Feature> {
        const feature = await this.getFeature(id);
        feature.deactivate();

        const metadata = { name: "UpdateFeatureUseCase.deactivate", data: { id }, metrics: { featureKey: feature.key, planId: String(feature.planId) } };
        return this.transactionManager.run(async () => this.featureRepository.save(feature), metadata);
    }

    async changeOrder(id: number, order: number): Promise<Feature> {
        const feature = await this.getFeature(id);
        feature.changeOrder(order);

        const metadata = { name: "UpdateFeatureUseCase.changeOrder", data: { id, order }, metrics: { featureKey: feature.key, planId: String(feature.planId) } };

        return this.transactionManager.run(async () => this.featureRepository.save(feature), metadata);
    }

    async hide(id: number): Promise<Feature> {
        const feature = await this.getFeature(id);
        feature.hide();

        const metadata = { name: "UpdateFeatureUseCase.hide", data: { id }, metrics: { featureKey: feature.key, planId: String(feature.planId) } };
        return this.transactionManager.run(async () => this.featureRepository.save(feature), metadata);
    }

    async show(id: number): Promise<Feature> {
        const feature = await this.getFeature(id);
        feature.show();

        const metadata = { name: "UpdateFeatureUseCase.show", data: { id }, metrics: { featureKey: feature.key, planId: String(feature.planId) } };
        return this.transactionManager.run(async () => this.featureRepository.save(feature), metadata);
    }

    async enableQuota(id: number, quota: number, cycle: QuotaRenewalCycle): Promise<Feature> {
        const feature = await this.getFeature(id);
        feature.enableQuota(quota, cycle);

        const metadata = { name: "UpdateFeatureUseCase.enableQuota", data: { id, quota, cycle }, metrics: { featureKey: feature.key, planId: String(feature.planId) } };
        return this.transactionManager.run(async () => this.featureRepository.save(feature), metadata);
    }

    async disableQuota(id: number): Promise<Feature> {
        const feature = await this.getFeature(id);
        feature.disableQuota();

        const metadata = { name: "UpdateFeatureUseCase.disableQuota", data: { id }, metrics: { featureKey: feature.key, planId: String(feature.planId) } };
        return this.transactionManager.run(async () => this.featureRepository.save(feature), metadata);
    }

    async changeQuota(id: number, quota: number): Promise<Feature> {
        const feature = await this.getFeature(id);
        feature.changeQuota(quota);

        const metadata = { name: "UpdateFeatureUseCase.changeQuota", data: { id, quota }, metrics: { featureKey: feature.key, planId: String(feature.planId) } };
        return this.transactionManager.run(async () => this.featureRepository.save(feature), metadata);
    }

    private async getFeature(id: number): Promise<Feature> {
        const feature = await this.featureRepository.findById(id);
        if (!feature)
            throw new AppException(code.featureNotFoundError, 404, `Feature with id ${id} not found`);

        return feature;
    }
}