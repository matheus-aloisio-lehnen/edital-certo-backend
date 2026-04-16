import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

import { quotaRenewalCycle } from '@product/constant/quota-renewal-cycle.constant';
import type { QuotaRenewalCycle } from '@product/constant/quota-renewal-cycle.constant';
import { featureKey } from '@product/constant/feature-key.constant';
import type { FeatureKey } from '@product/constant/feature-key.constant';
import type { CreateFeatureProps } from '@product/props/create-feature.props';

export class CreateFeatureDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(featureKey)
    key: FeatureKey;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    planId?: number;

    @IsEnum(quotaRenewalCycle)
    quotaRenewalCycle: QuotaRenewalCycle;

    @IsOptional()
    @IsBoolean()
    hidden?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsBoolean()
    hasQuota?: boolean;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    quota?: number;

    toProps(): CreateFeatureProps {
        return {
            name: this.name,
            key: this.key,
            planId: this.planId,
            quotaRenewalCycle: this.quotaRenewalCycle,
            hidden: this.hidden,
            isActive: this.isActive,
            hasQuota: this.hasQuota,
            quota: this.quota,
        };
    }
}