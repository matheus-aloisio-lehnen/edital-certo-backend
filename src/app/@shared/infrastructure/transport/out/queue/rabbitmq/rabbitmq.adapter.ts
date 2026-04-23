import { HttpStatus, Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type Channel, type ChannelModel, connect } from "amqplib";

import { type AppConfig, appConfig } from "@root/app.config";
import { code } from "@shared/domain/constant/code.constant";
import { AppException } from "@shared/domain/exception/app.exception";
import { type IQueue, type QueueInput } from "@shared/domain/port/queue.port";

@Injectable()
export class RabbitmqAdapter implements IQueue, OnModuleDestroy {

    private channel?: Channel;
    private connection?: ChannelModel;

    constructor(
        private readonly configService: ConfigService,
    ) {
    }

    async publish(input: QueueInput): Promise<void> {
        const channel = await this.getChannel();

        await channel.assertQueue(input.name, { durable: true });
        channel.sendToQueue(
            input.name,
            Buffer.from(JSON.stringify(input.payload)),
            {
                contentType: "application/json",
                persistent: true,
                type: input.name,
            },
        );
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

        throw new AppException(code.internalServerError, HttpStatus.INTERNAL_SERVER_ERROR, "RabbitMQ URL not configured");
    }

    async onModuleDestroy(): Promise<void> {
        await this.channel?.close();
        await this.connection?.close();
    }

}
