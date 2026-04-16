export const sortOrder = {
    asc: "ASC",
    desc: "DESC",
} as const;

export const toSortOrder = (value?: string | null, fallback: SortOrder = sortOrder.desc,): SortOrder => {
    const normalized = value?.toUpperCase();
    return normalized === sortOrder.asc || normalized === sortOrder.desc
        ? (normalized as SortOrder)
        : fallback;
};

export type WhereOperator = "like" | "ilike" | "in" | "gt" | "gte" | "lt" | "lte" | "between";
export type WhereValue = | string | number | boolean | null | WhereClause;
export type Where = Record<string, WhereValue>;
export type WhereClause<T = unknown> = {
    op: WhereOperator;
    args: T;
};

export type SortOrder = typeof sortOrder[keyof typeof sortOrder];

export type PageParams = {
    offset: number;
    limit: number;
    orderBy: string;
    sortOrder: SortOrder;
    start?: Date;
    end?: Date;
    where?: Where;
};

export type Page<T> = {
    list: T[];
    count: number;
    offset: number;
    limit: number;
};
