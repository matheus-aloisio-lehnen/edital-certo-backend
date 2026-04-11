export const eventNames = {
    requestPwdReset: "requestPwdReset",
    confirmPwdReset: "confirmPwdReset",
    requestWinback: "requestWinback",
    confirmWinback: "confirmWinback",
} as const

export type EventName = typeof eventNames[keyof typeof eventNames]