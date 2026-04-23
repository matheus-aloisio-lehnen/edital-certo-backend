import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Request, Response as ExpressResponse } from "express";
import { Response } from "@shared/domain/type/http.type";
import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { type ILogger, loggerPort } from "@shared/domain/port/logger.port";
import { type IMetrics, metricsPort } from "@shared/domain/port/metrics.port";
import { type ITracer, tracerPort } from "@shared/domain/port/tracer.port";

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {

    constructor(
        @Inject(loggerPort) private readonly logger: ILogger,
        @Inject(metricsPort) private readonly metrics: IMetrics,
        @Inject(tracerPort) private readonly tracer: ITracer,
    ) {}

    catch(exception: T, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<ExpressResponse>();
        const path = request.url;
        const traceAttributes = {
            code: this.getTraceCode(exception),
            method: request.method,
            path,
        };
        const span = this.tracer.start('http_exception_filter', traceAttributes);

        try {
            const appResponse = this.getResponse(exception);

            this.metrics.increment('http_exceptions_total', {
                code: appResponse.code,
                context: 'AllExceptionsFilter',
                statusCode: String(appResponse.statusCode),
            });

            this.logger.write({
                level: 'error',
                context: 'AllExceptionsFilter',
                message: {
                    code: appResponse.code,
                    message: appResponse.message,
                    method: request.method,
                    path,
                    statusCode: appResponse.statusCode,
                },
            });

            response
                .status(appResponse.statusCode)
                .json({
                    ...appResponse,
                    path,
                    timestamp: new Date().toISOString(),
                });
        } finally {
            span.end();
        }
    }

    private getResponse(exception: T): Response<null> {
        if (exception instanceof AppException) {
            return {
                data: null,
                message: exception.message || exception.code,
                code: exception.code,
                statusCode: exception.statusCode,
            };
        }

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            const message = this.getMessage(exceptionResponse);

            return {
                data: null,
                message,
                code: this.getCode(exceptionResponse, message),
                statusCode: exception.getStatus(),
            };
        }

        return {
            data: null,
            message: 'Internal server error',
            code: code.internalServerError,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }

    private getMessage(exceptionResponse: string | object): string {
        if (typeof exceptionResponse === 'string')
            return exceptionResponse;

        if (Array.isArray((exceptionResponse as any).message))
            return (exceptionResponse as any).message.join(', ');

        return (exceptionResponse as any).message ?? 'Http exception';
    }

    private getCode(exceptionResponse: string | object, message: string): string {
        if (typeof exceptionResponse === 'string')
            return message;

        return (exceptionResponse as any).code ?? message;
    }

    private getTraceCode(exception: T): string {
        if (exception instanceof AppException)
            return exception.code;

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            const message = this.getMessage(exceptionResponse);

            return this.getCode(exceptionResponse, message);
        }

        return code.internalServerError;
    }
}
