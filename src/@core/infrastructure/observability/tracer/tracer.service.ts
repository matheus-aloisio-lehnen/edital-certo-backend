import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Span, trace, Tracer as OpenTelemetryTracer } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { AppConfig, appConfig } from "@cfg/app.config";
import { ITracer, ITraceSpan, TraceAttributes } from "@domain/@shared/port/tracer.port";

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

    start(name: string, attributes?: TraceAttributes): ITraceSpan {
        const span = this.tracer.startSpan(name);

        if (!this.enabled)
            return this.toTraceSpan(span);

        if (attributes)
            span.setAttributes(attributes);

        return this.toTraceSpan(span);
    }

    private toTraceSpan(span: Span): ITraceSpan {
        return {
            end: () => span.end(),
            setAttributes: (attributes: TraceAttributes) => span.setAttributes(attributes),
            recordException: (error: Error) => span.recordException(error),
        };
    }

    async onModuleDestroy(): Promise<void> {
        await this.tracerProvider.shutdown();
    }
}
