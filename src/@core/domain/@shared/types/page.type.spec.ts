import { buildPageParams, SortOrder } from "@domain/@shared/types/page.type";

describe("page.type", () => {
    it("should build default page params", () => {
        expect(buildPageParams()).toEqual({
            offset: 0,
            limit: 10,
            orderBy: "id",
            sortOrder: SortOrder.desc,
        });
    });

    it("should build custom page params", () => {
        expect(buildPageParams({
            offset: 20,
            limit: 5,
            orderBy: "createdAt",
            sortOrder: SortOrder.asc,
        })).toEqual({
            offset: 20,
            limit: 5,
            orderBy: "createdAt",
            sortOrder: SortOrder.asc,
        });
    });

    it("should include start, end and where only when provided", () => {
        expect(buildPageParams({
            start: "2026-01-01",
            end: "2026-01-31",
            where: { status: "active" },
        })).toEqual({
            offset: 0,
            limit: 10,
            orderBy: "id",
            sortOrder: SortOrder.desc,
            start: "2026-01-01",
            end: "2026-01-31",
            where: { status: "active" },
        });
    });
});
