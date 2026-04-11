# DOCUMENTACAO DE ARQUITETURA E SCHEMA - EDITAL CERTO

* 📂 **1. MODULOS DO SISTEMA**

    * 🧠 **1.1 ANALYSIS (CORE)**
        * Gerencia o fluxo de documentos e inteligibilidade de editais.
        * * `draft`: Rascunhos de projetos com conteudo comprimido via Gzip (bytea).
        * * `evaluation` & `evaluation_score`: Resultados de analise tecnica e criterios de pontuacao.
        * * `file`: Gestao centralizada de arquivos com hash SHA256 para evitar duplicidade.
        * * `notice_summary`: Processamento tecnico e sumarizacao dos editais.
        * * `notice_user`: Relacao de editais salvos ou lidos por cada usuario.
        * * `job`: Orquestracao de tarefas assincronas e processamento de arquivos.

    * 💳 **1.2 BILLING (FINANCEIRO)**
        * Integracao nativa com o Gateway Asaas para gestao de recorrencia.
        * * `tenant`: Unidade organizacional detentora da conta.
        * * `legal_identity` & `address`: Dados fiscais (CPF/CNPJ) e localizacao para faturamento.
        * * `subscription`: Estado atual da assinatura, incluindo controle de DPD e inadimplencia.
        * * `contract`: Historico de mudancas de plano e auditoria de variacao de MRR.
        * * `invoice`: Registro de faturas, pagamentos e conciliação via Webhooks.
        * * `checkout_intent`: Persistencia de dados durante o fluxo de Onboarding e pagamento.

    * 🔐 **1.3 ACCESS (IDENTIDADE)**
        * Controle de acesso, permissões e politicas de sessao unica.
        * * `user`: Cadastro de usuarios vinculados a um Tenant com roles OWNER ou MEMBER.
        * * `session`: Gestao de tokens, controle de dispositivos e suporte a Takeover de sessao.

    * 🚀 **1.4 PRODUCT (CATALOGO & QUOTAS)**
        * Motor de limites, precificacao e permissoes por plano.
        * * `plan` & `price`: Configuracao comercial dos pacotes e ciclos de cobranca.
        * * `quota` & `quota_override`: Limites de uso (Ex: max_drafts) globais ou customizados.
        * * `permission` & `permission_override`: Feature Flags para controle de funcionalidades.
        * * `quota_usage`: Registro historico de consumo consolidado mensal.

    * 📢 **1.5 COMMUNICATION**
        * * `alert`: Sistema de avisos internos, modais de marketing ou alertas de sistema.
        * * `alert_user_ack`: Registro de leitura (ACK) dos alertas por usuario.

* ⚡ **2. ESTRUTURA DE CACHE (REDIS)**

    * * `access:active:{userID}`: UUID da sessao titular para Single Session.
    * * `access:takeover:{userID}`: Sessao candidata aguardando confirmacao (409 Conflict).
    * * `access:registry:{sessionID}`: Status volatil da sessao (ACTIVE ou PENDING).
    * * `quota:usage:{tenantID}:{key}:{period}`: Contador performatico para limites de uso.
    * * `access:otp:{code}`: Dados para validacao de Desafios, Recuperacao e Convites.

* ⚖️ **3. REGRAS DE NEGOCIO INTEGRADAS**

    * * **Inadimplencia**: O `overdue_since` define o DPD. Acesso bloqueado apos 7 dias de atraso.
    * * **Cancelamento**: O `ends_at` e calculado como data de expiracao menos 1 dia para evitar renovacao no Asaas.
    * * **Sessao Unica**: Identificacao de conflito via cache dispara o fluxo de Takeover.