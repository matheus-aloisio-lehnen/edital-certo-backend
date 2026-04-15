# Observabilidade e Telemetria

Este backend centraliza logs, métricas e traces em uma camada própria de observabilidade baseada em OpenTelemetry. A aplicação emite telemetria via OTLP HTTP e o OpenTelemetry Collector fica responsável por receber, processar e encaminhar os sinais para as ferramentas de análise.

## Decisões Técnicas

- Logs, métricas e traces são serviços separados:
  - [Logger](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/observability/logger/logger.service.ts:1)
  - [Metrics](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/observability/metrics/metrics.service.ts:1)
  - [Tracer](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/observability/tracer/tracer.service.ts:1)
- O wiring fica no [ObservabilityModule](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/observability/module/observability.module.ts:1), exportando os ports de observabilidade para o resto da aplicação.
- Cada sinal pode ser ligado ou desligado por configuração:
  - `OBSERVABILITY_LOGS=true`
  - `OBSERVABILITY_METRIC=true`
  - `OBSERVABILITY_TRACE=true`
- O Nest usa o `Logger` customizado como logger da aplicação quando `OBSERVABILITY_LOGS=true`, via [main.ts](/home/matheus/dev/cuidatoria/edital-certo/backend/src/main.ts:1).

## Como Funciona

### 1. Logs

O [Logger](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/observability/logger/logger.service.ts:1):

- estende `ConsoleLogger` do Nest
- mantém saída JSON no console
- exporta logs para OTLP com `OTLPLogExporter`
- mapeia os níveis do projeto para `SeverityNumber`
- anexa `context` e `stack` quando existirem

Fluxo:

1. A aplicação chama `logger.log`, `logger.warn`, `logger.error`, `logger.debug` ou `logger.verbose`.
2. O Nest escreve o log no stdout em JSON.
3. O mesmo evento é emitido para o provider de logs do OpenTelemetry.
4. O Collector recebe via OTLP HTTP e encaminha para o backend de logs.

### 2. Métricas

O [Metrics](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/observability/metrics/metrics.service.ts:1):

- usa `MeterProvider`
- exporta com `OTLPMetricExporter`
- mantém cache de instrumentos por nome
- expõe três operações:
  - `increment`
  - `gauge`
  - `observe`

Fluxo:

1. O código incrementa um contador, registra uma gauge ou observa um histograma.
2. O `PeriodicExportingMetricReader` faz o flush periódico.
3. O Collector recebe as métricas.
4. O backend de métricas armazena e disponibiliza para dashboards e alertas.

### 3. Traces

O [Tracer](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/observability/tracer/tracer.service.ts:1):

- usa `NodeTracerProvider`
- exporta spans com `OTLPTraceExporter`
- registra `service.name = backend`
- expõe um wrapper simples com:
  - `start`
  - `setAttributes`
  - `recordException`
  - `end`

Fluxo:

1. Um serviço inicia um span.
2. Atributos e exceções são anexados durante o fluxo.
3. O span é encerrado.
4. O Collector recebe o trace e envia para o backend de tracing.

## Uso na Aplicação

### Logger

```ts
this.logger.log('event published', EventBusService.name);
this.logger.error(error, error.stack, AllExceptionsFilter.name);
```

### Metrics

```ts
this.metrics.increment('event_published_total', { event: eventName });
this.metrics.observe('http_request_duration_ms', duration, { route, method });
```

### Tracer

```ts
const span = this.tracer.start('event.publish', { event: eventName });

try {
  // regra
} catch (error) {
  span.recordException(error as Error);
  throw error;
} finally {
  span.end();
}
```

## Arquitetura de Containers

O desenho esperado da stack é este:

1. `backend`
2. `otel-collector`
3. backend de logs
4. backend de métricas
5. backend de traces
6. `grafana`

Um arranjo típico:

- `backend`: aplicaçao NestJS emitindo OTLP HTTP
- `otel-collector`: ponto único de ingestão, roteamento e processamento
- `loki`: armazenamento e consulta de logs
- `prometheus`: armazenamento e consulta de métricas
- `tempo`: armazenamento e consulta de traces
- `grafana`: visualização unificada

Fluxo esperado:

```text
backend
  -> OTLP HTTP logs
  -> OTLP HTTP metrics
  -> OTLP HTTP traces

otel-collector
  -> Loki
  -> Prometheus
  -> Tempo

Grafana
  -> consulta Loki, Prometheus e Tempo
```

## Papel do OpenTelemetry Collector

O Collector não é só transporte. Ele centraliza a observabilidade da stack.

Responsabilidades esperadas:

- receber OTLP do backend
- aplicar processors de batch
- enriquecer ou normalizar atributos, se necessário
- desacoplar a aplicação dos vendors finais
- permitir troca de backend sem alterar o código da aplicação

Isso evita que o backend conheça diretamente Loki, Prometheus ou Tempo.

## Configuração

As flags de observabilidade vêm de [app.config.ts](/home/matheus/dev/cuidatoria/edital-certo/backend/src/config/cfg/app.config.ts:1):

```env
OBSERVABILITY_LOGS=true
OBSERVABILITY_METRIC=true
OBSERVABILITY_TRACE=true
```

Com isso:

- logs passam a ser exportados pelo `Logger`
- métricas passam a ser registradas pelo `Metrics`
- traces passam a ser exportados pelo `Tracer`

Se uma flag estiver desligada, o sinal correspondente não é exportado.

## Pontos de Instrumentação Atuais

Hoje a observabilidade já aparece em pontos como:

- [EventBusService](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/event/bus/event-bus.service.ts:1)
- [AllExceptionsFilter](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/transport/http/filters/all-exceptions.filter.ts:1)
- [Email service](/home/matheus/dev/cuidatoria/edital-certo/backend/src/@core/infrastructure/transport/email/email.service.ts:1)

Esses pontos são bons candidatos para:

- correlação de erro
- latência
- throughput
- rastreabilidade de integrações

## Diretriz

O backend não deve conhecer a ferramenta final de observabilidade. Ele só emite sinais via OpenTelemetry. O Collector faz a ponte entre a aplicação e a stack operacional.
