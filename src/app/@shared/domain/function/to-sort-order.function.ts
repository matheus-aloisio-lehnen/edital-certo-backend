import { sortOrder, type SortOrder } from "@shared/domain/type/page.type";

export const toSortOrder = (value?: string | null, fallback: SortOrder = sortOrder.desc): SortOrder => {
    const normalized = value?.toUpperCase();
    return normalized === sortOrder.asc || normalized === sortOrder.desc
        ? (normalized as SortOrder)
        : fallback;
};
