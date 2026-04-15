export const featureKey = {
    library: "LIBRARY",
    summary: "SUMMARY",
    write: "WRITE",
    evaluate: "EVALUATE",
    aiHelp: "AI_HELP",
    calendar: "CALENDAR",
    multiUser: "MULTI_USER",
} as const;

export type FeatureKey = typeof featureKey[keyof typeof featureKey];