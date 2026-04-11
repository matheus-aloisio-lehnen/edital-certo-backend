export const PlanKeys = {
    free: "free",
    start: "start",
    pro: "pro",
    teams: "teams",
} as const;

export type PlanKey = keyof typeof PlanKeys;