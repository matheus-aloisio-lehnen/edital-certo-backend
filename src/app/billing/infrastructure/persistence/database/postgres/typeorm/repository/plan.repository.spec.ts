import { createClsServiceMock, createRepositoryMock } from "@mock/tests.mock";
import { PageParams, sortOrder } from "@shared/domain/type/page.type";
import { PlanModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/plan.model";
import { PlanRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/plan.repository";
import { Plan } from "@billing/domain/plan/entity/plan.entity";
import { PlanFactory } from "@billing/domain/plan/factory/plan.factory";

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
                relations: ["prices", "prices.discounts"],
            }));
            expect(result).toEqual({
                list: [],
                count: 0,
                offset: 0,
                limit: 10,
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
                relations: ["prices", "prices.discounts"]
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

});
