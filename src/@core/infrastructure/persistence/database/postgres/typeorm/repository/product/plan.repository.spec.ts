import { PlanRepository } from './plan.repository';
import { createRepositoryMock, createClsServiceMock } from '@mock/tests.mock';
import { Plan } from '@product/entity/plan.entity';
import { PlanModel } from '@persistence/database/postgres/typeorm/model/product/plan.model';
import { PlanFactory } from '@product/factory/plan.factory';
import { planKey } from '@product/constant/plan-key.constant';
import { In } from 'typeorm';

import { sortOrder, PageParams } from '@domain/@shared/type/page.type';

describe('PlanRepository', () => {
    const repo = createRepositoryMock<PlanModel>();
    const cls = createClsServiceMock();
    const sut = new PlanRepository(repo, cls);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('findAll', () => {
        it('should call findAndCount with correct params and relations', async () => {
            repo.findAndCount = vi.fn().mockResolvedValue([[], 0]);

            const params: PageParams = { offset: 0, limit: 10, orderBy: 'id', sortOrder: sortOrder.desc };
            const result = await sut.findAll(params);

            expect(repo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
                skip: 0,
                take: 10,
                relations: ["features", "prices", "prices.discounts"],
            }));
            expect(result).toEqual({
                list: [],
                count: 0,
                offset: 0,
                limit: 10,
            });
        });
    });

    describe('findAllByKey', () => {
        it('should call find with correct keys and relations', async () => {
            repo.find = vi.fn().mockResolvedValue([]);
            const keys = [planKey.free, planKey.pro];

            await sut.findAllByKey(keys);

            expect(repo.find).toHaveBeenCalledWith({
                where: { key: In(keys) },
                relations: ["features", "prices", "prices.discounts"],
            });
        });
    });

    describe('findById', () => {
        it('should return entity when model exists', async () => {
            const model = { id: 1 } as PlanModel;
            repo.findOne = vi.fn().mockResolvedValue(model);
            const entity = {} as Plan;
            vi.spyOn(PlanFactory, 'rehydrate').mockReturnValue(entity);

            const result = await sut.findById(1);

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ["features", "prices", "prices.discounts"]
            });
            expect(result).toBe(entity);
        });
    });

    describe('findByKey', () => {
        it('should return entity when model exists', async () => {
            const model = { id: 1 } as PlanModel;
            repo.findOne = vi.fn().mockResolvedValue(model);
            const entity = {} as Plan;
            vi.spyOn(PlanFactory, 'rehydrate').mockReturnValue(entity);

            const result = await sut.findByKey(planKey.pro);

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { key: planKey.pro },
                relations: ["features", "prices", "prices.discounts"]
            });
            expect(result).toBe(entity);
        });
    });

    describe('save', () => {
        it('should save and return rehydrated entity', async () => {
            const entity = {} as Plan;
            const model = { id: 1 } as PlanModel;
            repo.save = vi.fn().mockResolvedValue(model);
            vi.spyOn(PlanFactory, 'rehydrate').mockReturnValue(entity);

            const result = await sut.save(entity);

            expect(repo.save).toHaveBeenCalledWith(entity);
            expect(result).toBe(entity);
        });
    });

    describe('saveBulk', () => {
        it('should save bulk and return rehydrated entities', async () => {
            const entities = [{} as Plan];
            const models = [{ id: 1 } as PlanModel];
            repo.save = vi.fn().mockResolvedValue(models);
            vi.spyOn(PlanFactory, 'rehydrateBulk').mockReturnValue(entities);

            const result = await sut.saveBulk(entities);

            expect(repo.save).toHaveBeenCalledWith(entities);
            expect(result).toEqual(entities);
        });
    });
});
