export type LogInput = {
    level: 'log' | 'warn' | 'error' | 'debug' | 'verbose';
    message: Record<string, unknown>;
    context?: string;
}

export interface ILogger {
    write(input: LogInput): void;
}