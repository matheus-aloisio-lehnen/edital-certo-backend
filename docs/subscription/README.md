# 🚀 Billing & Subscription System (Asaas Integration)

Este módulo gerencia o ciclo de vida financeiro e operacional dos Tenants utilizando o Asaas como gateway de pagamento.  
A arquitetura garante integridade financeira, rastreabilidade de MRR e redução de escopo PCI no fluxo de cartão de crédito.

A integração possui dois fluxos técnicos distintos:

- 💳 Cartão de Crédito (Assíncrono via Checkout)
- 🧾 Boleto (Síncrono via Subscription API)

Ambos convergem para o mesmo modelo de domínio: Tenant, Contract, Subscription e InvoiceWebhookIn.

---

# 🛠️ Decisões Técnicas

## 1️⃣ Separação de Entidades (Access vs Finance)

### Subscription (Entidade de Acesso)
Responsável pelo controle operacional:
- `PENDING`
- `ACTIVE`
- `OVERDUE`
- `SUSPENDED`
- `CANCELLED`

Campos relevantes:
- `ends_at`
- `overdue_since`
- `next_due_date`

### Contract (Entidade Financeira)
Representa o snapshot imutável do pacto comercial.  
Toda alteração gera um novo registro.  
Nunca há mutação financeira in-place.

### InvoiceWebhookIn
Representa a cobrança individual (payment do Asaas).  
`external_id` armazena `payment.id` para garantir idempotência.

---

# 📦 Tabela: checkout_intent (Somente Cartão)

Utilizada exclusivamente para o fluxo de Cartão de Crédito, onde não criamos Tenant antes da confirmação de pagamento.

Armazena snapshot completo do onboarding até `PAYMENT_RECEIVED`.

## Struct

```go
type CheckoutIntent struct {
	ID uint64

	// Referências do Gateway
	ExternalReference      string
	CheckoutID             string
	PaymentID              string
	SubscriptionExternalID string

	// Snapshot Comercial
	PlanID        uint64
	PlanPriceID   uint64
	Cycle         string
	BillingDay    int
	Seats         int
	UnitPrice     int64
	FinalPrice    int64
	PaymentMethod string // CREDIT_CARD

	// Snapshot Tenant
	TenantName   string
	TenantEmail  string
	Document     string
	PersonType   string
	Phone        string
	InvoiceEmail string

	// Snapshot Endereço
	ZipCode    string
	Street     string
	Number     string
	Complement string
	City       string
	State      string
	Country    string

	// Snapshot Usuário
	UserName     string
	UserEmail    string
	PasswordHash string

	// Cartão (via billingInfo)
	CardToken string
	CardLast4 string
	CardBrand string

	Status    string
	ExpiresAt time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}
```

Senha é armazenada apenas como hash.  
Nenhum PAN ou CVV trafega pelo backend.

---

# 💳 Fluxo – Cartão de Crédito (Assíncrono)

## ETAPA 1 – Submissão do Formulário

### Frontend

1. Usuário preenche formulário completo.
2. Seleciona **Cartão de Crédito**.
3. Exibe mensagem:
   "Você será redirecionado para o ambiente seguro do gateway de pagamento."

### Backend

1. Recebe `OnboardingIn`.
2. Valida `PlanID` e regras comerciais.
3. Calcula snapshot financeiro (unit_price, final_price, cycle, billing_day, seats).
4. Gera `PasswordHash`.
5. Gera `external_reference` (UUID interno).
6. Persiste `checkout_intent` com:
    - snapshots completos
    - `status = PENDING`
7. Chama API Asaas:
    - `POST /v3/checkouts`
    - `chargeTypes = RECURRENT`
    - `billingTypes = CREDIT_CARD`
    - `externalReference = external_reference`
8. Atualiza `checkout_intent.checkout_id`.
9. Retorna `CheckoutURL`.

### Frontend

10. Redireciona para `CheckoutURL`.

---

## ETAPA 2 – Webhook: PAYMENT_CREATED

1. Recebe `PAYMENT_CREATED`.
2. Extrai:
    - `payment.id`
    - `payment.externalReference`
3. Busca `checkout_intent` por `external_reference`.
4. Se não existir → ignorar (idempotência).
5. Salva `payment_id`.
6. Executa:
   `GET /v3/payments/{paymentId}/billingInfo`
7. Se cartão ainda não persistido:
    - salva `card_token`
    - salva `card_last4`
    - salva `card_brand`
8. Atualiza `status = PAYMENT_CREATED`.

