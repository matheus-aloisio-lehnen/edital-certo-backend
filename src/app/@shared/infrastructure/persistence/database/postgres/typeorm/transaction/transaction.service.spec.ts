import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataSource, QueryRunner } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { ILogger } from "@shared/domain/port/logger.port";
import { IMetrics } from "@shared/domain/port/metrics.port";
import { ITracer } from "@shared/domain/port/tracer.port";
import { createLoggerMock, createMetricsMock, createMockQueryRunner, createTracerMock } from "@mock/tests.mock";
import { TransactionManager } from "@shared/infrastructure/persistence/database/postgres/typeorm/transaction/transaction.service";
import { txKey } from "@shared/domain/port/transaction.port";
import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";

describe('TransactionManager', () => {
    let transactionManager: TransactionManager;
    let dataSource: DataSource;
    let queryRunner: QueryRunner;
    let logger: ILogger;
    let metrics: IMetrics;
    let tracer: ITracer;
    let cls: ClsService;

    beforeEach(() => {
        queryRunner = createMockQueryRunner();

        dataSource = {
            createQueryRunner: vi.fn().mockReturnValue(queryRunner),
        } as unknown as DataSource;

        logger = createLoggerMock() as unknown as ILogger;
        metrics = createMetricsMock() as unknown as IMetrics;
        tracer = createTracerMock() as unknown as ITracer;

        cls = {
            run: vi.fn((cb) => cb()),
            set: vi.fn(),
            get: vi.fn(),
        } as unknown as ClsService;

        transactionManager = new TransactionManager(dataSource, logger, metrics, tracer, cls);
    });

    it('run should Scenario 1 — success: execute transaction successfully and commit', async () => {
        const resultValue = 'success_result';
        const fn = vi.fn().mockResolvedValue(resultValue);

        const result = await transactionManager.run(fn);
        const span = (tracer.start as any).mock.results[0].value;

        expect(result).toBe(resultValue);
        expect(dataSource.createQueryRunner).toHaveBeenCalled();
        expect(queryRunner.connect).toHaveBeenCalled();
        expect(queryRunner.startTransaction).toHaveBeenCalled();
        expect(queryRunner.commitTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
        expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();

        expect(cls.run).toHaveBeenCalled();
        expect(cls.set).toHaveBeenCalledWith(txKey, queryRunner);
        expect(metrics.increment).toHaveBeenCalledWith('transaction.success', undefined);
        expect(span.end).toHaveBeenCalled();
        expect(fn).toHaveBeenCalled();
    });

    it('run should Scenario 2 — error with AppException: rollback and rethrow error', async () => {
        const appError = new AppException('BUSINESS_ERROR', 400);
        const fn = vi.fn().mockRejectedValue(appError);

        await expect(transactionManager.run(fn)).rejects.toThrow(appError);
        const span = (tracer.start as any).mock.results[0].value;

        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
        expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
        expect(metrics.increment).toHaveBeenCalledWith('transaction.error', undefined);
        expect(span.recordException).toHaveBeenCalledWith(appError);
        expect(cls.set).toHaveBeenLastCalledWith(txKey, undefined);
        expect(span.end).toHaveBeenCalled();
    });

    it('run should Scenario 3 — generic error: rollback and throw AppException(500)', async () => {
        const genericError = new Error('Generic error');
        const fn = vi.fn().mockRejectedValue(genericError);

        try {
            await transactionManager.run(fn);
        } catch (error) {
            expect(error).toBeInstanceOf(AppException);
            expect((error as AppException).code).toBe(code.internalServerError);
            expect((error as AppException).statusCode).toBe(500);
        }

        const span = (tracer.start as any).mock.results[0].value;

        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
        expect(metrics.increment).toHaveBeenCalledWith('transaction.error', undefined);
        expect(span.recordException).toHaveBeenCalledWith(genericError);
        expect(cls.set).toHaveBeenLastCalledWith(txKey, undefined);
        expect(span.end).toHaveBeenCalled();
    });

    it('run should Scenario 4 — default context: use "transaction" as context name', async () => {
        const fn = vi.fn().mockResolvedValue('ok');

        await transactionManager.run(fn);

        expect(tracer.start).toHaveBeenCalledWith('transaction', undefined);
        expect(metrics.increment).toHaveBeenCalledWith('transaction.success', undefined);
    });

    it('run should Scenario 5 — custom context: use metadata.name in components', async () => {
        const fn = vi.fn().mockResolvedValue('ok');
        const metadata = { name: 'CreateProduct' };

        await transactionManager.run(fn, metadata);

        expect(tracer.start).toHaveBeenCalledWith('CreateProduct', undefined);
        expect(metrics.increment).toHaveBeenCalledWith('CreateProduct.success', undefined);
    });

    it('run should validate basic execution order', async () => {
        const callOrder: string[] = [];
        
        vi.spyOn(queryRunner, 'startTransaction').mockImplementation(async () => { callOrder.push('begin'); });
        const fn = vi.fn().mockImplementation(async () => { callOrder.push('fn'); });
        vi.spyOn(queryRunner, 'commitTransaction').mockImplementation(async () => { callOrder.push('commit'); });
        vi.spyOn(queryRunner, 'release').mockImplementation(async () => { callOrder.push('release'); });

        await transactionManager.run(fn);

        expect(callOrder).toEqual(['begin', 'fn', 'commit', 'release']);
    });

    it('run should ensure that tx is set in CLS before executing fn', async () => {
        let txInClsDuringFn: any = null;
        const fn = vi.fn().mockImplementation(async () => {
            txInClsDuringFn = (cls.set as any).mock.calls.find(call => call[0] === txKey)?.[1];
        });

        await transactionManager.run(fn);

        expect(txInClsDuringFn).toBe(queryRunner);
    });
});
