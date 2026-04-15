export const planKey = {
    free: "FREE",
    start: "START",
    pro: "PRO",
    teams: "TEAMS",
} as const;

export type PlanKey = typeof planKey[keyof typeof planKey];