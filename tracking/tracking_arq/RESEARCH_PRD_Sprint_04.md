# PRD - Módulo Vitrine (Configuração) - Sprint 04

## 1. Contexto e Objetivo
O objetivo desta sprint é implementar a **interface de configuração da Loja Virtual (Vitrine)** para o parceiro UNIQ.
Atualmente, o sistema já possui uma visualização pública da loja (`Storefront`) acessível via slug, mas não existe uma interface administrativa para o parceiro configurar sua loja.

O módulo "Vitrine" deve permitir que o parceiro:
1.  Ative/Desative sua loja virtual.
2.  Configure a aparência básica (Slug, Banner, Logo).
3.  Gerencie quais produtos aparecem na vitrine.

## 2. Pesquisa de Código e Design

### 2.1. Funcionalidades Existentes (Backend & Frontend Público)
-   **Storefront Público:** `src/pages/Public/Storefront.tsx` já implementa a visualização da loja baseada no slug da URL.
-   **Serviço Público:** `src/services/publicService.ts` busca dados da empresa e produtos (`exibir_vitrine = true`).
-   **Banco de Dados:**
    -   `me_empresa`: Possui colunas `slug`, `avatar_url`, `logo_url`.
    -   `me_produto`: Possui coluna `exibir_vitrine` (boolean).
    -   `modulesService`: Gerencia a assinatura de módulos (necessário verificar se o parceiro tem o módulo "Vitrine" contratado).

### 2.2. O que Falta (Frontend Administrativo)
-   **Tela de Configuração da Loja:** Não existe.
    -   Precisa permitir edição do `slug` (com validação de unicidade).
    -   Permitir upload de Logo e Banner (se não usar os da empresa).
    -   Definir cor principal da loja (opcional, mas desejável para personalização).
-   **Gerenciamento de Produtos na Vitrine:**
    -   A listagem de produtos atual (`me_produto`) já tem o campo, mas precisa de uma interface fácil (toggle switch ou bulk action) para marcar/desmarcar `exibir_vitrine`.

### 2.3. Design de Referência
-   Diretório: `design/stitch_marketplace`
    -   Pastas sugerem fluxo: `marketplace_b2b_-_configura` (Configuração), `marketplace_b2b_-_publicar_an` (Publicação).
    -   Estilo visual: Seguir o padrão do Dashboard atual (Sidebar, Header, Cards).

## 3. Requisitos Funcionais

1.  **Ativação do Módulo:**
    -   Verificar se o módulo "Vitrine" está ativo para a empresa (`modulesService`).
    -   Se não estiver, redirecionar para a "Loja de Módulos" (`ModuleStore`).

2.  **Configuração da Loja:**
    -   **Rota:** `/dashboard/store-config` (Sugerido).
    -   **Campos:**
        -   **Slug:** Input de texto (prefixo `uniq.app/c/`). Validação assíncrona de disponibilidade.
        -   **Identidade Visual:** Upload de Logo e Banner (Capas).
        -   **Informações:** Nome da Loja (pode ser diferente da Razão Social), Descrição/Bio.
        -   **Contato:** WhatsApp para vendas (link direto).

3.  **Seleção de Produtos:**
    -   Lista de produtos da empresa com coluna "Exibir na Vitrine".
    -   Switch (On/Off) para atualização rápida.

4.  **Preview:**
    -   Botão "Visualizar Loja" que abre o link da loja (`/c/{slug}`) em nova aba.

## 4. Estrutura de Dados (Sugestão)
-   Utilizar tabela `me_empresa` para dados principais.
-   Caso necessite de configurações extras (ex: cor primária, layout), adicionar coluna `store_config JSONB` na tabela `me_empresa` ou criar tabela `me_loja_config`.
    -   *Decisão para Sprint 04:* Usar campos existentes e JSONB se necessário para evitar migrations complexas agora.

## 5. Artefatos a Gerar (Próxima Etapa: SPEC)
-   Lista de arquivos a criar (`StoreConfig.tsx`, `StorePreview.tsx`).
-   Atualizações em `routes.tsx` ou `App.tsx`.
-   Updates em serviços (`companyService` ou criar `storeService`).

## 6. Observações
-   Manter consistência com `Storefront.tsx` existente.
-   Garantir que alterações no slug atualizem a URL da loja pública imediatamente.
