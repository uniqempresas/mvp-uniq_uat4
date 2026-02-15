# 🟢 Tracking de Desenvolvimento - UNIQ

**Última atualização:** 14/02/2026
**Sprint Atual:** [Sprint 05](specs/SPEC_Sprint_05.md) (Loja de Módulos & Configurações)
**Status:** 🏃 Em Execução

> 📁 **Arquivos de Sprints Anteriores:**
> - [Sprint 04](plans/Sprint_04.md) (Concluido - Ver Histórico)
> - [Sprint 03](plans/Sprint_03.md) (Concluido)
>
> 📋 **Backlog Geral:**
> - [Backlog do Projeto](TRACKING_Backlog.md)

---

## 🎯 Sprint 05 - Loja de Módulos & Configurações

**Status:** 🏃 Em Execução
**Foco:** Habilitar seleção contextual de módulos e configuração completa da Loja Virtual.
**Objetivo:** Refatorar a visualização da Loja de Módulos para abas (Meus Módulos / Disponíveis / Em Breve) e consolidar o fluxo de configuração da vitrine (Slug, Bio, Produtos).

### ✅ Concluído
- [x] Elaboração da Especificação Técnica da Sprint 05.

### 🚧 Em Andamento / A Fazer

#### 📦 1. Refatoração da Module Store (`ModuleStore.tsx`)
- [ ] Substituir filtros de categoria por abas contextuais.
- [ ] Implementar aba **"Meus Módulos"** (Módulos ativos).
- [ ] Implementar aba **"Disponíveis"** (Módulos não ativos).
- [ ] Implementar aba **"Em Breve"** (Módulos em desenvolvimento).
- [ ] Garantir que o card mostre "Ativar" ou "Configurar" dinamicamente.

#### ⚙️ 2. Configurações da Loja (`StoreConfig`)
- [ ] **Aba Geral (`GeneralTab`):**
    - [ ] Adicionar validação de Slug (zod + regex para hífens/minúsculas).
    - [ ] Implementar check de disponibilidade de slug no backend.
    - [ ] Garantir persistência de `whatsapp`, `bio` e `name` na tabela `unq_lojas`.
- [ ] **Aba Produtos (`ProductsTab`):**
    - [ ] Permitir selecionar produtos visíveis na vitrine.
    - [ ] Salvar flag `is_public` ou relação na tabela associativa.

#### 🌐 3. Vitrine Pública (`Storefront.tsx`)
- [ ] Carregar dados da loja dinamicamente via `slug`.
- [ ] Aplicar filtros de visibilidade nos produtos.
- [ ] Layout premium refletindo Bio e contatos salvos.

---

## 🧪 Checklist de Validação (QA)

### Fluxo de Onboarding
- [ ] Cadastro completo -> Redirecionamento Dashboard.
- [ ] Verificação de `empresa_id` associado ao usuário.

### Loja de Módulos
- [ ] Troca de abas funcional.
- [ ] Ativação de módulo move o item para "Meus Módulos".

### Gestão da Vitrine
- [ ] Troca de slug reflete na URL da vitrine.
- [ ] Produto desmarcado não aparece para o cliente final.
