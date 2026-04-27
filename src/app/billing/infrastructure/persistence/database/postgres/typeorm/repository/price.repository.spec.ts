import { describe, expect, it, vi, beforeEach } from "vitest";
import { createRepositoryMock, createClsServiceMock } from "@mock/tests.mock";
import { MockPrice } from "@mock/in-memory.mock";
import { sortOrder } from "@shared/domain/type/page.type";
import { PriceRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/price.repository";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { billingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { Price } from "@billing/domain/price/entity/price.entity";

describe("PriceRepository", () => {
    const repo = createRepositoryMock<PriceModel>();
    const cls = createClsServiceMock();
    const sut = new PriceRepository(repo, cls);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("findAll", () => {
        it("should call findAndCount with correct params and relations", async () => {
            repo.findAndCount = vi.fn().mockResolvedValue([[], 0]);

            const params = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
            };

            const result = await sut.findAll(params);

            expect(repo.findAndCount).toHaveBeenCalledWith({
                where: {},
                order: { id: sortOrder.desc },
                skip: 0,
                take: 10,
                relations: ["discounts"],
            });

            expect(result).toEqual({
                list: [],
                count: 0,
                offset: 0,
                limit: 10,
            });
        });
    });

    describe("findById", () => {
        it("should return entity when model exists", async () => {
            const model = {
                ...MockPrice,
                discounts: [],
            } as PriceModel;

            repo.findOne = vi.fn().mockResolvedValue(model);
            const entity = {} as Price;
            vi.spyOn(PriceFactory, "rehydrate").mockReturnValue(entity);

            const result = await sut.findById(1);

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ["discounts"],
            });
            expect(result).toBe(entity);
        });
    });

    describe("findByProductIdAndBillingCycle", () => {
        it("should return entity when model exists", async () => {
            const model = {
                ...MockPrice,
                discounts: [],
            } as PriceModel;

            repo.findOne = vi.fn().mockResolvedValue(model);
            const entity = {} as Price;
            vi.spyOn(PriceFactory, "rehydrate").mockReturnValue(entity);

            const result = await sut.findByProductIdAndBillingCycle(1, billingCycle.monthly);

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { productId: 1, billingCycle: billingCycle.monthly },
                relations: ["discounts"],
            });
            expect(result).toBe(entity);
        });
    });

    describe("save", () => {
        it("should save model and return rehydrated entity", async () => {
            const entity = PriceFactory.rehydrate({
                ...MockPrice,
                discounts: [],
            } as PriceModel);

            const model = {
                ...MockPrice,
                discounts: [],
            } as PriceModel;

            vi.spyOn(PriceFactory, "toModel").mockReturnValue(model);
            repo.save = vi.fn().mockResolvedValue(model);
            vi.spyOn(PriceFactory, "rehydrate").mockReturnValue(entity);

            const result = await sut.save(entity);

            expect(PriceFactory.toModel).toHaveBeenCalledWith(entity);
            expect(repo.save).toHaveBeenCalledWith(model);
            expect(result).toBe(entity);
        });
    });

});
