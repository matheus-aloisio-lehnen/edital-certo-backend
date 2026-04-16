import { describe, expect, it, vi, beforeEach } from "vitest";
import { PriceRepository } from "./price.repository";
import { createRepositoryMock, createClsServiceMock } from "@mock/tests.mock";
import { Price } from "@product/entity/price.entity";
import { PriceModel } from "@persistence/database/postgres/typeorm/model/product/price.model";
import { PriceFactory } from "@product/factory/price.factory";
import { priceKey } from "@product/constant/price-key.constant";
import { MockPrice } from "@mock/in-memory.mock";
import { sortOrder } from "@domain/@shared/type/page.type";

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

    describe("findByPlanIdAndKey", () => {
        it("should return entity when model exists", async () => {
            const model = {
                ...MockPrice,
                discounts: [],
            } as PriceModel;

            repo.findOne = vi.fn().mockResolvedValue(model);
            const entity = {} as Price;
            vi.spyOn(PriceFactory, "rehydrate").mockReturnValue(entity);

            const result = await sut.findByPlanIdAndKey(1, priceKey.startMonthlyBrl);

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { planId: 1, key: priceKey.startMonthlyBrl },
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

    describe("saveBulk", () => {
        it("should save bulk and return rehydrated entities", async () => {
            const entities = [
                PriceFactory.rehydrate({
                    ...MockPrice,
                    discounts: [],
                } as PriceModel),
            ];

            const models = [
                {
                    ...MockPrice,
                    discounts: [],
                } as PriceModel,
            ];

            vi.spyOn(PriceFactory, "toModelBulk").mockReturnValue(models);
            repo.save = vi.fn().mockResolvedValue(models);
            vi.spyOn(PriceFactory, "rehydrateBulk").mockReturnValue(entities);

            const result = await sut.saveBulk(entities);

            expect(PriceFactory.toModelBulk).toHaveBeenCalledWith(entities);
            expect(repo.save).toHaveBeenCalledWith(models);
            expect(result).toEqual(entities);
        });
    });
});