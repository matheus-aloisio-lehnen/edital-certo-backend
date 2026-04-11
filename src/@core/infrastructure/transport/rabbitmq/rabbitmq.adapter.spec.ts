import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from "@nestjs/config";
import { appConfig } from "@cfg/app.config";
import { RabbitmqAdapter } from "./rabbitmq.adapter";

const { createChannel, connect } = vi.hoisted(() => ({
    createChannel: vi.fn(),
    connect: vi.fn(),
}));

vi.mock('amqplib', () => ({
    connect,
}));

describe('RabbitmqAdapter', () => {
    let service: RabbitmqAdapter;
    let channel: {
        assertQueue: ReturnType<typeof vi.fn>;
        sendToQueue: ReturnType<typeof vi.fn>;
        close: ReturnType<typeof vi.fn>;
    };
    let connection: {
        createChannel: ReturnType<typeof vi.fn>;
        close: ReturnType<typeof vi.fn>;
    };

    const createConfigService = (): ConfigService => ({
        get: (key: string) => {
            if (key !== appConfig.KEY)
                return undefined;

            return {
                rabbitmq: {
                    url: 'amqp://rabbitmq',
                },
            };
        },
    } as ConfigService);

    beforeEach(() => {
        channel = {
            assertQueue: vi.fn(),
            sendToQueue: vi.fn(),
            close: vi.fn(),
        };
        connection = {
            createChannel,
            close: vi.fn(),
        };

        createChannel.mockReset();
        createChannel.mockResolvedValue(channel);
        connect.mockReset();
        connect.mockResolvedValue(connection);

        service = new RabbitmqAdapter(createConfigService());
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('publishes the event to the queue with persistent message options', async () => {
        await service.publish({
            name: 'password-reseted',
            payload: {
                email: 'john@doe.com',
            },
        });

        expect(connect).toHaveBeenCalledWith('amqp://rabbitmq');
        expect(channel.assertQueue).toHaveBeenCalledWith('password-reseted', {
            durable: true,
        });
        expect(channel.sendToQueue).toHaveBeenCalledWith(
            'password-reseted',
            Buffer.from(JSON.stringify({
                email: 'john@doe.com',
            })),
            {
                persistent: true,
                contentType: 'application/json',
                type: 'password-reseted',
            },
        );
    });

    it('reuses the same channel for multiple publishes', async () => {
        await service.publish({
            name: 'event-a',
            payload: {},
        });
        await service.publish({
            name: 'event-b',
            payload: {},
        });

        expect(connect).toHaveBeenCalledTimes(1);
        expect(createChannel).toHaveBeenCalledTimes(1);
    });
});
