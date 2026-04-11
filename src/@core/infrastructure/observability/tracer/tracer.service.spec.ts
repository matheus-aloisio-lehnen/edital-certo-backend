import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from "@nestjs/config";
import { appConfig } from "@cfg/app.config";
import { Tracer } from "@tracer/tracer.service";

describe('Tracer', () => {
    let service: Tracer;

    const createConfigService = (trace: boolean): ConfigService => ({
        get: (key: string) => {
            if (key !== appConfig.KEY)
                return undefined;

            return {
                observability: {
                    trace,
                },
            };
        },
    } as ConfigService);

    beforeEach(() => {
        service = new Tracer(createConfigService(true));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('starts a span and applies attributes', () => {
        const span = {
            setAttributes: vi.fn(),
        };
        const startSpanSpy = vi.spyOn((service as any).tracer, 'startSpan').mockReturnValue(span);

        const result = service.start('quota_usage_get', {
            context: 'QuotaUsageService',
            success: true,
        });

        expect(startSpanSpy).toHaveBeenCalledWith('quota_usage_get');
        expect(span.setAttributes).toHaveBeenCalledWith({
            context: 'QuotaUsageService',
            success: true,
        });
        expect(result).toBe(span);
    });

    it('starts a span without attributes when tracing is disabled', () => {
        service = new Tracer(createConfigService(false));

        const span = {};
        const startSpanSpy = vi.spyOn((service as any).tracer, 'startSpan').mockReturnValue(span);

        const result = service.start('quota_usage_get');

        expect(startSpanSpy).toHaveBeenCalledWith('quota_usage_get');
        expect(result).toBe(span);
    });
});
