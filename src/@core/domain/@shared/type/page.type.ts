import { hasValue } from "@domain/@shared/utils/helper.utils";

export const sortOrder = {
    asc: "ASC",
    desc: "DESC",
} as const;

export type WhereOperator = "like" | "ilike" | "in" | "gt" | "gte" | "lt" | "lte" | "between";
export type WhereValue = | string | number | boolean | null | WhereClause;
export type Where = Record<string, WhereValue>;
export type WhereClause<T = unknown> = {
    op: WhereOperator;
    args: T;
};

export type SortOrder = typeof sortOrder[keyof typeof sortOrder];

export type PageParamsInput = {
    offset?: number;
    limit?: number;
    orderBy?: string;
    sortOrder?: SortOrder;
    start?: string;
    end?: string;
    where?: Where;
};

export type PageParams = {
    offset: number;
    limit: number;
    orderBy: string;
    sortOrder: SortOrder;
    start?: string;
    end?: string;
    where?: Where;
};

export type Page<T> = {
    list: T[];
    count: number;
    offset: number;
    limit: number;
};

export const buildPageParams = (params: Partial<PageParamsInput> = {}): PageParams => {
    const result: PageParams = {
        offset: params.offset ?? 0,
        limit: params.limit ?? 10,
        orderBy: params.orderBy ?? "id",
        sortOrder: params.sortOrder ?? sortOrder.desc,
    };

    if (hasValue(params.start))
        result.start = params.start;
    if (hasValue(params.end))
        result.end = params.end;
    if (hasValue(params.where))
        result.where = params.where;

    return result;
};

export const toSortOrder = (value?: string | null, fallback: SortOrder = sortOrder.desc,): SortOrder => {
    const normalized = value?.toUpperCase();
    return normalized === sortOrder.asc || normalized === sortOrder.desc
        ? (normalized as SortOrder)
        : fallback;
};
