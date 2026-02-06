# 📊 Tracking de Desenvolvimento - UNIQ Empresas

**Última atualização:** 06/02/2026 14:17 BRT  
**Sprint Atual:** Sprint 02  
**Máquina:** HQ/UAT4  
**Status:** 📋 Planejamento concluído - Aguardando início TRACK-011 (07/02/2026)

> 📁 **Arquivo de Sprints Anteriores:** Ver pasta `tracking_arq/`  
> - [Sprint 01 (Concluída)](../tracking_arq/TRACKING_Sprint_01.md) - 9 TRACKs concluídas

---

## 🎯 Sprint 02 - Mobile-First MVP

**Status:** 📋 Planejada  
**Período Estimado:** 06/02/2026 - 20/02/2026 (2 semanas)  
**Foco:** 📱 Responsividade Mobile-First (4 clientes beta, 50% operam 100% mobile)

**Objetivo:** Tornar 100% dos módulos responsivos e otimizados para mobile, viabilizando uso completo via smartphone.

**Definition of Done:**
- [ ] 100% módulos funcionam em viewport 375px-768px
- [ ] 0 scroll horizontal em qualquer tela
- [ ] Touch targets >= 44px (iOS HIG)
- [ ] Performance mobile: FCP <1.8s, LCP <2.5s
- [ ] Testado em dispositivos reais (iOS + Android)

---

### [TRACK-011] Infraestrutura Mobile Base
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando início
- **Prioridade:** 🔴 CRÍTICA
- **Estimativa:** 2-3 dias

**Descrição:**
Implementar estrutura base responsiva: menu hamburger, breakpoints Tailwind, layout adaptativo.

**Sub-tarefas:**
- [ ] Configurar breakpoints Tailwind personalizados (sm:640, md:768, lg:1024)
- [ ] Criar componente `MobileDrawer` (menu hamburger)
- [ ] Adaptar `Sidebar` para desktop + drawer mobile
- [ ] Implementar layout responsivo base (Header, Content Area)
- [ ] Criar hook `useBreakpoint()` para detecção de viewport
- [ ] Testar navegação mobile completa

**Acceptance Criteria:**
- Mobile (<768px): Menu hamburger funcional com drawer slide-in
- Desktop (>=768px): Sidebar fixa tradicional
- Transição suave entre breakpoints sem quebra de layout

---

### [TRACK-012] Módulos Cadastros Responsivos
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando TRACK-011
- **Prioridade:** 🔴 CRÍTICA
- **Estimativa:** 4-5 dias
- **Dependência:** TRACK-011

**Descrição:**
Adaptar todos os módulos de cadastro (Clientes, Produtos, Serviços, Fornecedores, Colaboradores) para mobile.

**Sub-tarefas:**
- [ ] **Clientes:** Transformar tabela em card layout mobile + form touch-friendly
- [ ] **Produtos:** Grid responsivo + modal full-screen mobile
- [ ] **Serviços:** Lista adaptativa com drawer de detalhes
- [ ] **Fornecedores:** Card stack com busca mobile
- [ ] **Colaboradores:** Lista simplificada mobile
- [ ] Implementar component `ResponsiveTable` (Table desktop / Card mobile)
- [ ] Adaptar todos os formulários para touch (inputs height 48px+)

**Acceptance Criteria:**
- Todas as listas renderizam como cards em mobile (<768px)
- Formulários preenchíveis sem zoom necessário
- Ações (editar/deletar) acessíveis via swipe ou botões grandes
- Modals ocupam full-screen em mobile

---

### [TRACK-013] Dashboard & Storefront Mobile
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando TRACK-012
- **Prioridade:** 🟡 ALTA
- **Estimativa:** 2-3 dias
- **Dependência:** TRACK-012

**Descrição:**
Adaptar Dashboard (métricas, gráficos) e Storefront público para mobile.

**Sub-tarefas:**
- [ ] **Dashboard:** Cards empilhados verticalmente (grid-cols-1 md:grid-cols-3)
- [ ] **Dashboard:** Gráficos responsivos (Chart.js/Recharts com width 100%)
- [ ] **Storefront:** Revisar catálogo mobile (já existe, precisa polish)
- [ ] **Storefront:** Carrinho mobile otimizado
- [ ] **Storefront:** Checkout mobile-friendly (WhatsApp button grande)

**Acceptance Criteria:**
- Dashboard legível e usável em 375px
- Gráficos se adaptam sem overflow
- Storefront público navegável 100% mobile

---

### [TRACK-014] Forms & UX Polish Mobile
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando TRACK-013
- **Prioridade:** 🟢 MÉDIA
- **Estimativa:** 2 dias
- **Dependência:** TRACK-013

**Descrição:**
Refinamento de UX mobile: keyboards corretos, gestos, error states, loading polish.

**Sub-tarefas:**
- [ ] Input keyboard types (tel, email, numeric, url)
- [ ] Implementar `scrollIntoView` quando keyboard abre
- [ ] Error messages mobile-friendly (toast em vez de inline)
- [ ] Loading states touch-optimized (skeleton screens)
- [ ] Swipe gestures básicos (swipe-to-delete em listas)
- [ ] Adicionar `touch-action` CSS para evitar conflitos
- [ ] Thumb-zone optimization (ações principais no bottom 1/3 da tela)

