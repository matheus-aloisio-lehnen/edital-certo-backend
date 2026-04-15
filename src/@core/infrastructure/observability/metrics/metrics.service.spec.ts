import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from "@nestjs/config";
import { Metrics } from "./metrics.service";
import { createConfigServiceMock } from '@mock/tests.mock';

describe('Metrics', () => {
    let service: Metrics;
    let MockConfigServe: ConfigService;

    beforeEach(() => {
        MockConfigServe = createConfigServiceMock({
            observability: { logs: true, metric: true, trace: true },
        });
        service = new Metrics(MockConfigServe);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('increments a counter metric', () => {
        const counter = {
            add: vi.fn(),
        };
        const getCounterSpy = vi.spyOn(service as any, 'getCounter').mockReturnValue(counter);

        service.increment('quota_usage_total', {
            context: 'QuotaUsageService',
        });

        expect(getCounterSpy).toHaveBeenCalledWith('quota_usage_total');
        expect(counter.add).toHaveBeenCalledWith(1, {
            context: 'QuotaUsageService',
        });
    });

    it('records a gauge metric', () => {
        const gauge = {
            record: vi.fn(),
        };
        const getGaugeSpy = vi.spyOn(service as any, 'getGauge').mockReturnValue(gauge);

        service.gauge('quota_usage_depth', 5, {
            context: 'QuotaUsageWorker',
        });

        expect(getGaugeSpy).toHaveBeenCalledWith('quota_usage_depth');
        expect(gauge.record).toHaveBeenCalledWith(5, {
            context: 'QuotaUsageWorker',
        });
    });

    it('records a histogram metric', () => {
        const histogram = {
            record: vi.fn(),
        };
        const getHistogramSpy = vi.spyOn(service as any, 'getHistogram').mockReturnValue(histogram);

        service.observe('quota_usage_duration_ms', 42, {
            context: 'QuotaUsageService',
        });

        expect(getHistogramSpy).toHaveBeenCalledWith('quota_usage_duration_ms');
        expect(histogram.record).toHaveBeenCalledWith(42, {
            context: 'QuotaUsageService',
        });
    });

    it('reuses a counter instrument for the same name', () => {
        const createCounterSpy = vi.spyOn((service as any).meter, 'createCounter');

        service.increment('quota_usage_total');
        service.increment('quota_usage_total');

        expect(createCounterSpy).toHaveBeenCalledTimes(1);
    });

    it('does not record metrics when observability is disabled', () => {
        MockConfigServe = createConfigServiceMock({
            observability: { logs: true, metric: false, trace: true },
        });
        service = new Metrics(MockConfigServe);

        const getCounterSpy = vi.spyOn(service as any, 'getCounter');

        service.increment('disabled_metric_total');

        expect(getCounterSpy).not.toHaveBeenCalled();
    });
});
