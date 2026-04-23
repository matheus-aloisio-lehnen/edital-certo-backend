import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { type DiscountDuration, discountDuration, type DiscountType, discountType } from "@billing/domain/discount/constant/discount.constant";
import { CreateDiscountProps } from "@billing/domain/discount/props/create-discount.props";


export class CreateDiscountDto {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsOptional()
    priceId?: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @Type(() => Number)
    @IsNumber()
    value: number;

    @IsEnum(discountType)
    type: DiscountType;

    @IsEnum(discountDuration)
    duration: DiscountDuration;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    count?: number;

    @Type(() => Date)
    @IsDate()
    campaignStartsAt: Date;

    @Type(() => Date)
    @IsDate()
    campaignEndsAt: Date;

    @IsOptional()
    @IsString()
    externalDiscountId?: string | null;

    toProps(): CreateDiscountProps {
        return {
            priceId: this.priceId,
            name: this.name,
            value: this.value,
            type: this.type,
            duration: this.duration,
            count: this.count,
            campaignStartsAt: this.campaignStartsAt,
            campaignEndsAt: this.campaignEndsAt,
            externalDiscountId: this.externalDiscountId ?? null,
        };
    }
}
