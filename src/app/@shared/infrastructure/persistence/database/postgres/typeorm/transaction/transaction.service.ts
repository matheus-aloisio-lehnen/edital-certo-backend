import { InjectDataSource } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { DataSource, QueryRunner } from "typeorm";

import { code } from "@shared/domain/constant/code.constant";
import { AppException } from "@shared/domain/exception/app.exception";
import { type ILogger, loggerPort } from "@shared/domain/port/logger.port";
import { type IMetrics, metricsPort } from "@shared/domain/port/metrics.port";
import { ITransactionManager, TransactionMetadata, txKey } from "@shared/domain/port/transaction.port";
import { type ITracer, tracerPort } from "@shared/domain/port/tracer.port";

@Injectable()
export class TransactionManager implements ITransactionManager {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        @Inject(loggerPort) private readonly logger: ILogger,
        @Inject(metricsPort) private readonly metrics: IMetrics,
        @Inject(tracerPort) private readonly tracer: ITracer,
        private readonly cls: ClsService,
    ) {}

    async run<T>(fn: () => Promise<T>, metadata?: TransactionMetadata): Promise<T> {
        const context = metadata?.name ?? "transaction";
        const span = this.tracer.start(context, metadata?.trace);
        const tx = await this.begin();

        return this.cls.run(async () => {
            this.cls.set(txKey, tx);

            try {
                const result = await fn();

                await this.commit(tx);
                this.metrics.increment(`${context}.success`, metadata?.metrics);

                return result;
            } catch (error) {
                await this.rollback(tx);
                this.metrics.increment(`${context}.error`, metadata?.metrics);

                if (error instanceof Error)
                    span.recordException(error);

                this.logger.write({
                    level: "error",
                    context,
                    message: {
                        code: error instanceof AppException ? error.code : code.internalServerError,
                        error,
                        data: metadata?.data,
                        trace: metadata?.trace,
                        metrics: metadata?.metrics,
                    },
                });

                if (error instanceof AppException)
                    throw error;

                throw new AppException(code.internalServerError, 500);
            } finally {
                this.cls.set(txKey, undefined);
                span.end();
            }
        });
    }

    private async begin(): Promise<QueryRunner> {
        const tx = this.dataSource.createQueryRunner();
        await tx.connect();
        await tx.startTransaction();
        return tx;
    }

    private async commit(tx: QueryRunner): Promise<void> {
        try {
            await tx.commitTransaction();
        } finally {
            await tx.release();
        }
    }

    private async rollback(tx: QueryRunner): Promise<void> {
        try {
            await tx.rollbackTransaction();
        } finally {
            await tx.release();
        }
    }
}
