import { createClsServiceMock, createRepositoryMock } from "@mock/tests.mock";
import { PageParams, sortOrder } from "@shared/domain/type/page.type";
import { ProductModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/product.model";
import { ProductRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/product.repository";
import { Product } from "@billing/domain/product/entity/product.entity";
import { ProductFactory } from "@billing/domain/product/factory/product.factory";

describe('ProductRepository', () => {
    const repo = createRepositoryMock<ProductModel>();
    const cls = createClsServiceMock();
    const sut = new ProductRepository(repo, cls);

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
            const model = { id: 1 } as ProductModel;
            repo.findOne = vi.fn().mockResolvedValue(model);
            const entity = {} as Product;
            vi.spyOn(ProductFactory, 'rehydrate').mockReturnValue(entity);

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
            const entity = {} as Product;
            const model = { id: 1 } as ProductModel;
            repo.save = vi.fn().mockResolvedValue(model);
            vi.spyOn(ProductFactory, 'toModel').mockReturnValue(model);
            vi.spyOn(ProductFactory, 'rehydrate').mockReturnValue(entity);

            const result = await sut.save(entity);

            expect(repo.save).toHaveBeenCalledWith(model);
            expect(result).toBe(entity);
        });
    });

});
