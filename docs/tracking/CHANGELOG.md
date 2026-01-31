# Changelog - UNIQ Empresas

Todas as mudanças notáveis do projeto estão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### Adicionado
- Sistema de tracking de desenvolvimento com TRACKING.md
- CHANGELOG.md para histórico de mudanças
- CONTEXTO_PROJETO.md para sincronização entre máquinas

### Corrigido
*(vazio)*

### Alterado
*(vazio)*

### Removido
*(vazio)*

---

## [0.1.0] - 2026-01-29

### Adicionado
- Sistema de autenticação com Supabase
- Dashboard inicial com visão geral
- Módulo CRM completo
  - Lista de clientes
  - Pipeline de vendas (Kanban)
  - Chat/mensagens com clientes
  - Tags e segmentação
- Módulo Finance (Financeiro)
  - Contas a Pagar
  - Contas a Receber
  - Categorias de despesas/receitas
  - Contas bancárias
  - Dashboard financeiro
- Catálogo de Produtos
  - Cadastro de produtos
  - Categorias
  - Upload de imagens
  - Controle de preços e estoque básico
- Estrutura básica de Loja Virtual (Storefront)
  - Rota pública `/c/:slug`
  - Estrutura inicial (não funcional)

### Corrigido
- Problemas de autenticação e sessão
- Navegação entre módulos

### Tecnologias Utilizadas
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Supabase (Backend as a Service)
- React Router v7

---

## Legenda de Categorias

- **Adicionado**: Novas funcionalidades
- **Corrigido**: Correções de bugs
- **Alterado**: Mudanças em funcionalidades existentes
- **Descontinuado**: Funcionalidades que serão removidas
- **Removido**: Funcionalidades removidas
- **Segurança**: Correções de vulnerabilidades
