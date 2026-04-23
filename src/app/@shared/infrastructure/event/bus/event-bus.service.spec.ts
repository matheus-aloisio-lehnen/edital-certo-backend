import { EventEmitter2 } from "@nestjs/event-emitter";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EventBusService } from "./event-bus.service";

describe('EventBusService', () => {
    let service: EventBusService;
    let eventEmitter: EventEmitter2;
    let logger: { error: ReturnType<typeof vi.fn> };
    let metrics: { increment: ReturnType<typeof vi.fn>; observe: ReturnType<typeof vi.fn> };
    let span: { end: ReturnType<typeof vi.fn> };
    let tracer: { start: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        eventEmitter = {
            listeners: vi.fn(() => [ 'listener' ]),
            emitAsync: vi.fn(),
        } as unknown as EventEmitter2;
        logger = {
            error: vi.fn(),
        };
        metrics = {
            increment: vi.fn(),
            observe: vi.fn(),
        };
        span = {
            end: vi.fn(),
        };
        tracer = {
            start: vi.fn(() => span),
        };

        service = new EventBusService(eventEmitter, logger as any, metrics as any, tracer as any);
    });

    it('publish should publish events asynchronously and records success telemetry', async () => {
        await service.publish({
            name: 'auth.pwd-reset-requested',
            payload: { to: 'user@test.com' },
        });

        expect(tracer.start).toHaveBeenCalledWith('event_bus.publish', {
            'event.name': 'auth.pwd-reset-requested',
            'event.listeners': 1,
        });
        expect(metrics.increment).toHaveBeenCalledWith('event_bus_publish_total', {
            context: 'EventBusService',
            event: 'auth.pwd-reset-requested',
        });
        expect((eventEmitter.emitAsync as any)).toHaveBeenCalledWith('auth.pwd-reset-requested', {
            name: 'auth.pwd-reset-requested',
            payload: { to: 'user@test.com' },
        });
        expect(metrics.increment).toHaveBeenCalledWith('event_bus_publish_success_total', {
            context: 'EventBusService',
            event: 'auth.pwd-reset-requested',
        });
        expect(metrics.observe).toHaveBeenCalledWith(
            'event_bus_publish_duration_ms',
            expect.any(Number),
            {
                context: 'EventBusService',
                event: 'auth.pwd-reset-requested',
            },
        );
        expect(span.end).toHaveBeenCalled();
    });

    it('publish should record failure telemetry and rethrows handler errors', async () => {
        const error = new Error('handler failed');
        (eventEmitter.emitAsync as any).mockRejectedValue(error);

        await expect(
            service.publish({
                name: 'auth.pwd-reset-requested',
                payload: {},
            }),
        ).rejects.toThrow('handler failed');

        expect(metrics.increment).toHaveBeenCalledWith('event_bus_publish_failure_total', {
            context: 'EventBusService',
            event: 'auth.pwd-reset-requested',
        });
        expect(logger.error).toHaveBeenCalledWith({
            msg: 'Event handler failed',
            error: 'handler failed',
            event: 'auth.pwd-reset-requested',
            listenerCount: 1,
        }, error.stack, 'EventBusService');
        expect(span.end).toHaveBeenCalled();
    });
});
