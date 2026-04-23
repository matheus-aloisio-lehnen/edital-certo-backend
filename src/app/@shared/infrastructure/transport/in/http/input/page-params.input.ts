import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { PageParams, sortOrder, type SortOrder, type Where } from "@shared/domain/type/page.type";
import { hasValue } from "@shared/domain/function/has-value.function";
import { toSortOrder } from "@shared/domain/function/to-sort-order.function";

export class PageParamsInput {

    @IsOptional()
    @Transform(({ value }) => hasValue(value) ? Number(value) : 0)
    offset: number;

    @IsOptional()
    @Transform(({ value }) => hasValue(value) ? Number(value) : 250)
    limit: number;

    @IsOptional()
    @IsString()
    orderBy: string = 'id';

    @IsOptional()
    @Transform(({ value }) => hasValue(value) ? toSortOrder(value) : sortOrder.desc)
    sortOrder: SortOrder;

    @IsOptional()
    @Transform(({ value }) => hasValue(value) ? new Date(value) : undefined)
    @IsDate()
    start?: Date;

    @IsOptional()
    @Transform(({ value }) => hasValue(value) ? new Date(value) : undefined)
    @IsDate()
    end?: Date;

    @IsOptional()
    @Transform(({ value }) => {
        if (!hasValue(value))
            return;

        try {
            return JSON.parse(String(value)) as Where;
        } catch {
            return;
        }
    })
    where?: Where;

    toPageParams(): PageParams {
        return {
            offset: this.offset ?? 0,
            limit: this.limit ?? 250,
            orderBy: this.orderBy ?? 'id',
            sortOrder: this.sortOrder ?? sortOrder.desc,
            start: this.start,
            end: this.end,
            where: this.where,
        };
    }
}
