import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { type AppConfig } from "@root/app.config";
import { type IEmail, type SendEmailInput, SendEmailDto } from "@shared/domain/port/email.port";
import { HttpService } from "@shared/infrastructure/transport/out/http/axios/http.service";

@Injectable()
export class MailtrapAdapter implements IEmail {

    private readonly apiToken: string;
    private readonly from: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly http: HttpService,
    ) {
        const email = this.configService.get<AppConfig>("app")?.email;

        if (!email?.apiKey || !email?.from)
            throw new Error("Mailtrap configuration keys not found");

        this.apiToken = email.apiKey;
        this.from = email.from;
    }

    async send(input: SendEmailInput): Promise<void> {
        const dto: SendEmailDto = {
            ...input,
            from: { email: this.from, name: "Novo Projeto" },
        };

        await this.http.sendEmail(this.apiToken, dto);
    }

}
