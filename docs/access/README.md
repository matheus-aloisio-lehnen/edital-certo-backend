--------------------------------------------------------------------------------
🚀 GUIA DE IMPLEMENTAÇÃO: DOMÍNIO DE ACCESS
--------------------------------------------------------------------------------

Este guia detalha a lógica de funcionamento das funções de Autenticação, Usuário,
Sessões e Gestão de Acessos para facilitar a implementação da UI e do Backend.

---

📌 1. FUNÇÃO: Login & Logout (Sessão Única)
--------------------------------------------------
O que faz: Autentica o usuário e garante que ele tenha apenas UM acesso ativo.

🛠️ Fluxo Interno:
1. Valida credenciais (Email/Senha). Erro genérico para evitar enumeração de usuários.
2. Verifica saúde da assinatura via policy.AuthorizeUserEntry (Bloqueia se houver pendência).
3. [TRAVA DE EXCLUSIVIDADE]: Chama RevokeAllSessions para derrubar qualquer outro dispositivo logado.
4. Logout: Revoga a sessão no Redis e limpa os Cookies HttpOnly (Max-Age: -1).

📱 Frontend:
- Recebe cookies HttpOnly — o JS não toca nos tokens por segurança (XSS).
- Sentinel 'ErrInvalidSession': Deve disparar redirect para Login (Sessão derrubada por outro login).

---

📌 2. FUNÇÃO: RenewSession (Refresh Token Rotation)
--------------------------------------------------
O que faz: Renova o Access Token (JWT) usando o Refresh Token de forma segura.

🛠️ Fluxo Interno:
1. Valida se a sessão atual não expirou no banco ou se não foi revogada manualmente.
2. [ROTAÇÃO]: O Refresh Token antigo é DELETADO imediatamente após o uso.
3. Um novo par é gerado e uma nova sessão é persistida.
4. Se um token antigo for reusado (ataque de replay), o sistema bloqueia o acesso.

---

📌 3. FUNÇÃO: SendChallenge / SendRecovery / Invite (OTP)
--------------------------------------------------
O que faz: Gera códigos temporários (OTP) de 6 dígitos para desafios ou convites.

🛠️ Fluxo Interno:
1. CSPRNG: Gera códigos numéricos usando crypto/rand (alta entropia).
2. [TRAVA DE TENTATIVAS]: O algoritmo RetrySetNX tenta gravar no Redis até 5x em caso de colisão de código.
3. TTL (Validade): Challenge/Recovery (15 min), Invite (48 horas).
4. Publisher: O UseCase não envia e-mail; ele publica um evento para o serviço de notificação.

---

📌 4. FUNÇÃO: Me (Dashboard de Limites & Perfil)
--------------------------------------------------
O que faz: Consolida perfil, permissões e consumo de cotas de forma ultra-rápida.

🛠️ Fluxo Interno:
1. Recupera dados via AccessManager (Zero DB hit para dados do Contexto).
2. Consolida permissões (Booleans) e Quotas (Limites de uso).
3. QuotaUsageService: Busca o consumo atômico (ex: seats usados) diretamente no Redis.
4. ⚡ Performance: Não gera logs de Track para evitar sobrecarga de observabilidade.

---

📌 5. FUNÇÃO: AcceptInvite (Fluxo Crítico de Atendimento)
--------------------------------------------------
O que faz: Finaliza o cadastro validando se o código é real e se ainda há vagas.

🛠️ Fluxo Interno (Atomicidade Garantida):
1. Valida o código do convite no Redis.
2. [TRAVA DE SEGURANÇA]: Faz o Increment da cota no Redis ANTES de salvar o usuário.
3. Se houver vaga: Faz o hash da senha (Bcrypt) e salva o User no Postgres.
4. 🔄 Rollback: Se o banco falhar ao salvar o usuário, faz um Decrement no Redis para devolver a vaga.
5. Cleanup: Apaga o código de convite usado para impedir reuso.

---

🏗️ ARQUITETURA TÉCNICA E OBSERVABILIDADE

🔹 OBSERVABILIDADE (Logs Estratégicos):
- Função obs.Track: Utilizada para rastreio centralizado de operações.
- Níveis: LevelInfo (Sucessos), LevelWarn (Avisos de negócio) e LevelError (Falhas técnicas).
- Mensagens: Logs obrigatoriamente em português para facilitar monitoramento no Grafana.
- PII: Proibido logar senhas ou hashes em qualquer circunstância.

🔹 GARANTIA DE QUALIDADE (Testes):
- Localização: Mocks gerados via testify/mock obrigatoriamente na pasta irmã /mocks/.
- Foco: O Junie deve testar a lógica de negócio (ordem Revoke -> Save, rollback de quotas, etc).
- Logs: O Junie NÃO deve testar a saída da função obs.Track.

--------------------------------------------------------------------------------
💡 DICA PARA O FRONTEND:
Como o sistema garante Sessão Única, trate o erro 401/403 de sessão inválida
para avisar ao usuário que "Sua conta foi conectada em outro dispositivo".
--------------------------------------------------------------------------------