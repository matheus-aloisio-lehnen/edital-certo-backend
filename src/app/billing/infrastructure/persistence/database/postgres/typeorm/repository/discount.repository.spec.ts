import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClsServiceMock, createRepositoryMock } from "@mock/tests.mock";
import { DiscountRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/discount.repository";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";
import { sortOrder } from "@shared/domain/type/page.type";
import { Discount } from "@billing/domain/discount/entity/discount.entity";
import { DiscountFactory } from "@billing/domain/discount/factory/discount.factory";
import { MockDiscount } from "@mock/in-memory.mock";

describe("DiscountRepository", () => {
    const repo = createRepositoryMock<DiscountModel>();
    const cls = createClsServiceMock();
    const sut = new DiscountRepository(repo, cls);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("findAll should call findAndCount with correct params", async () => {
        repo.findAndCount = vi.fn().mockResolvedValue([[], 0]);

        const result = await sut.findAll({
            offset: 0,
            limit: 10,
            orderBy: "id",
            sortOrder: sortOrder.desc,
        });

        expect(repo.findAndCount).toHaveBeenCalledWith({
            where: {},
            order: { id: sortOrder.desc },
            skip: 0,
            take: 10,
        });
        expect(result).toEqual({
            list: [],
            count: 0,
            offset: 0,
            limit: 10,
        });
    });

    it("findAllByPriceId should merge priceId into where", async () => {
        repo.findAndCount = vi.fn().mockResolvedValue([[], 0]);

        await sut.findAllByPriceId(1, {
            offset: 0,
            limit: 10,
            orderBy: "id",
            sortOrder: sortOrder.asc,
            where: { name: { op: "ilike", args: "%Partner%" } },
        });

        const call = (repo.findAndCount as any).mock.calls[0][0];
        expect(call.order).toEqual({ id: sortOrder.asc });
        expect(call.skip).toBe(0);
        expect(call.take).toBe(10);
        expect(call.where.priceId).toBeDefined();
        expect(call.where.name).toBeDefined();
    });

    it("findById should return entity when model exists", async () => {
        repo.findOne = vi.fn().mockResolvedValue(MockDiscount);
        const entity = {} as Discount;
        vi.spyOn(DiscountFactory, "rehydrate").mockReturnValue(entity);

        const result = await sut.findById(1);

        expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(result).toBe(entity);
    });

    it("save should save model and return rehydrated entity", async () => {
        const entity = {} as Discount;
        const model = MockDiscount as DiscountModel;
        vi.spyOn(DiscountFactory, "toModel").mockReturnValue(model);
        vi.spyOn(DiscountFactory, "rehydrate").mockReturnValue(entity);
        repo.save = vi.fn().mockResolvedValue(model);

        const result = await sut.save(entity);

        expect(repo.save).toHaveBeenCalledWith(model);
        expect(result).toBe(entity);
    });

    it("delete should return true when softDelete affects rows", async () => {
        repo.softDelete = vi.fn().mockResolvedValue({ affected: 1 });

        const result = await sut.delete(1);

        expect(repo.softDelete).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });
});
