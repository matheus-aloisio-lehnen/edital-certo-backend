import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailjet, { Client } from 'node-mailjet';

import { AppConfig, appConfig } from '@cfg/app.config';
import { Logger } from '@observability/logger/logger.service';
import { IEmail, SendEmailInput } from "@domain/@shared/port/email.port";

@Injectable()
export class Email implements IEmail {

    private readonly client: Client;
    private readonly from: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) {

        const email = this.configService.get<AppConfig>(appConfig.KEY)?.email;

        if (!email?.apiKey || !email?.apiSecret || !email?.from)
            throw new Error('MailJet configuration keys not found');

        this.from = email.from;
        this.client = Mailjet.apiConnect(email.apiKey, email.apiSecret);
    }

    async send(input: SendEmailInput): Promise<void> {
        const message = {
            From: { Email: this.from, Name: 'Edital Certo' },
            To: [{ Email: input.to }],
            Subject: input.subject,
            HTMLPart: input.html,
        };

        try {
            await this.client
            .post('send', { version: 'v3.1' })
            .request({ Messages: [message] });
        } catch (err) {
            this.logger.error('Failed to send email', err.stack, 'EmailService');
        }
    }

}