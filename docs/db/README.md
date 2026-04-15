# Banco de Dados

Este documento descreve o schema atual definido em [schema.dbml](/home/matheus/dev/cuidatoria/edital-certo/backend/docs/db/schema.dbml:1). O módulo de `core analysis` ainda não está refletido nesse arquivo, então ele fica fora desta documentação por enquanto.

## Visão Geral

O banco está organizado, hoje, em quatro blocos principais:

1. `product`
2. `identity`
3. `billing`
4. `notifications`

Além disso, o modelo usa soft delete em praticamente todas as tabelas principais via `deleted_at`.

## 1. Product

Esse bloco define catálogo, preços, descontos e regras de feature por plano.

### `plan`

Tabela base dos planos comerciais.

- `key`: identificador estável do plano (`FREE`, `START`, `PRO`, `TEAMS`)
- `name`: nome exibido
- `is_active`: controla disponibilidade do plano

Relacionamentos:

- `plan -> feature`
- `plan -> price`
- `plan -> tenant`
- `plan -> subscription`
- `plan -> subscription_change`

### `feature`

Feature habilitada por plano.

- pertence a um `plan`
- possui `key` funcional, `name` e `order`
- pode ser oculta com `hidden`
- pode ser ativada/desativada com `is_active`
- suporta quota com:
  - `has_quota`
  - `quota`
  - `quota_renewal_cycle`

Restrições importantes:

- `(plan_id, key)` único
- `(plan_id, order)` único

### `price`

Preço comercial de um plano.

- pertence a um `plan`
- `key` identifica a combinação comercial
- `currency`: `BRL`, `USD`, `EUR`
- `billing_cycle`: `MONTHLY`, `YEARLY`
- `value`: valor base em centavos
- `is_active`: controla qual preço está disponível

Observação:

- o schema indica a regra de haver apenas um registro ativo por combinação comercial, mas a garantia final disso ainda depende da aplicação e/ou da camada de persistência.

### `discount`

Desconto aplicado a um `price`.

- pertence a um `price`
- `type`: `PERCENT` ou `FIXED`
- `value`: percentual inteiro ou valor fixo em centavos
- `strategy`: `ONCE`, `REPEATING`, `FOREVER`
- `cycle`: obrigatório quando a estratégia for recorrente
- `starts_at` e `ends_at`: janela de vigência
- campos externos:
  - `external_coupon_id`
  - `external_promotion_code_id`

Índices importantes:

- `key` único
- `(price_id)`
- `(price_id, is_active)`

## 2. Identity

Esse bloco representa a estrutura de conta, usuários, sessões e controle de uso de features.

### `tenant`

Organização principal do sistema.

- vinculada a um `plan`
- armazena identificação e dados cadastrais:
  - `name`
  - `phone`
  - `document`
  - `sector`
  - `city`
  - `state`
  - `country_code`

### `user`

Usuário pertencente a um tenant.

- pertence a um `tenant`
- `email` é único
- `role` indica o papel (`owner`, `member`)
- `lang_code` define idioma preferido

Índices relevantes:

- `email`
- `(tenant_id, email)` único

### `session`

Sessão autenticada com refresh token.

- pertence a `user`
- pertence a `tenant`
- controla:
  - `refresh_token`
  - `status`
  - `ip`
  - `user_agent`
  - `device`
  - `expires_at`

É a base para controle de sessão, rotação de refresh token e rastreabilidade de dispositivos.

### `tenant_feature`

Override por tenant para ativar ou desativar feature independentemente do plano base.

- liga `tenant` e `feature`
- `is_active` define se a feature está liberada para aquele tenant

Restrição:

- `(tenant_id, feature_id)` único

### `feature_usage`

Acumulado operacional por período.

- pertence a `tenant`
- pertence a `feature`
- `period` representa a janela do uso (`YYYY-MM`, `YYYY`, `STATIC`)
- `amount` armazena o acumulado

Restrição:

- `(tenant_id, feature_id, period)` único

### `feature_usage_event`

Histórico detalhado do consumo de feature.

- pertence a `tenant`
- pode referenciar `user`
- pertence a `feature`
- `amount` registra o consumo
- `period` identifica a janela de consolidação
- `used_at` marca quando o evento ocorreu

Essa tabela é o histórico fino; `feature_usage` é a visão consolidada.

## 3. Billing

Esse bloco representa assinatura e histórico de alterações de assinatura.

### `subscription`

Assinatura atual do tenant.

- `tenant_id` único: um tenant tem no máximo uma assinatura atual
- aponta para:
  - `plan`
  - `price`
- replica dados comerciais relevantes no momento da assinatura:
  - `plan_name`
  - `plan_key`
  - `billing_cycle`
  - `currency`
  - `unit_price`
  - `total_price`
  - `total_with_discount`

Também armazena estado operacional e integração externa:

- `invoice_email`
- `status`
- `external_customer_id`
- `external_subscription_id`
- `billing_day`
- `next_due_date`
- `seats`
- `overdue_invoice_id`
- `overdue_since`
- `block_at`
- `starts_at`
- `ends_at`
- `cancelled_at`

### `subscription_change`

Histórico de mudança contratual.

Registra eventos como:

- `ONBOARDING`
- `UPGRADE`
- `DOWNGRADE`
- `SEAT_CHANGE`
- `CANCEL`
- `WINBACK`
- `DISCOUNT_APPLIED`
- `DISCOUNT_EXPIRED`
- `RENEWAL`

Além do tipo, mantém snapshot comparativo entre o estado anterior e o novo:

- plano de origem e destino
- preço de origem e destino
- desconto de origem e destino
- billing cycle
- currency
- seats
- valores financeiros

Isso transforma a tabela em trilha de auditoria do ciclo comercial da assinatura.

## 4. Notifications

Esse bloco concentra avisos globais e histórico de leitura.

### `changelog`

Registro versionado de novidades do sistema.

- `version`
- `title`
- `html`
- `is_published`
- `published_at`

Serve para release notes e comunicação de mudanças de produto.

### `broadcast`

Mensagem centralizada do sistema.

- `type`
- `severity`
- `priority`
- `content`
- `is_active`
- `expires_at`

Serve para avisos operacionais, modais, banners ou comunicações globais.

### `user_broadcast_ack`

Rastreio de leitura individual de broadcasts.

- pertence a `user`
- pertence a `broadcast`
- `read_at` marca a leitura

Restrição:

- `(user_id, broadcast_id)` único

## Relacionamentos Principais

Resumo do grafo atual:

- `plan` 1:N `feature`
- `plan` 1:N `price`
- `price` 1:N `discount`
- `plan` 1:N `tenant`
- `tenant` 1:N `user`
- `tenant` 1:1 `subscription`
- `tenant` N:N `feature` via `tenant_feature`
- `tenant` + `feature` -> uso consolidado em `feature_usage`
- `tenant` + `user` + `feature` -> histórico em `feature_usage_event`
- `user` 1:N `session`
- `broadcast` N:N `user` via `user_broadcast_ack`

## Observações de Modelagem

- O schema usa soft delete em quase todo o domínio operacional.
- O catálogo de produto está separado em `plan`, `feature`, `price` e `discount`.
- O uso de feature foi dividido entre tabela consolidada (`feature_usage`) e tabela de eventos (`feature_usage_event`).
- A assinatura replica parte dos dados comerciais para preservar o estado histórico mesmo se o catálogo mudar depois.
- `subscription_change` é a trilha de auditoria da vida comercial da assinatura.
