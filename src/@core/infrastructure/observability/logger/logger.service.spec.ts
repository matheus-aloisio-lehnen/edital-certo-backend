import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from "@nestjs/config";
import { appConfig } from "@cfg/app.config";
import { Logger } from "@logger/logger.service";

describe('Logger', () => {
    let service: Logger;

    const createConfigService = (logs: boolean): ConfigService => ({
        get: (key: string) => {
            if (key !== appConfig.KEY)
                return undefined;

            return {
                observability: {
                    logs,
                },
            };
        },
    } as ConfigService);

    beforeEach(() => {
        service = new Logger(createConfigService(true));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('delegates to the level method with the provided context', () => {
        const errorSpy = vi.spyOn(service, 'error').mockImplementation(() => undefined);
        const message = { msg: 'cache failure', key: 'quota' };

        service.write({
            level: 'error',
            context: 'QuotaUsageService',
            message,
        });

        expect(errorSpy).toHaveBeenCalledWith(message, 'QuotaUsageService');
    });

    it('delegates to the level method without context when one is not provided', () => {
        const warnSpy = vi.spyOn(service, 'warn').mockImplementation(() => undefined);
        const message = { msg: 'cache unavailable' };

        service.write({
            level: 'warn',
            message,
        });

        expect(warnSpy).toHaveBeenCalledWith(message);
    });

    it('exports the log record to OpenTelemetry', () => {
        const emitSpy = vi.spyOn((service as any).otelLogger, 'emit');
        const message = { msg: 'cache unavailable', key: 'quota' };

        service.write({
            level: 'warn',
            context: 'QuotaUsageService',
            message,
        });

        expect(emitSpy).toHaveBeenCalledWith({
            severityNumber: 13,
            severityText: 'WARN',
            body: message,
            attributes: {
                context: 'QuotaUsageService',
            },
        });
    });

    it('does not export when logs are disabled', () => {
        service = new Logger(createConfigService(false));

        const emitSpy = vi.spyOn((service as any).otelLogger, 'emit');

        service.write({
            level: 'warn',
            context: 'QuotaUsageService',
            message: { msg: 'cache unavailable' },
        });

        expect(emitSpy).not.toHaveBeenCalled();
    });
});
