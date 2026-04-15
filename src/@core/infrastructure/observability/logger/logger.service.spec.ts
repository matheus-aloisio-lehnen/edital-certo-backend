import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from "@nestjs/config";
import { Logger } from "@observability/logger/logger.service";
import { createConfigServiceMock } from '@mock/tests.mock';

describe('Logger', () => {
    let service: Logger;
    let MockConfigServe: ConfigService;

    beforeEach(() => {
        MockConfigServe = createConfigServiceMock({
            observability: { logs: true, metric: true, trace: true },
        });
        service = new Logger(MockConfigServe);
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

    it('does not export when observability are disabled', () => {
        MockConfigServe = createConfigServiceMock({
            observability: { logs: false, metric: true, trace: true },
        });
        service = new Logger(MockConfigServe);

        const emitSpy = vi.spyOn((service as any).otelLogger, 'emit');

        service.write({
            level: 'warn',
            context: 'QuotaUsageService',
            message: { msg: 'cache unavailable' },
        });

        expect(emitSpy).not.toHaveBeenCalled();
    });
});
