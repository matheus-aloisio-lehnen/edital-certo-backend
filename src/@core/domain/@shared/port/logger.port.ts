export const loggerPort = Symbol('LOGGER_PORT');

export type LogInput = {
    level: 'log' | 'warn' | 'error' | 'debug' | 'verbose';
    message: Record<string, unknown>;
    context?: string;
}

export interface ILogger {
    write(input: LogInput): void;
    log(message: unknown, context?: string): void;
    warn(message: unknown, context?: string): void;
    debug(message: unknown, context?: string): void;
    verbose(message: unknown, context?: string): void;
    error(message: unknown, stackOrContext?: string, context?: string): void;
}
