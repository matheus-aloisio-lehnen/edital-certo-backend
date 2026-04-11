import { HttpStatus, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Channel, Connection, connect } from "amqplib";
import { AppConfig, appConfig } from "@cfg/app.config";
import { EventInput, IEventBus } from "@domain/@shared/ports/event-bus.port";
import { BackendCode } from "@domain/@shared/constants/backend-code.constant";
import { AppException } from "@domain/@shared/exceptions/app.exception";

@Injectable()
export class RabbitmqAdapter implements IEventBus, OnModuleDestroy {

    private connection?: Connection;
    private channel?: Channel;

    constructor(
        private configService: ConfigService,
    ) {}

    async publish(input: EventInput): Promise<void> {
        const channel = await this.getChannel();
        const payload = Buffer.from(JSON.stringify(input.payload));

        await channel.assertQueue(input.name, {
            durable: true,
        });
        channel.sendToQueue(input.name, payload, {
            persistent: true,
            contentType: 'application/json',
            type: input.name,
        });
    }

    private async getChannel(): Promise<Channel> {
        if (this.channel)
            return this.channel;

        this.connection = await connect(this.getUrl());
        this.channel = await this.connection.createChannel();
        return this.channel;
    }

    private getUrl(): string {
        const rabbitmq = this.configService.get<AppConfig>(appConfig.KEY)?.rabbitmq;

        if (rabbitmq?.url)
            return rabbitmq.url;

        throw new AppException(BackendCode.internalServerError, HttpStatus.INTERNAL_SERVER_ERROR, "RabbitMQ URL not configured");
    }

    async onModuleDestroy(): Promise<void> {
        await this.channel?.close();
        await this.connection?.close();
    }

}
