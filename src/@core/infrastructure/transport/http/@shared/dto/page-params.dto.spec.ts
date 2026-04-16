import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { sortOrder } from '@domain/@shared/type/page.type';
import { PageParamsDto } from "@transport/http/@shared/dto/page-params.dto";

describe('PageParamsDto', () => {
    describe('transform', () => {
        it('should keep undefined for transformed fields when values are not provided', () => {
            const dto = plainToInstance(PageParamsDto, {});

            expect(dto.offset).toBeUndefined();
            expect(dto.limit).toBeUndefined();
            expect(dto.orderBy).toBe('id');
            expect(dto.sortOrder).toBeUndefined();
            expect(dto.start).toBeUndefined();
            expect(dto.end).toBeUndefined();
            expect(dto.where).toBeUndefined();
        });

        it('should transform offset and limit to number', () => {
            const dto = plainToInstance(PageParamsDto, {
                offset: '10',
                limit: '50',
            });

            expect(dto.offset).toBe(10);
            expect(dto.limit).toBe(50);
        });

        it('should transform sortOrder using toSortOrder', () => {
            const dto = plainToInstance(PageParamsDto, {
                sortOrder: 'asc',
            });

            expect(dto.sortOrder).toBe(sortOrder.asc);
        });

        it('should keep sortOrder undefined when value is not provided', () => {
            const dto = plainToInstance(PageParamsDto, {});

            expect(dto.sortOrder).toBeUndefined();
        });

        it('should transform start and end to Date', () => {
            const dto = plainToInstance(PageParamsDto, {
                start: '2025-02-01',
                end: '2025-03-31',
            });

            expect(dto.start).toBeInstanceOf(Date);
            expect(dto.end).toBeInstanceOf(Date);
            expect(dto.start?.toISOString()).toContain('2025-02-01');
            expect(dto.end?.toISOString()).toContain('2025-03-31');
        });

        it('should transform where from json string to object', () => {
            const dto = plainToInstance(PageParamsDto, {
                where: JSON.stringify({
                    key: { op: 'in', args: ['free', 'start'] },
                    isActive: true,
                }),
            });

            expect(dto.where).toEqual({
                key: { op: 'in', args: ['free', 'start'] },
                isActive: true,
            });
        });

        it('should return undefined when where is invalid json', () => {
            const dto = plainToInstance(PageParamsDto, {
                where: '{ invalid json }',
            });

            expect(dto.where).toBeUndefined();
        });
    });

    describe('validation', () => {
        it('should validate successfully with valid dates', () => {
            const dto = plainToInstance(PageParamsDto, {
                start: '2025-02-01',
                end: '2025-03-31',
            });

            const errors = validateSync(dto);

            expect(errors).toHaveLength(0);
        });

        it('should return validation error when start is invalid date', () => {
            const dto = plainToInstance(PageParamsDto, {
                start: 'invalid-date',
            });

            const errors = validateSync(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0]?.property).toBe('start');
        });

        it('should return validation error when end is invalid date', () => {
            const dto = plainToInstance(PageParamsDto, {
                end: 'invalid-date',
            });

            const errors = validateSync(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0]?.property).toBe('end');
        });
    });

    describe('toPageParams', () => {
        it('should return page params with transformed values', () => {
            const dto = plainToInstance(PageParamsDto, {
                offset: '20',
                limit: '100',
                orderBy: 'createdAt',
                sortOrder: 'asc',
                start: '2025-02-01',
                end: '2025-03-31',
                where: JSON.stringify({
                    key: { op: 'ilike', args: '%OFF%' },
                }),
            });

            expect(dto.toPageParams()).toEqual({
                offset: 20,
                limit: 100,
                orderBy: 'createdAt',
                sortOrder: sortOrder.asc,
                start: dto.start,
                end: dto.end,
                where: {
                    key: { op: 'ilike', args: '%OFF%' },
                },
            });
        });

        it('should return defaults in toPageParams when values are not provided', () => {
            const dto = plainToInstance(PageParamsDto, {});

            expect(dto.toPageParams()).toEqual({
                offset: 0,
                limit: 250,
                orderBy: 'id',
                sortOrder: sortOrder.desc,
                start: undefined,
                end: undefined,
                where: undefined,
            });
        });
    });
});