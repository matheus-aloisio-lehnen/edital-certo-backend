export const tracerPort = Symbol("TRACER_PORT");

export type TraceAttributes = Record<string, string | number | boolean>;

export interface ITraceSpan {
    end(): void;
    setAttributes(attributes: TraceAttributes): void;
    recordException(error: Error): void;
}

export interface ITracer {
    start(name: string, attributes?: TraceAttributes): ITraceSpan;
}
