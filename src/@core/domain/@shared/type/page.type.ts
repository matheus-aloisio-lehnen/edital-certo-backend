export type WhereOperator = "like" | "ilike" | "in" | "gt" | "gte" | "lt" | "lte" | "between";
export type WhereValue = | string | number | boolean | null | WhereClause;
export type Where = Record<string, WhereValue>;
export type WhereClause<T = unknown> = {
    op: WhereOperator;
    args: T;
};

export const sortOrder = {
    asc: "ASC",
    desc: "DESC",
} as const;

export type SortOrder = typeof sortOrder[keyof typeof sortOrder];

export const toSortOrder = (value?: string | null, fallback: SortOrder = sortOrder.desc,): SortOrder => {
    const normalized = value?.toUpperCase();
    return normalized === sortOrder.asc || normalized === sortOrder.desc
        ? (normalized as SortOrder)
        : fallback;
};

export type PageParams = {
    offset?: number;
    limit?: number;
    orderBy?: string;
    sortOrder?: SortOrder;
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

export const buildPageParams = (params: Partial<PageParams> = {}): PageParams => {
    const result: PageParams = {
        offset: params.offset ?? 0,
        limit: params.limit ?? 10,
        orderBy: params.orderBy ?? "id",
        sortOrder: params.sortOrder ?? sortOrder.desc,
    };

    if (params.start)
        result.start = params.start;
    if (params.end)
        result.end = params.end;
    if (params.where)
        result.where = params.where;

    return result;
};

// where: {
//   is_active: true,
//   id: { op: "in", args: [10, 20, 30] },
//   "tenant.user.created_at": {
//     op: "between",
//     args: ["2025-02-28", "2025-03-30"] // 2025-02-30 não existe
//   },
//   "user.address.city": {
//     op: "ilike",
//     args: "%São Paulo%"
//   }
// }