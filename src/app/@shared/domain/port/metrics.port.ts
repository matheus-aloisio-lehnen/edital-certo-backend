export const metricsPort = Symbol("METRICS_PORT");

export type MetricLabels = Record<string, string>;

export interface IMetrics {
    increment(name: string, labels?: MetricLabels): void;
    gauge(name: string, value: number, labels?: MetricLabels): void;
    observe(name: string, value: number, labels?: MetricLabels): void;
}
