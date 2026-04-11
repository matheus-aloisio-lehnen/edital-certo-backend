import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataSource, QueryRunner } from 'typeorm';
import { TransactionManager } from './transaction.adapter';

const createQueryRunner = vi.fn();

const mockDataSource = {
    createQueryRunner: createQueryRunner,
} as unknown as DataSource;

const createMockQueryRunner = (): QueryRunner => ({
    connect: vi.fn(),
    startTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    rollbackTransaction: vi.fn(),
    release: vi.fn(),
} as unknown as QueryRunner);

describe('TransactionManager', () => {
    let manager: TransactionManager;
    let queryRunner: QueryRunner;

    beforeEach(() => {
        queryRunner = createMockQueryRunner();
        createQueryRunner.mockReturnValue(queryRunner);
        manager = new TransactionManager(mockDataSource);
    });

    it('should be defined', () => {
        expect(manager).toBeDefined();
    });

    describe('begin', () => {
        it('connects, starts transaction and returns context with queryRunner', async () => {
            const ctx = await manager.begin();

            expect(queryRunner.connect).toHaveBeenCalledOnce();
            expect(queryRunner.startTransaction).toHaveBeenCalledOnce();
            expect(ctx.tx).toBe(queryRunner);
        });
    });

    describe('commit', () => {
        it('commits and releases the queryRunner', async () => {
            const ctx = await manager.begin();
            await manager.commit(ctx);

            expect(queryRunner.commitTransaction).toHaveBeenCalledOnce();
            expect(queryRunner.release).toHaveBeenCalledOnce();
        });
    });

    describe('rollback', () => {
        it('rolls back and releases the queryRunner', async () => {
            const ctx = await manager.begin();
            await manager.rollback(ctx);

            expect(queryRunner.rollbackTransaction).toHaveBeenCalledOnce();
            expect(queryRunner.release).toHaveBeenCalledOnce();
        });
    });
});
