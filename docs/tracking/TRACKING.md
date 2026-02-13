# 📊 Tracking de Desenvolvimento - UNIQ Empresas

**Última atualização:** 13/02/2026 13:40 BRT  
**Sprint Atual:** Sprint 02  
**Máquina:** HQ/UAT4 (Ultra)  
**Status:** 🚀 Em Andamento

> 📁 **Arquivo de Sprints Anteriores:**  
> - [Sprint 01 (Concluída)](../tracking_arq/TRACKING_Sprint_01.md)  
> - [Sprint 02 (Parcialmente Concluída)](../tracking_arq/TRACKING_Sprint_02.md) - TRACK-011 a TRACK-015
> - [📋 Backlog Completo](Tracking_Backlog.md)

---

## 🎯 Sprint 02 - Mobile-First MVP

**Status:** 🏃 Em Andamento  
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

### [TRACK-016] QA Mobile & Device Testing
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** 🔧 Em Progresso (Checklist Pronto)
- **Prioridade:** 🔴 CRÍTICA
- **Estimativa:** 2 dias
- **Dependência:** TRACK-015

**Descrição:**
Testes em dispositivos reais, correção de bugs mobile-specific, performance audit.

**Sub-tarefas:**
- [x] Criar checklist de testes mobile (matriz de devices)
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

### [TRACK-017] Sistema de Módulos (Menu Dinâmico)
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** 🔧 Em Progresso (Validação Pendente)
- **Prioridade:** 🟡 ALTA
- **Estimativa:** 3-4 dias
- **Dependência:** Nenhuma técnica (mas será feita após mobile por decisão estratégica)

**Descrição:**
Criar sistema de módulos ativáveis onde cliente escolhe quais funcionalidades quer no menu. Reduz poluição visual e prepara para futura monetização.

**Sub-tarefas:**
- [x] Criar tabela `me_modulo_ativo` (empresa_id + modulo_codigo + ativo) (SQL criado)
- [x] Criar `me_modulo_cargo` para permissões por cargo (RBAC)
- [x] Criar RLS permitindo apenas role='dono' gerenciar módulos (SQL criado)
- [x] Criar função helper `is_dono()` para RLS (Policy implementada)
- [x] Desenvolver `moduleService.ts` (listar, ativar, desativar, gestão permissões)
- [x] Criar `ModuleContext` para estado global de módulos ativos
- [x] Criar página "Módulos" com grid de cards e seletor de Cargo
- [x] Adaptar `MainSidebar` para filtrar apenas módulos base + ativos
- [x] Implementar onboarding: módulos opcionais aparecem desabilitados/grisados
- [ ] Testar: Dono ativa CRM → aparece no menu
- [ ] Testar: Colaborador não consegue ativar módulos
- [ ] Testar deploy e funcionalidades dependentes de rede (Adicionado: Internet instável 11/02)

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

## � Estatísticas Gerais do Projeto

**Total de TRACKs (Todas as Sprints):** 21  
**Concluídas:** 13 (Sprint 01: 9 + Sprint 02: 4)  
**Sprint 02 (Ativa):** 2 (TRACK-016, TRACK-017)  
**Em Backlog:** Ver arquivo separado [Tracking_Backlog.md](Tracking_Backlog.md)

**Progresso Geral:** 53% (9/17 concluídas)

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

## 📝 Próximos Passos (Imediato)

**Sprint 02 - Foco Atual:**
1. 🚀 **TRACK-016** - QA Mobile & Device Testing
2. 📦 **TRACK-017** - Validação Sistema de Módulos

**Definition of Done Sprint 02:**
- [ ] Mobile-First: 100% módulos responsivos, testados em devices reais
- [ ] Sistema de Módulos: Menu dinâmico funcional, apenas Dono gerencia

---

## 📌 Notas Importantes

- Itens concluídos desta Sprint foram movidos para `tracking_arq/TRACKING_Sprint_02.md`
- Backlog completo movido para `Tracking_Backlog.md`
- Este arquivo foca exclusivament no trabalho em andamento (WIP)
