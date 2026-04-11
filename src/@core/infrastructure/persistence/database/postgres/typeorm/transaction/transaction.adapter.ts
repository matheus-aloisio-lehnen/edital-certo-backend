import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { ITransaction, TransactionContext } from '@domain/@shared/ports/transaction.port';

@Injectable()
export class TransactionManager implements ITransaction {

    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    async begin(): Promise<TransactionContext> {
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return { tx: queryRunner };
    }

    async commit(ctx: TransactionContext): Promise<void> {
        const queryRunner = ctx.tx as QueryRunner;
        await queryRunner.commitTransaction();
        await queryRunner.release();
    }

    async rollback(ctx: TransactionContext): Promise<void> {
        const queryRunner = ctx.tx as QueryRunner;
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
    }
}
