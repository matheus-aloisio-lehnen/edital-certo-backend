import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Mailjet, { type Client } from "node-mailjet";

import { AppConfig, appConfig } from "@root/app.config";
import { ToEmail, type IEmail, type SendEmailInput } from "@shared/domain/port/email.port";
import { type ILogger, loggerPort } from "@shared/domain/port/logger.port";

@Injectable()
export class MailjetAdapter implements IEmail {

    private readonly client: Client;
    private readonly from: string;

    constructor(
        @Inject(loggerPort) private readonly logger: ILogger,
        private readonly configService: ConfigService,
    ) {

        const email = this.configService.get<AppConfig>(appConfig.KEY)?.email;

        if (!email?.apiKey || !email?.apiSecret || !email?.from)
            throw new Error("MailJet configuration keys not found");

        this.from = email.from;
        this.client = Mailjet.apiConnect(email.apiKey, email.apiSecret);
    }

    async send(input: SendEmailInput): Promise<void> {
        const message = {
            From: { Email: this.from, Name: "Novo projeto" },
            To: input.to.map((toEmail: ToEmail) => ({ Email: toEmail.email })),
            Subject: input.subject,
            HTMLPart: input.html,
        };

        try {
            await this.client
                .post("send", { version: "v3.1" })
                .request({ Messages: [message] });
        } catch (err) {
            this.logger.error("Failed to send email", err.stack, "MailjetAdapter");
        }
    }

}
