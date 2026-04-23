import { type MetricLabels } from "@shared/domain/port/metrics.port";
import { type TraceAttributes } from "@shared/domain/port/tracer.port";

export const txKey = Symbol("tx");

export const transactionPort = Symbol("TRANSACTION_PORT");

export type TransactionContext = {
    tx: unknown;
};

export type TransactionMetadata = {
    name: string;
    data?: Record<string, unknown>;
    trace?: TraceAttributes;
    metrics?: MetricLabels;
};

export interface ITransactionManager {
    run<T>(fn: () => Promise<T>, metadata?: TransactionMetadata): Promise<T>;
}
