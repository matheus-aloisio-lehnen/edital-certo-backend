# 📊 Observabilidade e Logs Estruturados (Service-Level Logging)

Este sistema implementa uma camada de observabilidade baseada no pacote nativo slog do Go, integrada ao framework Gin. O objetivo é gerar logs em formato JSON padronizado para ingestão automática via Grafana Loki, permitindo monitoramento em tempo real e análise de performance.

## 🛠️ Decisões Técnicas

* **Formato JSON**: Adotado para permitir que ferramentas de Log Aggregation (Loki/Promtail) realizem indexação automática. Facilita a criação de dashboards e alertas sem necessidade de Regex complexas.
* **Zero-Allocation Path**: O middleware foi desenhado para minimizar alocações. O uso de campos estruturados permite flexibilidade sem sacrificar a velocidade de resposta da API.
* **Separação de Camadas**:
    1. **Transporte**: Middleware captura o ciclo de vida completo da requisição HTTPServer (status, latência, IP).
    2. **Infraestrutura**: O módulo obs fornece o método Track para telemetria manual em qualquer ponto da aplicação (Services, Repositories).
* **Observabilidade Identificada**: O log extrai automaticamente IDs de contexto (User/Tenant) se disponíveis, unificando o rastro de auditoria técnica.

---

## 🚀 Exemplos de Uso e Saída (Output)

Abaixo, os padrões de chamada e o respectivo formato JSON gerado no arquivo logs.json.

### 1️⃣ Log de Tráfego HTTPServer (Automático via Middleware)
**Cenário**: Monitoramento padrão de entrada e saída.  
**Uso**: Automático via `middleware.Logger()` no router.

{
    "time": "2026-02-02T11:15:00Z",
    "level": "INFO",
    "mod": "transport",
    "method": "GET /v1/resource",
    "kind": "http_in",
    "msg": "http_request_completed",
    "data": {
        "status": 200,
        "latency": "15.4ms",
        "user_id": 450,
        "tenant_id": 12,
        "ip": "192.168.1.10"
    }
}

### 2️⃣ Log de Lógica de Negócio (Manual)
**Cenário**: Rastreio de eventos internos importantes.  
**Uso**: `obs.Track(obs.LevelInfo, "catalog", "UpdateStock", obs.KindLogic, "estoque atualizado", map[string]any{"sku": "ABC-123", "qtd": 50})`

{
    "time": "2026-02-02T11:15:05Z",
    "level": "INFO",
    "mod": "catalog",
    "method": "UpdateStock",
    "kind": "logic",
    "msg": "estoque atualizado",
    "data": {
        "sku": "ABC-123",
        "qtd": 50
    }
}

### 3️⃣ Log de Integração Externa (Outbound)
**Cenário**: Falhas ou sucessos em chamadas para APIs externas.  
**Uso**: `obs.Track(obs.LevelError, "billing", "StripeCharge", obs.KindHttpOut, "falha na comunicação", map[string]any{"code": "timeout", "attempt": 3})`

{
    "time": "2026-02-02T11:15:10Z",
    "level": "ERROR",
    "mod": "billing",
    "method": "StripeCharge",
    "kind": "http_out",
    "msg": "falha na comunicação",
    "data": {
        "code": "timeout",
        "attempt": 3
    }
}

---

## 📦 Infraestrutura e Rotação (Lumberjack)

O gerenciamento de escrita física é feito pela biblioteca Lumberjack para garantir a saúde do storage no Easypanel.

1.  **Rotação (Max Size)**: O arquivo `logs.json` sofre rotação ao atingir 50MB.
2.  **Retenção (Max Age)**: O sistema mantém arquivos locais por 7 dias. O histórico total reside no Loki.
3.  **Compressão**: Arquivos antigos são compactados (.gz) automaticamente.

---

## 🗼 Integração Grafana Loki via Easypanel

Para que os logs cheguem ao Grafana, o Promtail deve ser configurado como um serviço auxiliar (Sidecar).

1.  **Volume Compartilhado**: No Easypanel, a API e o Promtail devem compartilhar o mesmo volume montado em `/var/log/app`.
2.  **Coleta**: O Promtail monitora o arquivo `/var/log/app/logs.json`.
3.  **Parsing**: O pipeline do Promtail extrai as labels (level, mod, kind) diretamente do JSON para indexação.

### Configuração Sugerida (Promtail config.yaml)

scrape_configs:
- job_name: api-logs
  static_configs:
    - targets: [localhost]
      labels:
      app: "edital-certo-api"
      __path__: /var/log/app/logs.json
      pipeline_stages:
    - json:
      expressions:
      level: level
      mod: mod
      kind: kind
    - labels:
      level:
      mod:
      kind:

---

### 🔍 Exemplos de Consultas (LogQL)

* **Filtrar erros de um Tenant específico**: `{app="api"} | json | level="ERROR" | tenant_id=12`
* **Identificar latência acima de 500ms**: `{app="api"} | json | latency > 500ms`
* **Rastrear fluxo de um usuário**: `{app="api"} | json | user_id=450`

---

### 💡 Dica de Troubleshooting
Ao usar o seletor `| json` no Grafana, todos os campos internos tornam-se filtros clicáveis, permitindo isolar problemas de infraestrutura em segundos.