import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";

describe('AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter<unknown>;
    let status: ReturnType<typeof vi.fn>;
    let json: ReturnType<typeof vi.fn>;
    let host: ArgumentsHost;
    let logger: { write: ReturnType<typeof vi.fn> };
    let metrics: { increment: ReturnType<typeof vi.fn> };
    let end: ReturnType<typeof vi.fn>;
    let tracer: { start: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        json = vi.fn();
        status = vi.fn(() => ({ json }));
        logger = { write: vi.fn() };
        metrics = { increment: vi.fn() };
        end = vi.fn();
        tracer = { start: vi.fn(() => ({ end })) };

        host = {
            switchToHttp: () => ({
                getRequest: () => ({ method: 'GET', url: '/quota-usage' }),
                getResponse: () => ({ status }),
            }),
        } as ArgumentsHost;

        filter = new AllExceptionsFilter(logger as any, metrics as any, tracer as any);
    });

    it('should be defined', () => {
        expect(filter).toBeDefined();
    });

    it('returns the mapped response for AppException', () => {
        filter.catch(new AppException(
            code.internalServerError,
            HttpStatus.BAD_REQUEST,
            'System unavailable',
        ), host);

        expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(json).toHaveBeenCalledWith(expect.objectContaining({
            data: null,
            message: 'System unavailable',
            code: code.internalServerError,
            statusCode: HttpStatus.BAD_REQUEST,
            path: '/quota-usage',
        }));
        expect(metrics.increment).toHaveBeenCalledWith('http_exceptions_total', {
            code: code.internalServerError,
            context: 'AllExceptionsFilter',
            statusCode: String(HttpStatus.BAD_REQUEST),
        });
        expect(logger.write).toHaveBeenCalledWith({
            level: 'error',
            context: 'AllExceptionsFilter',
            message: {
                code: code.internalServerError,
                message: 'System unavailable',
                method: 'GET',
                path: '/quota-usage',
                statusCode: HttpStatus.BAD_REQUEST,
            },
        });
        expect(tracer.start).toHaveBeenCalledWith('http_exception_filter', {
            code: code.internalServerError,
            method: 'GET',
            path: '/quota-usage',
        });
        expect(end).toHaveBeenCalled();
    });

    it('returns the mapped response for HttpException', () => {
        filter.catch(new HttpException({
            code: 'VALIDATION_ERROR',
            message: 'Invalid payload',
        }, HttpStatus.UNPROCESSABLE_ENTITY), host);

        expect(status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(json).toHaveBeenCalledWith(expect.objectContaining({
            data: null,
            message: 'Invalid payload',
            code: 'VALIDATION_ERROR',
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            path: '/quota-usage',
        }));
        expect(tracer.start).toHaveBeenCalled();
    });

    it('returns the default response for unexpected errors', () => {
        filter.catch(new Error('boom'), host);

        expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(json).toHaveBeenCalledWith(expect.objectContaining({
            data: null,
            message: 'Internal server error',
            code: code.internalServerError,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            path: '/quota-usage',
        }));
    });
});
