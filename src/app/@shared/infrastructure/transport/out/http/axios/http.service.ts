import { Inject, Injectable } from '@nestjs/common';
import { httpMethod, RequestOptions, Response } from "@shared/domain/type/http.type";
import { type ILogger, loggerPort } from "@shared/domain/port/logger.port";
import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import axios, { AxiosError, AxiosInstance } from "axios";
import { SendEmailDto } from "@shared/domain/port/email.port";


@Injectable()
export class HttpService {

    private readonly client: AxiosInstance;

    constructor(
        @Inject(loggerPort) private readonly logger: ILogger,
    ) {
        this.client = axios.create();
    }

    async sendEmail(apiToken: string, body: SendEmailDto): Promise<void> {
        const url = "https://send.api.mailtrap.io/api/send";
        const headers =  { Authorization: `Bearer ${ apiToken }`, "Content-Type": "application/json" }
        await this.send({ method: httpMethod.post, url, body, headers });
    }

    private async send<T>(opt: RequestOptions): Promise<T | undefined> {
        const { method, url, body, params, headers, silent } = opt;

        try {
            const response = await this.client.request<T>({ method, url, data: body, params, headers, });
            return response.data;
        } catch ( err ) {
            const error = err as AxiosError<Response<any>>;
            const data = error.response?.data;

            const statusCode = error.response?.status ?? 500;
            const errorCode = data?.code ?? code.externalRequestFailedError;
            const message = data?.message
                ?? error.response?.statusText
                ?? error.message;

            this.logger.error(`External request failed: ${ method } ${ url } - ${ statusCode } ${ message }`, error.stack, HttpService.name,);

            if (!silent)
                throw new AppException(errorCode, statusCode, message);
        }
    }


}
