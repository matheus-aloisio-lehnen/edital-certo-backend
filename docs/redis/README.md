# DOCUMENTACAO DE ESTADO: REDIS (PRIMARY DATA & TRACKING)

Este documento descreve como o Redis e utilizado como banco de dados primario para dados volateis e de alta performance, substituindo tabelas do Postgres para reduzir overhead.

---

## 🛡️ 1. CONFIGURACAO DE PERSISTENCIA (ANTI-SPOF)
Para garantir que dados de Marketing e Cotas de Uso nao sejam perdidos em restarts da VM, a persistencia RDB+AOF e obrigatoria.

### 1.1 AOF (Append Only File)
- **Modo:** `appendonly yes`
- **Sincronizacao:** `appendfsync everysec`
- **Objetivo:** Logar cada escrita em disco a cada segundo. Perda maxima de 1s de dados em caso de falha catastrofica.

### 1.2 RDB (Snapshots)
- **Settings:** `save 900 1` (Snapshot se houver 1 mudança em 15min).
- **Objetivo:** Backup binario compacto para boot rapido do servico.

---

## 📊 2. ESTRUTURAS DE DADOS ("TABELAS")

### 2.1 USAGE LIMITS (Cotas de IA)
Controle em tempo real para travar execucoes excedentes.
- **Contador (String)**
    - **Chave:** `usage:{tenant_id}:{resource_key}`
    - **Operacao:** `INCRBY` a cada execucao de IA.
    - **TTL:** Sem TTL (Resetado via API no inicio do ciclo de faturamento).

### 2.2 JOB STATUS (Tracking CID)
Acompanhamento para Polling do Frontend.
- **Status (Hash)**
    - **Chave:** `job:{cid}`
    - **Campos:** `status` (processing|completed|error), `progress`, `error_msg`.
    - **TTL:** 2 horas (Dados efemeros).

---

## ⚠️ 3. POLITICA DE MEMORIA (EVICTION)
Para evitar que o Redis apague dados de faturamento (QuotaUsage) para dar lugar a dados de polling (Jobs):

- **Policy:** `maxmemory-policy volatile-lru`
- **Comportamento:** O Redis so apagara chaves que possuem TTL definido se a memoria atingir o limite. Chaves de Alerta e QuotaUsage (sem TTL) ficam protegidas.
