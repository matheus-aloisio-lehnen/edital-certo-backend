import {
    Between,
    Equal,
    FindManyOptions,
    FindOptionsOrder,
    ILike,
    In,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual, ObjectLiteral, Repository,
} from "typeorm";
import { startOfDay, endOfDay, parseISO, isValid } from "date-fns";
import { PageParams, buildPageParams, sortOrder, toSortOrder, WhereClause } from "@domain/@shared/type/page.type";

export const toQueryOptions = <T>(rawParams: Partial<PageParams>, allowedOrderBy: readonly string[],): { options: FindManyOptions<T>; offset: number; limit: number } => {

    const params = buildPageParams(rawParams);
    const offset = params.offset ?? 0;
    const limit = params.limit ?? 10;

    const where = buildWhere(params.where);
    const finalWhere = applyDateRange(where, params);

    const order = buildOrder(params, allowedOrderBy);

    return {
        offset,
        limit,
        options: {
            where: finalWhere,
            order,
            skip: offset,
            take: limit,
        },
    };
};

const buildOrder = <T>(params: PageParams, allowed: readonly string[]): FindOptionsOrder<T> => {
    const fallback = "id";
    const orderBy = allowed.includes(params.orderBy ?? "")
        ? params.orderBy!
        : fallback;

    const direction = toSortOrder(params.sortOrder, sortOrder.desc);

    return { [orderBy]: direction } as FindOptionsOrder<T>;
};

const buildWhere = (input?: Record<string, any>) => {
    if (!input)
        return {};

    let result: Record<string, any> = {};

    for (const key in input) {
        const value = input[key];
        if (!key)
            continue;

        const path = key.split(".");
        const transformed = transformValue(value);

        const nested = buildNested(path, transformed);
        result = deepMerge(result, nested);
    }

    return result;
};

const buildNested = (path: string[], value: any) => {
    const root: Record<string, any> = {};
    let current = root;

    path.forEach((segment, index) => {
        if (index === path.length - 1) {
            current[segment] = value;
            return;
        }

        current[segment] = {};
        current = current[segment];
    });

    return root;
};

const deepMerge = (target: Record<string, any>, source: Record<string, any>) => {
    const result = { ...target };

    for (const key in source) {
        const targetValue = result[key];
        const sourceValue = source[key];

        const targetIsObject = targetValue !== null && typeof targetValue === "object";
        const sourceIsObject = sourceValue !== null && typeof sourceValue === "object";

        const targetIsDate = targetValue instanceof Date;
        const sourceIsDate = sourceValue instanceof Date;

        const shouldDeepMerge =
            targetIsObject &&
            sourceIsObject &&
            !targetIsDate &&
            !sourceIsDate;

        if (shouldDeepMerge) {
            result[key] = deepMerge(targetValue, sourceValue);
            continue;
        }

        result[key] = sourceValue;
    }

    return result;
};

const transformValue = (value: any) => {
    const isObject = typeof value === "object" && value !== null;
    const isWhereClause = isObject && "op" in value;

    if (!isWhereClause)
        return Equal(value);

    const clause = value as WhereClause;

    switch (clause.op) {
        case "like":
            return Like(String(clause.args));
        case "ilike":
            return ILike(String(clause.args));
        case "in":
            return In(clause.args as any[]);
        case "gt":
            return MoreThan(clause.args);
        case "gte":
            return MoreThanOrEqual(clause.args);
        case "lt":
            return LessThan(clause.args);
        case "lte":
            return LessThanOrEqual(clause.args);
        case "between":
            const [start, end] = clause.args as [any, any];
            return Between(start, end);
        default:
            return Equal(clause.args);
    }
};

const applyDateRange = (where: Record<string, any>, params: PageParams) => {
    if (!params.start && !params.end)
        return where;

    const hasOverride = Object.keys(where).some((key) => key.includes("createdAt"));

    if (hasOverride)
        return where;

    const result = { ...where };

    const start = params.start ? parseISO(params.start) : null;
    const end = params.end ? parseISO(params.end) : null;

    const validStart = start && isValid(start) ? startOfDay(start) : null;
    const validEnd = end && isValid(end) ? endOfDay(end) : null;

    if (validStart && validEnd) {
        result["createdAt"] = Between(validStart, validEnd);
        return result;
    }

    if (validStart) {
        result["createdAt"] = MoreThanOrEqual(validStart);
        return result;
    }

    if (validEnd) {
        result["createdAt"] = LessThanOrEqual(validEnd);
        return result;
    }

    return result;
};