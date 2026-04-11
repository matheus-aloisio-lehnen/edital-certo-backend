# README.md

# 🚀 Guia de Deploy e Infraestrutura (GCP)

Este documento detalha o fluxo de Integração e Entrega Contínua (CI/CD) da API, focado na infraestrutura Google Cloud Platform e integração com Easypanel.

## 🏗️ Arquitetura de Deploy

O fluxo segue o modelo de **Push-to-Deploy** utilizando o Google Artifact Registry como repositório de imagens:

1. **Build**: O Bitbucket Pipelines utiliza Docker Multi-stage para gerar um binário estático Go em uma imagem Alpine mínima.
2. **Registry**: A imagem é enviada para o **Google Artifact Registry (GCP)**.
3. **Trigger**: O Pipeline dispara um Webhook para o **Easypanel**, que realiza o Pull da nova imagem e atualiza o container no Cloud Run ou VM.
4. **Mensageria**: Eventos de infraestrutura e billing são orquestrados via **Google Pub/Sub**.



## 🌿 Ambientes e Branches

| Ambiente | Branch | Tag Artifact Registry | URL de Deploy (Easypanel) |
| :--- | :--- | :--- | :--- |
| **Homologação** | `hml` | `:hml` | VM/Cloud Run Testes |
| **Produção** | `master` | `:latest` | VM/Cloud Run Produção |

## 🔑 Variáveis de Ambiente (Configuração)

### 1. No Bitbucket (Repository Variables)
As seguintes variáveis devem estar configuradas em *Repository Settings > Variables*:

* `GCP_SERVICE_ACCOUNT_KEY`: JSON da Service Account com permissão de `Artifact Registry Writer`.
* `GCP_PROJECT_ID`: ID do projeto no Google Cloud (ex: `cuidatoria-pro`).
* `GCP_REGION`: Região do repositório (ex: `southamerica-east1`).
* `GCP_REPO_NAME`: Nome do repositório no Artifact Registry.
* `EASYPANEL_WEBHOOK_HML`: URL de webhook para o ambiente de homologação.
* `EASYPANEL_WEBHOOK_PROD`: URL de webhook para o ambiente de produção.

### 2. No Easypanel / Cloud Run
Variáveis consumidas pelo Viper em tempo de execução:
* `STAGE`: `hml` ou `prod`.
* `GCP_PUBSUB_TOPIC`: Nome do tópico para eventos de billing.
* `DB_HOST`, `DB_USER`, `DB_PASSWORD`: Credenciais do Cloud SQL ou Banco Externo.

## 🛠️ Procedimento de Deploy Manual

Caso precise subir uma imagem manualmente via CLI:

1. **Autenticar no GCP**:
   `gcloud auth configure-docker [GCP_REGION]-docker.pkg.dev`

2. **Build e Tag**:
   `docker build --target runner -t [REGISTRY_URL]:latest .`

3. **Push**:
   `docker push [REGISTRY_URL]:latest`

## 📦 Estrutura do Dockerfile
O deploy utiliza **Multi-stage Build**:
* **Stage `deps`**: Cache de dependências Go.
* **Stage `builder`**: Compilação do binário estático.
* **Stage `runner`**: Imagem Alpine contendo apenas o binário e os arquivos de `/configs`.

## 💡 Notas de Troubleshooting
* **Erro 403 no Push**: Verifique se a Service Account tem o papel `roles/artifactregistry.writer`.
* **Webhook do Easypanel**: Se o deploy não iniciar, verifique se a URL do Webhook não expirou ou se o IP do Bitbucket não está bloqueado.
* **Pub/Sub**: Certifique-se de que a API do Pub/Sub está ativada no projeto GCP antes de subir o serviço.