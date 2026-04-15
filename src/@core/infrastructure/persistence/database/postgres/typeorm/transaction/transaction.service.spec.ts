import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryRunner } from 'typeorm';
import { TransactionManager } from './transaction.service';
import { createMockQueryRunner, createQueryRunnerMock, mockDataSource } from '@mock/tests.mock';
import { Logger } from "@observability/logger/logger.service";
import { Metrics } from "@observability/metrics/metrics.service";
import { Tracer } from "@observability/tracer/tracer.service";
import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";

describe('TransactionManager', () => {
    let manager: TransactionManager;
    let queryRunner: QueryRunner;
    let logger: Logger;
    let metrics: Metrics;
    let tracer: Tracer;

    const mockSpan = {
        recordException: vi.fn(),
        end: vi.fn(),
    };

    beforeEach(() => {
        queryRunner = createMockQueryRunner();
        createQueryRunnerMock.mockReturnValue(queryRunner);

        logger = {
            write: vi.fn(),
        } as unknown as Logger;

        metrics = {
            increment: vi.fn(),
        } as unknown as Metrics;

        tracer = {
            start: vi.fn().mockReturnValue(mockSpan),
        } as unknown as Tracer;

        manager = new TransactionManager(mockDataSource, logger, metrics, tracer);
        vi.clearAllMocks();
    });

    it('should be defined', () => {
        expect(manager).toBeDefined();
    });

    describe('run', () => {
        it('should commit transaction when execution succeeds', async () => {
            const result = 'success';
            const fn = vi.fn().mockResolvedValue(result);
            const metadata = { name: 'test-context', metrics: { label: 'value' } };

            const output = await manager.run(fn, metadata);

            expect(output).toBe(result);
            expect(queryRunner.connect).toHaveBeenCalledOnce();
            expect(queryRunner.startTransaction).toHaveBeenCalledOnce();
            expect(fn).toHaveBeenCalledOnce();
            expect(queryRunner.commitTransaction).toHaveBeenCalledOnce();
            expect(queryRunner.release).toHaveBeenCalledOnce();
            expect(metrics.increment).toHaveBeenCalledWith('test-context.success', metadata.metrics);
            expect(tracer.start).toHaveBeenCalledWith('test-context', undefined);
            expect(mockSpan.end).toHaveBeenCalledOnce();
        });

        it('should rollback and throw AppException when execution fails with AppException', async () => {
            const error = new AppException(code.badRequest, 400, 'Bad Request');
            const fn = vi.fn().mockRejectedValue(error);
            const metadata = { name: 'test-context', data: { key: 'val' } };

            await expect(manager.run(fn, metadata)).rejects.toThrow(AppException);

            expect(queryRunner.rollbackTransaction).toHaveBeenCalledOnce();
            expect(queryRunner.release).toHaveBeenCalledOnce();
            expect(metrics.increment).toHaveBeenCalledWith('test-context.error', undefined);
            expect(mockSpan.recordException).toHaveBeenCalledWith(error);
            expect(logger.write).toHaveBeenCalledWith(expect.objectContaining({
                level: 'error',
                context: 'test-context',
                message: expect.objectContaining({
                    code: code.badRequest,
                    error,
                }),
            }));
            expect(mockSpan.end).toHaveBeenCalledOnce();
        });

        it('should rollback and throw generic AppException when execution fails with generic Error', async () => {
            const error = new Error('Generic Error');
            const fn = vi.fn().mockRejectedValue(error);

            await expect(manager.run(fn)).rejects.toThrow(AppException);

            expect(queryRunner.rollbackTransaction).toHaveBeenCalledOnce();
            expect(queryRunner.release).toHaveBeenCalledOnce();
            expect(metrics.increment).toHaveBeenCalledWith('transaction.error', undefined);
            expect(logger.write).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.objectContaining({
                    code: code.internalServerError,
                    error,
                }),
            }));
        });
    });
});
