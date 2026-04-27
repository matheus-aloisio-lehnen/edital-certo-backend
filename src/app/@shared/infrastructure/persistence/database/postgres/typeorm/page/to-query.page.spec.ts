import { describe, it, expect } from "vitest";
import { toQuery } from "./to-query.page";
import {
    Between,
    Equal,
    ILike,
    In,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    LessThan,
} from "typeorm";
import { PageParams, sortOrder } from "@shared/domain/type/page.type";
import { MockPagination } from "@mock/in-memory.mock";

describe("toQuery", () => {
    const allowedOrderBy = [
        "id",
        "name",
        "createdAt",
        "prices.key",
        "prices.currency",
        "prices.value",
        "prices.discounts.name",
        "prices.discounts.value",
        "prices.discounts.campaignStartsAt"
    ];

    describe("where / nested objects", () => {
        it("should transform params.where with simple key into direct where", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { name: "test" }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toEqual({ name: Equal("test") });
        });

        it("should transform params.where with nested key using dot notation into nested object", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { "prices.key": "MONTHLY" }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toEqual({
                prices: { key: Equal("MONTHLY") }
            });
        });

        it("should transform multiple different nested keys without overwriting each other", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: {
                    "prices.key": "MONTHLY",
                    "prices.currency": "BRL",
                    "other.key": "val"
                }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toEqual({
                prices: {
                    key: Equal("MONTHLY"),
                    currency: Equal("BRL")
                },
                other: {
                    key: Equal("val")
                }
            });
        });

        it("should support deep nesting, e.g., prices.discounts.name", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { "prices.discounts.name": "OFF10" }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toEqual({
                prices: {
                    discounts: {
                        name: Equal("OFF10")
                    }
                }
            });
        });

        it("should maintain correct structure when there is more than one level of nesting", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: {
                    "prices.discounts.name": "OFF10",
                    "prices.discounts.value": 10,
                    "prices.value": 100
                }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toEqual({
                prices: {
                    discounts: {
                        name: Equal("OFF10"),
                        value: Equal(10)
                    },
                    value: Equal(100)
                }
            });
        });
    });

    describe("operators", () => {
        it("should generate Like() for { op: 'like', args: 'abc' }", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { name: { op: "like" as const, args: "abc" } }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).name).toEqual(Like("abc"));
        });

        it("should generate ILike() for { op: 'ilike' }", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { name: { op: "ilike" as const, args: "abc" } }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).name).toEqual(ILike("abc"));
        });

        it("should generate In() for { op: 'in' }", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { id: { op: "in" as const, args: [1, 2, 3] } }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).id).toEqual(In([1, 2, 3]));
        });

        it("should generate MoreThan/lte", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: {
                    a: { op: "gt" as const, args: 10 },
                    b: { op: "gte" as const, args: 20 },
                    c: { op: "lt" as const, args: 30 },
                    d: { op: "lte" as const, args: 40 }
                }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).a).toEqual(MoreThan(10));
            expect((result.where as any).b).toEqual(MoreThanOrEqual(20));
            expect((result.where as any).c).toEqual(LessThan(30));
            expect((result.where as any).d).toEqual(LessThanOrEqual(40));
        });

        it("should generate Between(start, end) for between operator", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { value: { op: "between" as const, args: [10, 20] } }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).value).toEqual(Between(10, 20));
        });

        it("should generate Equal(value) for simple values without op", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { active: true }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).active).toEqual(Equal(true));
        });

        it("should use Equal(args) as default when op is unknown", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { name: { op: "unknown" as any, args: "abc" } }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).name).toEqual(Equal("abc"));
        });
    });

    describe("deep merge", () => {
        it("should combine nested filters in different keys without losing data", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: {
                    "prices.value": 100,
                    "prices.discounts.name": "OFF"
                }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toEqual({
                prices: {
                    value: Equal(100),
                    discounts: {
                        name: Equal("OFF")
                    }
                }
            });
        });

        it("should avoid overwriting an object with another on the same root", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: {
                    "prices.discounts.id": 1,
                    "prices.currency": "BRL"
                }
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toEqual({
                prices: {
                    discounts: { id: Equal(1) },
                    currency: Equal("BRL")
                }
            });
        });
    });

    describe("order by", () => {
        it("should apply orderBy on root when allowed", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "name",
                sortOrder: "ASC"
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.order).toEqual({ name: "ASC" });
        });

        it("should apply nested orderBy when allowed, e.g., prices.discounts.name", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "prices.discounts.name",
                sortOrder: "DESC"
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.order).toEqual({
                prices: {
                    discounts: {
                        name: "DESC"
                    }
                }
            });
        });

        it("should refuse not allowed orderBy and use fallback id", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "notAllowed",
                sortOrder: "ASC"
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.order).toEqual({ id: "ASC" });
        });

        it("should apply sortOrder asc/desc correctly", () => {
            const paramsAsc: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: "ASC"
            };
            const resultAsc = toQuery(paramsAsc, allowedOrderBy);
            expect(resultAsc.order).toEqual({ id: "ASC" });

            const paramsDesc: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: "DESC"
            };
            const resultDesc = toQuery(paramsDesc, allowedOrderBy);
            expect(resultDesc.order).toEqual({ id: "DESC" });
        });

        it("should cover empty/undefined orderBy", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: undefined as any,
                sortOrder: sortOrder.desc,
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.order).toEqual({ id: "DESC" });
        });

        it("should cover allowed and not allowed nested path orderBy", () => {
            const paramsPerm: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "prices.value",
                sortOrder: sortOrder.desc,
            };
            const resultPerm = toQuery(paramsPerm, allowedOrderBy);
            expect(resultPerm.order).toEqual({ prices: { value: "DESC" } });

            const paramsNotPerm: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "prices.secret",
                sortOrder: sortOrder.desc,
            };
            const resultNotPerm = toQuery(paramsNotPerm, allowedOrderBy);
            expect(resultNotPerm.order).toEqual({ id: "DESC" });
        });
    });

    describe("date range", () => {
        it("should apply createdAt Between when start and end are valid", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                start: new Date("2023-01-01T00:00:00Z"),
                end: new Date("2023-01-31T23:59:59Z")
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).createdAt).toBeDefined();
        });

        it("should apply GreaterThanOrEqual when only start exists", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                start: new Date("2023-01-01T00:00:00Z")
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).createdAt).toBeDefined();
        });

        it("should apply LessThanOrEqual when only end exists", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                end: new Date("2023-01-31T23:59:59Z")
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).createdAt).toBeDefined();
        });

        it("should not apply date range when start/end are invalid", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                start: "invalid" as any,
                end: "invalid" as any
            };
            const result = toQuery(params, allowedOrderBy);
            expect((result.where as any)?.createdAt).toBeUndefined();
        });

        it("should not overwrite createdAt if it is explicitly provided in where", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
                where: { createdAt: "explicit" },
                start: new Date("2023-01-01T00:00:00Z"),
                end: new Date("2023-01-31T23:59:59Z")
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toBeDefined();
            expect((result.where as any).createdAt).toEqual(Equal("explicit"));
        });
    });

    describe("final return and MockPagination", () => {
        it("should validate that toQuery returns the expected structure", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: "id",
                sortOrder: sortOrder.desc,
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result).toHaveProperty("where");
            expect(result).toHaveProperty("order");
        });

        it("should correctly process the provided MockPagination", () => {
            const params: PageParams = {
                ...MockPagination,
                offset: MockPagination.offset,
                limit: MockPagination.limit,
                orderBy: MockPagination.orderBy,
                sortOrder: MockPagination.sortOrder as any,
                start: new Date(MockPagination.start),
                end: new Date(MockPagination.end),
                where: MockPagination.where as any
            };
            const result = toQuery(params, allowedOrderBy);

            expect(result.order).toEqual({
                prices: {
                    discounts: {
                        name: "ASC"
                    }
                }
            });

            expect(result.where).toEqual({
                key: In(["free", "start", "pro"]),
                name: ILike("%Produto%"),
                prices: {
                    billingCycle: Equal("YEARLY"),
                    value: MoreThanOrEqual(1000),
                    discounts: {
                        name: ILike("%OFF%"),
                        value: Between(10, 30),
                        campaignStartsAt: Between("2025-02-28", "2025-03-30"),
                        externalDiscountId: Equal(null)
                    }
                },
                isActive: Equal(true),
                createdAt: expect.anything()
            });
        });

        it("should cover empty and null cases", () => {
            const params: PageParams = {
                offset: 0,
                limit: 10,
                orderBy: undefined as any,
                sortOrder: sortOrder.desc,
                where: undefined
            };
            const result = toQuery(params, allowedOrderBy);
            expect(result.where).toEqual({});
            expect(result.order).toEqual({ id: "DESC" });
        });
    });
});
