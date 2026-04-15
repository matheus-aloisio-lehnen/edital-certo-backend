import { HttpStatus, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Channel, ChannelModel, connect } from "amqplib";
import { AppConfig, appConfig } from "@cfg/app.config";
import { code } from "@domain/@shared/constant/code.constant";
import { AppException } from "@domain/@shared/exception/app.exception";
import { IQueue, QueueInput } from "@domain/@shared/port/queue.port";

@Injectable()
export class Rabbitmq implements IQueue, OnModuleDestroy {

    //TODO QUEM FOR CHAMAR ELE VAI NO event/handler/queue/nome do handler
    private connection?: ChannelModel;
    private channel?: Channel;

    constructor(
        private configService: ConfigService,
    ) {}

    async publish(input: QueueInput): Promise<void> {
        const channel = await this.getChannel();

        const payload = Buffer.from(JSON.stringify(input.payload));

        await channel.assertQueue(input.name, { durable: true });

        channel.sendToQueue(input.name, payload, { persistent: true, contentType: 'application/json', type: input.name });
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
