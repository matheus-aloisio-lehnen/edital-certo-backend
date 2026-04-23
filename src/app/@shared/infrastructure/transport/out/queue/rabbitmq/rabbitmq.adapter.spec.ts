import { beforeEach, describe, expect, it, vi } from "vitest";
import { connect } from "amqplib";

import { appConfig } from "@root/app.config";
import { RabbitmqAdapter } from "./rabbitmq.adapter";

vi.mock("amqplib", () => ({
    connect: vi.fn(),
}));

describe("RabbitmqAdapter", () => {
    let service: RabbitmqAdapter;
    let assertQueue: ReturnType<typeof vi.fn>;
    let closeChannel: ReturnType<typeof vi.fn>;
    let closeConnection: ReturnType<typeof vi.fn>;
    let createChannel: ReturnType<typeof vi.fn>;
    let sendToQueue: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        assertQueue = vi.fn().mockResolvedValue(undefined);
        closeChannel = vi.fn().mockResolvedValue(undefined);
        closeConnection = vi.fn().mockResolvedValue(undefined);
        sendToQueue = vi.fn();
        createChannel = vi.fn().mockResolvedValue({
            assertQueue,
            close: closeChannel,
            sendToQueue,
        });

        vi.mocked(connect).mockResolvedValue({
            close: closeConnection,
            createChannel,
        } as any);

        service = new RabbitmqAdapter({
            get: vi.fn((key: string) => key === appConfig.KEY
                ? {
                    rabbitmq: {
                        url: "amqp://localhost",
                    },
                }
                : undefined),
        } as any);
    });

    it("publish should publish a persistent JSON queue message", async () => {
        await service.publish({
            name: "password-reseted",
            payload: { userId: 1 },
        });

        expect(connect).toHaveBeenCalledWith("amqp://localhost");
        expect(assertQueue).toHaveBeenCalledWith("password-reseted", { durable: true });
        expect(sendToQueue).toHaveBeenCalledWith(
            "password-reseted",
            Buffer.from(JSON.stringify({ userId: 1 })),
            {
                contentType: "application/json",
                persistent: true,
                type: "password-reseted",
            },
        );
    });

    it("publish should reuse the same channel for multiple publishes", async () => {
        await service.publish({
            name: "event-a",
            payload: {},
        });
        await service.publish({
            name: "event-b",
            payload: {},
        });

        expect(connect).toHaveBeenCalledTimes(1);
        expect(createChannel).toHaveBeenCalledTimes(1);
    });

    it("onModuleDestroy should close channel and connection", async () => {
        await service.publish({
            name: "event-a",
            payload: {},
        });

        await service.onModuleDestroy();

        expect(closeChannel).toHaveBeenCalled();
        expect(closeConnection).toHaveBeenCalled();
    });
});
