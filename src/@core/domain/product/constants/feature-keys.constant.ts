export const FeatureKeys = {
    library: "library",
    summary: "summary",
    write: "write",
    evaluate: "evaluate",
    aiHelp: "aiHelp",
    calendar: "calendar",
    multiUser: "multiUser",
} as const;

export type FeatureKey = typeof FeatureKeys[keyof typeof FeatureKeys];