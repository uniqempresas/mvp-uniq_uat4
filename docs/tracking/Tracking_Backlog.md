# 📋 Backlog do Produto - UNIQ Empresas

> 🔙 [Voltar para Tracking Atual](TRACKING.md)

---

### [TRACK-018] Correção: Cadastro de Colaboradores
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Backlog
- **Prioridade:** 🟡 ALTA
- **Estimativa:** 2-3 horas

**Descrição:**
Investigar e corrigir possível bug na inserção de novos colaboradores no sistema.

**Sub-tarefas:**
- [ ] Testar fluxo completo de cadastro de colaborador
- [ ] Verificar validações do formulário
- [ ] Verificar chamadas ao `collaboratorService`
- [ ] Testar em diferentes cenários (com/sem foto, diferentes cargos)
- [ ] Corrigir bugs encontrados

**Acceptance Criteria:**
- Cadastro de colaboradores funciona 100%
- Dados são persistidos corretamente no banco
- Validações impedem dados inválidos

---

### [TRACK-019] UX: Logo Click → Dashboard
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Backlog
- **Prioridade:** 🟢 MÉDIA
- **Estimativa:** 30 min

**Descrição:**
Implementar navegação para dashboard ao clicar no ícone/logo do aplicativo no header.

**Sub-tarefas:**
- [ ] Identificar componente do logo/ícone no header
- [ ] Adicionar `onClick` ou `Link` para rota `/dashboard`
- [ ] Testar navegação em desktop e mobile

**Acceptance Criteria:**
- Clicar no logo redireciona para `/dashboard`
- Funciona tanto em mobile quanto desktop
- Navegação é instantânea (sem reload de página)

---

### [TRACK-020] Design: Novo Ícone do App
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Backlog
- **Prioridade:** 🟢 BAIXA
- **Estimativa:** 1-2 horas

**Descrição:**
Criar e implementar novo ícone para o aplicativo UNIQ Empresas, substituindo o ícone atual (flor).

**Sub-tarefas:**
- [ ] Definir conceito visual do novo ícone
- [ ] Criar ícone em múltiplos tamanhos (16x16, 32x32, 192x192, 512x512)
- [ ] Gerar favicon.ico
- [ ] Atualizar `public/` com novos assets
- [ ] Atualizar manifest.json
- [ ] Testar em diferentes dispositivos e browsers

**Acceptance Criteria:**
- Novo ícone visível no browser tab
- Novo ícone aparece quando app é instalado (PWA)
- Ícone representa a identidade visual da UNIQ

---

### [TRACK-010] Sistema de Convite e Login de Colaboradores
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Planejado (Backlog)
- **Prioridade:** 🟡 BAIXA
- **Dependência:** TRACK-008 (concluído na Sprint 01)

**Descrição:**
Implementar sistema completo de convite por email para colaboradores com criação de conta de login no Supabase Auth.

**Sub-tarefas:**
- [ ] Configurar SMTP no Supabase para envio de emails
- [ ] Criar Edge Function `invite-collaborator` que:
  - Cria usuário em `auth.users`
  - Vincula com registro de `me_usuario`
  - Gera token de convite temporário
  - Envia email com link de ativação
- [ ] Criar página de ativação de conta (frontend)
- [ ] Implementar fluxo de definição de senha
- [ ] Adicionar botão "Reenviar Convite" na lista de colaboradores
- [ ] Implementar sistema de expiração de convites (7 dias)
- [ ] Adicionar indicador visual de "Convite Pendente" vs "Ativo"

**Requisitos Técnicos:**
- SMTP configurado (SendGrid, AWS SES, etc)
- Edge Function com acesso ao `auth.admin` do Supabase
- Template de email personalizado
- Política RLS para permitir auth.admin criar usuários

**Observações:**
Este módulo completa a funcionalidade do TRACK-008, permitindo que colaboradores cadastrados possam efetivamente fazer login no sistema. Atualmente, o TRACK-008 funciona apenas como "cadastro de RH".

---

### [TRACK-021] Transformar ProductForm em Modal (Versão Beta)
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Planejado (Backlog - Beta)
- **Prioridade:** 🟢 BAIXA
- **Dependência:** Nenhuma

**Descrição:**
Transformar o formulário de produtos (ProductForm) de página completa para modal overlay, mantendo funcionalidade completa.

**Sub-tarefas:**
- [ ] Criar versão modal do ProductForm mantendo todas as funcionalidades
- [ ] Adaptar upload múltiplo de imagens para contexto de modal
- [ ] Ajustar sistema de variações (tabela) para caber em modal
- [ ] Implementar scroll interno otimizado
- [ ] Testar navegação e breadcrumbs dentro do modal
- [ ] Garantir responsividade mobile (modal full-screen)

**Acceptance Criteria:**
- Modal abre suavemente com backdrop blur
- Todas as funcionalidades (variações, imagens, categorias) mantidas
- Upload de imagens funcional dentro do modal
- Responsivo (mobile full-screen, desktop max-w-6xl)
- Botão de fechar sempre visível

**Observações:**
MVP mantém ProductForm como página para garantir estabilidade. Transformação em modal pode ser feita na versão Beta quando houver mais tempo para testes e ajustes de UX.