**Acceptance Criteria:**
- Keyboard mobile abre com tipo correto
- Campos não ficam ocultos atrás do keyboard
- Usuário consegue fazer swipe para deletar itens de lista
- Touch feedback visual em todos os botões (<150ms)

---

### [TRACK-015] QA Mobile & Device Testing
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando TRACK-014
- **Prioridade:** 🔴 CRÍTICA
- **Estimativa:** 2 dias
- **Dependência:** TRACK-014

**Descrição:**
Testes em dispositivos reais, correção de bugs mobile-specific, performance audit.

**Sub-tarefas:**
- [ ] Criar checklist de testes mobile (matriz de devices)
- [ ] Testar em iOS real (Safari)
- [ ] Testar em Android real (Chrome)
- [ ] Performance audit mobile (Lighthouse mobile mode)
- [ ] Corrigir bugs específicos de browser mobile
- [ ] Validar métricas: FCP <1.8s, LCP <2.5s, CLS <0.1
- [ ] Teste de usabilidade com 2 usuários beta mobile

**Acceptance Criteria:**
- Testado em pelo menos 2 devices (1 iOS + 1 Android)
- 0 bugs de usabilidade críticos
- Performance mobile dentro das métricas
- Aprovação de pelo menos 1 cliente beta mobile

---

### [TRACK-016] Sistema de Módulos (Menu Dinâmico)
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando TRACK-011 a 015
- **Prioridade:** 🟡 ALTA
- **Estimativa:** 3-4 dias
- **Dependência:** Nenhuma técnica (mas será feita após mobile por decisão estratégica)

**Descrição:**
Criar sistema de módulos ativáveis onde cliente escolhe quais funcionalidades quer no menu. Reduz poluição visual e prepara para futura monetização.

**Sub-tarefas:**
- [ ] Criar tabela `me_modulo_ativo` (empresa_id + modulo_codigo + ativo)
- [ ] Criar RLS permitindo apenas role='dono' gerenciar módulos
- [ ] Criar função helper `is_dono()` para RLS
- [ ] Desenvolver `moduleService.ts` (listar, ativar, desativar)
- [ ] Criar `ModuleContext` para estado global de módulos ativos
- [ ] Criar página "Módulos" com grid de cards (toggle on/off)
- [ ] Adaptar `MainSidebar` para filtrar apenas módulos base + ativos
- [ ] Implementar onboarding: módulos opcionais aparecem desabilitados/grisados
- [ ] Testar: Dono ativa CRM → aparece no menu
- [ ] Testar: Colaborador não consegue ativar módulos

**Módulos Base (Sempre Ativos):**
- Minha Empresa, Financeiro, Módulos, Configurações

**Módulos Opcionais (Cliente Escolhe):**
- CRM, Loja, Estoque, Equipe, Relatórios

**Acceptance Criteria:**
- Menu dinâmico reflete módulos ativos em tempo real
- Apenas Dono vê toggles funcionais na página "Módulos"
- Onboarding mostra opcionais desabilitados com tooltip "Ative em Módulos"
- Ativar/desativar persiste no banco e atualiza sidebar sem reload

**Observações:**
MVP sem monetização. Arquitetura preparada para futura cobrança por módulo (campo `preco_mensal` pode ser adicionado depois).

---

## 📋 BACKLOG / FUTURAS

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

## 📊 Estatísticas Gerais do Projeto

**Total de TRACKs (Todas as Sprints):** 16  
**Concluídas:** 9 (Sprint 01)  
**Sprint 02 (Planejada):** 6 (TRACK-011 a TRACK-016)  
**Em Backlog:** 1 (TRACK-010)

**Progresso Geral:** 56% (9/16 concluídas)

---

## 🎯 Módulos Implementados (Sprint 01)

- ✅ Sistema de Tracking
- ✅ Cadastro de Usuários com Rollback
- ✅ Separação CRM
- ✅ Storefront Público
- ✅ **Minha Empresa > Cadastros:**
  - ✅ Clientes
  - ✅ Produtos  
  - ✅ Serviços
  - ✅ Fornecedores
  - ✅ Colaboradores (Gestão de RH)

---

## 📝 Próximos Passos (Amanhã - 07/02/2026)

**Sprint 02 - Ordem de Execução Definida:**
1. ✅ Planejamento concluído (06/02/2026)
2. 🚀 **TRACK-011** - Infraestrutura Mobile Base (início 07/02)
3. 📱 TRACK-012 → 013 → 014 → 015 (Mobile-First sequencial)
4. 📦 TRACK-016 - Sistema de Módulos (final da sprint)

**Definition of Done Sprint 02:**
- [ ] Mobile-First: 100% módulos responsivos, testados em devices reais
- [ ] Sistema de Módulos: Menu dinâmico funcional, apenas Dono gerencia

---

## 📌 Notas Importantes

- Todas as TRACKs concluídas foram movidas para `tracking_arq/TRACKING_Sprint_01.md`
- Este arquivo agora contém apenas o planejamento da Sprint atual e backlog
- Manter este arquivo enxuto e focado na sprint ativa
- Atualizar estatísticas após cada TRACK concluída
