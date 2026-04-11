export const ResetWindows = {
    monthly: "MONTHLY",
    yearly: "YEARLY",
    static: "STATIC",
} as const;

export type ResetWindow = typeof ResetWindows[keyof typeof ResetWindows];

// Helpers simples em vez de uma classe ou VO
export const isStatic = (rw: ResetWindow): boolean => rw === ResetWindows.static;

export const toResetWindow = (value: string): ResetWindow => {
    const found = Object.values(ResetWindows).find((v) => v === value);
    return (found as ResetWindow) || ResetWindows.monthly;
};