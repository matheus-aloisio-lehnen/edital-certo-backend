# Banco de Dados

Documentação reduzida do catálogo comercial atual.

## Billing

### `plan`

Plano comercial base.

- `id`: identificador interno
- `name`: nome exibido na UI
- `is_active`: controla disponibilidade
- `external_plan_id`: referência no gateway

Relacionamentos:

- `plan -> price`

### `price`

Preço de um plano.

- pertence a um `plan`
- `billing_cycle`: `MONTHLY` ou `YEARLY`
- `value`: valor em centavos, sempre BRL
- `is_active`: controla disponibilidade
- `external_price_id`: referência no gateway

### `discount`

Desconto aplicado a um `price`.

- pertence a um `price`
- `type`: `PERCENT` ou `FIXED`
- `value`: percentual inteiro ou valor fixo em centavos
- `duration`: `ONCE`, `REPEATING` ou `FOREVER`
- `campaign_starts_at` e `campaign_ends_at`: janela de vigência
- `external_discount_id`: referência no gateway

## Observação

Este README reflete apenas a modelagem comercial ainda ativa no backend.
