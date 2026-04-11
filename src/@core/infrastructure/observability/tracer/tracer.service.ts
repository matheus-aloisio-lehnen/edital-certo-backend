import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Span, trace, Tracer as OpenTelemetryTracer } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { AppConfig, appConfig } from "@cfg/app.config";
import { ITracer, TraceAttributes } from "@domain/@shared/ports/trace.port";

@Injectable()
export class Tracer implements ITracer, OnModuleDestroy {

    private readonly tracerProvider: NodeTracerProvider;
    private readonly tracer: OpenTelemetryTracer;
    private readonly enabled: boolean;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.enabled = this.configService.get<AppConfig>(appConfig.KEY)?.observability.trace === true;

        if (!this.enabled) {
            this.tracerProvider = new NodeTracerProvider();
            this.tracer = trace.getTracer('backend');
            return;
        }

        const exporter = new OTLPTraceExporter();
        const processor = new BatchSpanProcessor(exporter);
        const resource = resourceFromAttributes({
            'service.name': 'backend',
        });

        this.tracerProvider = new NodeTracerProvider({
            resource,
            spanProcessors: [ processor ],
        });
        this.tracerProvider.register();
        this.tracer = this.tracerProvider.getTracer('backend');
    }

    start(name: string, attributes?: TraceAttributes): Span {
        const span = this.tracer.startSpan(name);

        if (!this.enabled)
            return span;

        if (attributes)
            span.setAttributes(attributes);

        return span;
    }

    async onModuleDestroy(): Promise<void> {
        await this.tracerProvider.shutdown();
    }
}