---

## ETAPA 3 – Webhook: PAYMENT_RECEIVED (Commit Real)

1. Recebe `PAYMENT_RECEIVED`.
2. Busca `checkout_intent` por `external_reference`.
3. Se não existir → chama invoice usecase payment_received.
4. Se existir prepara o dado pro OnboardingUseCase.
5. **DELETE físico de checkout_intent.**

---

## ETAPA 4 – Webhook: CHECKOUT_EXPIRED ou CHECKOUT_CANCELLED

1. Buscar `checkout_intent` por `external_reference`.
2. Se existir:
    - DELETE físico.
3. Nenhuma entidade principal foi criada.

---

## ETAPA 5 – Webhook: PAYMENT_OVERDUE

1. Buscar Subscription.
2. Marcar InvoiceWebhookIn como OVERDUE.
3. Atualizar Subscription para OVERDUE.
4. Aplicar política de carência.

---

## UX Recomendada (Cartão)

Após retorno do gateway:

Tela intermediária:
"Pagamento em processamento. Seu acesso será liberado automaticamente."

A tela consulta backend até `Subscription.status = ACTIVE`.

---

# 🧾 Fluxo – Boleto (Síncrono)

Não utiliza `checkout_intent`.

## ETAPA 1 – Submissão

### Frontend

1. Usuário preenche formulário.
2. Seleciona **Boleto**.
3. Submete.

### Backend

1. Recebe `OnboardingIn`.
2. Valida plano.
3. Gera `PasswordHash`.
4. Cria Tenant.
5. Cria ExtraData.
6. Cria Address.
7. Cria User OWNER.
8. Cria Contract.
9. Cria Subscription no Asaas:
    - `billingType = BOLETO`
    - `cycle = MONTHLY/YEARLY`
10. Retorna sucesso.

Asaas envia boleto automaticamente por e-mail.

---

## Webhooks (Boleto)

- `PAYMENT_CREATED`
- `PAYMENT_RECEIVED`
- `PAYMENT_OVERDUE`

### PAYMENT_CREATED

- Cria InvoiceWebhookIn PENDING.
- Atualiza `next_due_date`.

### PAYMENT_RECEIVED

- Marca InvoiceWebhookIn como PAID.
- Ativa Subscription.
- Libera login.

### PAYMENT_OVERDUE

- Marca Subscription como OVERDUE.
- Inicia política de carência.

---

## UX Recomendada (Boleto)

Após submit:

Tela:
"Boleto gerado com sucesso. Enviado para seu e-mail."

Status exibido:
"Aguardando pagamento para liberação do acesso."

Botão:
"Já paguei" → consulta backend apenas.

---

# 🔄 Ciclo de Vida

Cancelamento:
- `Subscription.status = CANCELLED`
- `ends_at` definido.
- Novo snapshot em `contract`.

Winback:
- Remove `ends_at`.
- Reativa no Asaas.
- Novo snapshot financeiro.

Upgrade:
- Novo snapshot em `contract`.
- Sincronização imediata com Asaas.

---

# ⚓ Logística de Webhooks

Todos webhooks devem ser:

- Idempotentes
- Transacionais
- Validados por assinatura
- Baseados em `payment.id` como chave única

---

# 💻 Interfaces

```go
type OnboardingIn struct {
    Tenant struct {
       Name  string
       Email string
       ExtraData struct {
          InvoiceEmail string
          Phone        string
          Document     string
          PersonType   string
          SectorSource string
       }
       Address struct {
          ZipCode    string
          Street     string
          Number     string
          Complement string
          City       string
          State      string
          Country    string
       }
    }
    Subscription struct {
       PlanID        uint64
       MaxSeats      int
       BillingCycle  string
       PaymentMethod string
       NextDueDate   time.Time
       StartDate     time.Time
       Description   string
    }
    User struct {
       Name     string
       Email    string
       Password string
    }
    Callbacks struct {
       SuccessUrl string
       CancelUrl  string
       ExpiredUrl string
    }
}

type OnboardingOut struct {
    TenantID     uint64
    CheckoutURL  string
    IsCreditCard bool
}
```

---

## Resumo Arquitetural

Cartão:
- Assíncrono
- Via Checkout
- Commit após `PAYMENT_RECEIVED`
- DELETE de `checkout_intent` ao final

Boleto:
- Síncrono na criação
- Sem checkout
- Ativação após `PAYMENT_RECEIVED`

Ambos convergem para o mesmo modelo de domínio.