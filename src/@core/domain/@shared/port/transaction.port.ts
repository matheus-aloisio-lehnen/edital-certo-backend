import { TraceAttributes } from "@domain/@shared/port/tracer.port";
import { MetricLabels } from "@domain/@shared/port/metrics.port";

export const transactionPort = Symbol('TRANSACTION_PORT');

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