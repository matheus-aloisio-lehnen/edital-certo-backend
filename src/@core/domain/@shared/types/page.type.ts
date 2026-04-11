export type WhereOperator = "like" | "ilike" | "in" | "gt" | "gte" | "lt" | "lte" | "between";

export const SortOrder = {
    asc: "asc",
    desc: "desc",
} as const;

export type SortOrder = typeof SortOrder[keyof typeof SortOrder];

export type WhereClause<T> = {
    op: WhereOperator;
    args: T;
};

export type Page<T> = {
    list: T[];
    count: number;
    offset: number;
    limit: number;
};

export type PageParams = {
    offset?: number;
    limit?: number;
    orderBy?: string;
    sortOrder?: SortOrder;
    start?: string;
    end?: string;
    where?: Record<string, any>;
};

export const buildPageParams = (params: Partial<PageParams> = {}): PageParams => ({
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
    orderBy: params.orderBy ?? "id",
    sortOrder: params.sortOrder ?? SortOrder.desc,
    ...(params.start
        ? { start: params.start }
        : {}),
    ...(params.end
        ? { end: params.end }
        : {}),
    ...(params.where
        ? { where: params.where }
        : {}),
});
