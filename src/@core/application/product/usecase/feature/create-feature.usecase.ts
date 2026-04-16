import { ICreateFeatureUsecase, IFeatureRepository } from "@product/port/feature.port";
import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { CreateFeatureProps } from "@product/props/create-feature.props";
import { Feature } from "@product/entity/feature.entity";
import { FeatureFactory } from "@product/factory/feature.factory";
import { IProductValidatorService } from "@product/port/product-validator.port";

export class CreateFeatureUsecase implements ICreateFeatureUsecase{

    constructor(
        private readonly featureRepository: IFeatureRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly productValidatorService: IProductValidatorService,
    ) {
    }

    create(input: CreateFeatureProps): Promise<Feature> {
        const feature = FeatureFactory.create(input);
        const metadata = { name: 'CreateFeatureUsecase.create', data: { input }, metrics: { featureKey: input.key } };

        return this.transactionManager.run(async () => {
            this.productValidatorService.validateFeaturesKeys([input.key]);
            await this.featureRepository.save(feature);
            return feature;
        }, metadata);
    }

    createBulk(inputList: CreateFeatureProps[]): Promise<Feature[]> {
        const metadata = { name: 'CreateFeatureUsecase.createBulk', data: { inputList } };
        const features = FeatureFactory.createBulk(inputList);

        return this.transactionManager.run(async () => {
            this.productValidatorService.validateFeaturesKeys(inputList.map(input => input.key));
            return this.featureRepository.saveBulk(features);
        }, metadata);
    }
}