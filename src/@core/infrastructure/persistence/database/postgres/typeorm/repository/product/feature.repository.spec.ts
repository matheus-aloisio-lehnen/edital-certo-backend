import { describe, expect, it, vi, beforeEach } from "vitest";
import { Equal } from "typeorm";
import { FeatureRepository } from "./feature.repository";
import { createRepositoryMock, createClsServiceMock } from "@mock/tests.mock";
import { Feature } from "@product/entity/feature.entity";
import { FeatureModel } from "@persistence/database/postgres/typeorm/model/product/feature.model";
import { FeatureFactory } from "@product/factory/feature.factory";
import { featureKey } from "@product/constant/feature-key.constant";
import { sortOrder } from "@domain/@shared/type/page.type";

describe("FeatureRepository", () => {
    const repo = createRepositoryMock<FeatureModel>();
    const cls = createClsServiceMock();
    const sut = new FeatureRepository(repo, cls);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("findAll", () => {
        it("should call findAndCount with correct params", async () => {
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
            });

            expect(result).toEqual({
                list: [],
                count: 0,
                offset: 0,
                limit: 10,
            });
        });
    });

    describe("findAllByPlanId", () => {
        it("should call findAndCount with planId filter", async () => {
            repo.findAndCount = vi.fn().mockResolvedValue([[], 0]);

            const planId = 456;

            await sut.findAllByPlanId(planId, {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
            });

            expect(repo.findAndCount).toHaveBeenCalledWith({
                where: { planId: Equal(planId) },
                order: { id: sortOrder.desc },
                skip: 0,
                take: 10,
            });
        });
    });

    describe("findById", () => {
        it("should return entity when model exists", async () => {
            const model = { id: 1 } as FeatureModel;
            repo.findOne = vi.fn().mockResolvedValue(model);
            const entity = {} as Feature;
            vi.spyOn(FeatureFactory, "rehydrate").mockReturnValue(entity);

            const result = await sut.findById(1);

            expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toBe(entity);
        });
    });

    describe("findByPlanIdAndKey", () => {
        it("should return entity when model exists", async () => {
            const model = { id: 1 } as FeatureModel;
            repo.findOne = vi.fn().mockResolvedValue(model);
            const entity = {} as Feature;
            vi.spyOn(FeatureFactory, "rehydrate").mockReturnValue(entity);

            const result = await sut.findByPlanIdAndKey(1, featureKey.aiHelp);

            expect(repo.findOne).toHaveBeenCalledWith({
                where: { planId: 1, key: featureKey.aiHelp }
            });
            expect(result).toBe(entity);
        });
    });

    describe("save", () => {
        it("should save and return rehydrated entity", async () => {
            const entity = {} as Feature;
            const model = { id: 1 } as FeatureModel;

            vi.spyOn(FeatureFactory, "toModel").mockReturnValue(model);
            repo.save = vi.fn().mockResolvedValue(model);
            vi.spyOn(FeatureFactory, "rehydrate").mockReturnValue(entity);

            const result = await sut.save(entity);

            expect(FeatureFactory.toModel).toHaveBeenCalledWith(entity);
            expect(repo.save).toHaveBeenCalledWith(model);
            expect(result).toBe(entity);
        });
    });

    describe("saveBulk", () => {
        it("should save bulk and return rehydrated entities", async () => {
            const entities = [{} as Feature];
            const models = [{ id: 1 } as FeatureModel];

            vi.spyOn(FeatureFactory, "toModelBulk").mockReturnValue(models);
            repo.save = vi.fn().mockResolvedValue(models);
            vi.spyOn(FeatureFactory, "rehydrateBulk").mockReturnValue(entities);

            const result = await sut.saveBulk(entities);

            expect(FeatureFactory.toModelBulk).toHaveBeenCalledWith(entities);
            expect(repo.save).toHaveBeenCalledWith(models);
            expect(result).toEqual(entities);
        });
    });
});