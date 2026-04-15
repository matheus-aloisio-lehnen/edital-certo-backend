# Arquitetura

Este diretório concentra a visão arquitetural atual da plataforma **Edital Certo** usando o modelo C4. O objetivo é descrever a solução em camadas, da visão mais externa até o fluxo interno principal de processamento.

## Visão Geral

A plataforma roda majoritariamente em infraestrutura local, exposta com **Cloudflare Tunnel**. O núcleo do sistema é um **backend monolítico em NestJS**, apoiado por:

- `site` em Angular
- `frontend` em Angular
- `worker` em Go para processamento pesado de arquivos e IA
- `PostgreSQL` como banco principal
- `Redis` como cache
- `RabbitMQ` como broker
- `GCP Bucket` para arquivos e backups

Além disso:

- o backend e o worker **publicam** mensagens no RabbitMQ
- quem **consome** essas mensagens é o `queue processor` em NestJS
- o `queue processor` faz a ponte via REST:
  - do backend para o worker
  - do worker para o backend

## Diagramas

### C1: Contexto

Arquivo: [c1_context.puml](/home/matheus/dev/cuidatoria/edital-certo/backend/docs/architecture/c1_context.puml:1)

Mostra:

- usuário
- operação/admin
- Cloudflare
- plataforma Edital Certo
- buckets no GCP
- APIs externas de IA
- banco cold standby para restore

Esse nível responde: "quem interage com o sistema e quais dependências externas existem?"

### C2: Containers

Arquivo: [c2_container.puml](/home/matheus/dev/cuidatoria/edital-certo/backend/docs/architecture/c2_container.puml:1)

Mostra os containers principais da solução:

- `site`
- `frontend`
- `cloudflared`
- `backend` em NestJS
- `queue processor` em NestJS
- `worker` em Go
- `PostgreSQL`
- `Redis`
- `RabbitMQ`
- job de backup do PostgreSQL

Esse nível responde: "quais peças executáveis existem e como elas se comunicam?"

### C3: Componentes

Arquivo: [c3_component.puml](/home/matheus/dev/cuidatoria/edital-certo/backend/docs/architecture/c3_component.puml:1)

Detalha principalmente:

- componentes internos do backend
- componentes do queue processor
- pipeline interno do worker
- integração com bucket, broker, banco e APIs de IA

Esse nível responde: "como a responsabilidade está dividida dentro dos containers principais?"

### C4: Código

Arquivo: [c4_code.puml](/home/matheus/dev/cuidatoria/edital-certo/backend/docs/architecture/c4_code.puml:1)

Representa o fluxo principal de ingestão e processamento assíncrono:

1. backend recebe o arquivo
2. backend sobe o arquivo no bucket
3. backend publica mensagem
4. queue processor consome e chama o worker
5. worker baixa arquivo, processa, gera embeddings e grava no PostgreSQL
6. worker publica status
7. queue processor consome e notifica o backend

Esse nível responde: "como o fluxo crítico acontece na prática?"

## Decisões Arquiteturais

### 1. Monólito principal em NestJS

O backend concentra:

- autenticação
- regras de domínio
- persistência transacional
- upload/orquestração
- observabilidade

A escolha aqui é pragmática: manter a complexidade operacional baixa sem perder modularidade interna.

### 2. Processamento pesado fora do backend

O worker em Go existe para as rotinas mais pesadas:

- extração de texto
- chamadas de IA
- geração de embeddings
- vetorização no PostgreSQL

Isso evita colocar processamento intensivo dentro do monólito principal.

### 3. RabbitMQ como barramento assíncrono

O broker é usado como ponto de publicação de eventos e solicitações assíncronas.

Regra importante desta arquitetura:

- backend publica
- worker publica
- quem consome é o queue processor

O queue processor centraliza a ponte entre os lados e evita acoplamento direto entre backend e worker no consumo da fila.

### 4. Cloudflare Tunnel para expor a stack local

A operação prevista é local-first:

- os serviços principais rodam localmente
- o Cloudflare Tunnel publica os endpoints necessários com segurança

Isso reduz necessidade de expor portas diretamente e simplifica a borda pública.

### 5. PostgreSQL como banco transacional e vetorial

O PostgreSQL não é só o banco transacional.

Ele também recebe:

- textos processados
- embeddings
- vetores para busca semântica

O worker toca o banco diretamente nesse fluxo específico.

### 6. Redis como suporte de performance

O Redis é usado como cache para aliviar leitura repetitiva e melhorar performance do backend.

### 7. Backup com bucket e cold standby

O desenho atual prevê:

- backup diário do PostgreSQL
- sincronização desse backup para um bucket no GCP
- envio periódico de artefatos de recuperação para cenários de emergência
- um PostgreSQL desligado na nuvem, ativado apenas em restore

O objetivo é manter um caminho de recuperação sem deixar um banco secundário sempre ligado.

## Fluxo Principal de Processamento de Arquivos

Resumo operacional:

1. usuário envia arquivo pelo frontend
2. backend recebe e persiste o contexto do job
3. backend sobe o arquivo no bucket
4. backend publica uma mensagem no RabbitMQ
5. queue processor consome a mensagem
6. queue processor chama o worker via REST
7. worker baixa o arquivo do bucket
8. worker extrai texto e executa IA
9. worker gera embeddings e grava no PostgreSQL
10. worker publica status/conclusão no RabbitMQ
11. queue processor consome esse retorno
12. queue processor notifica o backend via REST

## Dependências Externas Relevantes

- `Cloudflare`: DNS, SSL e tunnel
- `Gemini / ChatGPT API`: processamento de IA
- `GCP Bucket (Arquivos)`: armazenamento de arquivos operacionais
- `GCP Bucket (Backups)`: backup e recuperação
- `PostgreSQL Cold Standby`: restore em emergência

## Observação

Os diagramas deste diretório descrevem a arquitetura-alvo atual. Se a topologia mudar, o ideal é atualizar primeiro os arquivos `.puml` e depois este README para manter consistência entre a documentação textual e visual.
