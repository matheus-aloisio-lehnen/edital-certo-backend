import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from "@nestjs/config";
import { Tracer } from "@observability/tracer/tracer.service";
import { createConfigServiceMock } from '@mock/tests.mock';

describe('Tracer', () => {
    let service: Tracer;
    let MockConfigServe: ConfigService;

    beforeEach(() => {
        MockConfigServe = createConfigServiceMock({
            observability: { logs: true, metric: true, trace: true },
        });
        service = new Tracer(MockConfigServe);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('start should start a span and apply attributes', () => {
        const span = {
            setAttributes: vi.fn(),
            end: vi.fn(),
            recordException: vi.fn(),
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
        result.end();
        expect(span.end).toHaveBeenCalled();
    });

    it('start should start a span without attributes when tracing is disabled', () => {
        MockConfigServe = createConfigServiceMock({
            observability: { logs: true, metric: true, trace: false },
        });
        service = new Tracer(MockConfigServe);

        const span = {
            end: vi.fn(),
            setAttributes: vi.fn(),
            recordException: vi.fn(),
        };
        const startSpanSpy = vi.spyOn((service as any).tracer, 'startSpan').mockReturnValue(span);

        const result = service.start('quota_usage_get');

        expect(startSpanSpy).toHaveBeenCalledWith('quota_usage_get');
        result.end();
        expect(span.end).toHaveBeenCalled();
    });
});
