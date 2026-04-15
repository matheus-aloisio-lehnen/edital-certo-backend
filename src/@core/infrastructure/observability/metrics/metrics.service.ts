import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Counter, Gauge, Histogram, Meter } from "@opentelemetry/api";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { AppConfig, appConfig } from "@cfg/app.config";
import { IMetrics, MetricLabels } from "@domain/@shared/port/metrics.port";

@Injectable()
export class Metrics implements IMetrics, OnModuleDestroy {

    private readonly meterProvider: MeterProvider;
    private readonly meter: Meter;
    private readonly counters = new Map<string, Counter<any>>();
    private readonly gauges = new Map<string, Gauge<any>>();
    private readonly histograms = new Map<string, Histogram<any>>();

    constructor(
        private readonly configService: ConfigService,
    ) {
        const exporter = new OTLPMetricExporter();
        const reader = new PeriodicExportingMetricReader({ exporter });

        this.meterProvider = new MeterProvider({ readers: [ reader ] });
        this.meter = this.meterProvider.getMeter('backend');
    }

    increment(name: string, labels?: MetricLabels): void {
        if (!this.isEnabled())
            return;

        this.getCounter(name).add(1, labels);
    }

    gauge(name: string, value: number, labels?: MetricLabels): void {
        if (!this.isEnabled())
            return;

        this.getGauge(name).record(value, labels);
    }

    observe(name: string, value: number, labels?: MetricLabels): void {
        if (!this.isEnabled())
            return;

        this.getHistogram(name).record(value, labels);
    }

    private isEnabled(): boolean {
        return this.configService.get<AppConfig>(appConfig.KEY)?.observability.metric === true;
    }

    private getCounter(name: string): Counter<any> {
        const counter = this.counters.get(name);

        if (counter)
            return counter;

        const metric = this.meter.createCounter(name);
        this.counters.set(name, metric);
        return metric;
    }

    private getGauge(name: string): Gauge<any> {
        const gauge = this.gauges.get(name);

        if (gauge)
            return gauge;

        const metric = this.meter.createGauge(name);
        this.gauges.set(name, metric);
        return metric;
    }

    private getHistogram(name: string): Histogram<any> {
        const histogram = this.histograms.get(name);

        if (histogram)
            return histogram;

        const metric = this.meter.createHistogram(name);
        this.histograms.set(name, metric);
        return metric;
    }

    async onModuleDestroy(): Promise<void> {
        await this.meterProvider.shutdown();
    }

}
