export const eventName = {
    pwdResetRequested: "PWD_RESET_REQUESTED",
    pwdResetConfirmed: "PWD_RESET_CONFIRMED",
    winbackRequested: "WINBACK_REQUESTED",
    winbackConfirmed: "WINBACK_CONFIRMED",
    emailOtpRequested: "EMAIL_OTP_REQUESTED",
} as const

export type EventName = typeof eventName[keyof typeof eventName]