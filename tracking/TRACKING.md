# 🟢 Tracking de Desenvolvimento - UNIQ

**Última atualização:** 17/02/2026  
**Sprint Atual:** Sprint 07  
**Status:** 🔴 EM PROGRESSO  

> 📁 **Arquivos de Sprints Anteriores:**
> - [Sprint 06](tracking_arq/TRACKING_Sprint_06.md) (Concluído)
> - [Sprint 05](tracking_arq/TRACKING_Sprint_05.md) (Concluído)
> - [Sprint 04](tracking_arq/TRACKING_Sprint_04.md) (Concluído)
> - [Sprint 03](tracking_arq/TRACKING_Sprint_03.md) (Concluído)
>
> 📋 **Backlog Geral:**
> - [Backlog do Projeto](TRACKING_Backlog.md)
> - 📄 **PRD Sprint 07:** [research/PRD_Sprint_07.md](research/PRD_Sprint_07.md)

---

## 🎯 Sprint 07 - Correções Mobile Financeiro + Sistema de Vendas

**Período:** 17/02/2026 a 20/02/2026 (4 dias)  
**Status:** 🔴 EM PROGRESSO  
**Responsável:** AI Agent + Squad UNIQ  
**SPEC:** [research/PRD_Sprint_07.md](research/PRD_Sprint_07.md)

### 🎯 Objetivos
1. ✅ Corrigir layout mobile distorcido no módulo Financeiro
2. ✅ Implementar tela de Vendas/PDV completa
3. ✅ Criar função Supabase RPC `registrar_venda` integrada
4. ✅ Habilitar beta testers Gráfica e Confecção

### 🚧 Em Andamento

#### Dia 1 (17/02) - Correções Mobile Financeiro
- [ ] 🔴 Analisar componentes atuais do Financeiro
- [ ] 🔴 Criar componente KPICard responsivo
- [ ] 🔴 Ajustar grid do FinanceDashboard
- [ ] 🔴 Corrigir scroll horizontal em gráficos
- [ ] 📋 Testar em diferentes tamanhos de tela

#### Dia 2 (18/02) - Estrutura de Vendas
- [ ] 📋 Criar migration da função RPC `registrar_venda`
- [ ] 📋 Adicionar coluna `id_venda` em `me_contas_receber`
- [ ] 📋 Criar página SalesPage.tsx
- [ ] 📋 Criar componente ProductSearch.tsx
- [ ] 📋 Criar componente SaleCart.tsx

#### Dia 3 (19/02) - Lógica de Venda
- [ ] 📋 Criar componente CustomerSelector.tsx
- [ ] 📋 Criar componente PaymentSelector.tsx
- [ ] 📋 Implementar serviço salesService.ts
- [ ] 📋 Integrar com função RPC
- [ ] 📋 Testar fluxo completo de venda

#### Dia 4 (20/02) - Integração e Testes
- [ ] 📋 Atualizar rota em submenus.ts
- [ ] 📋 Adicionar rota no router
- [ ] 📋 Testar integração com Financeiro
- [ ] 📋 Testar em mobile
- [ ] 📋 Documentar uso da função RPC

---

## ✅ Concluído

### Pesquisa e Planejamento
- [x] ✅ Análise profunda do código existente
- [x] ✅ Identificação de gaps no fluxo beta
- [x] ✅ Documentação de problemas mobile
- [x] ✅ Criação do PRD detalhado
- [x] ✅ Definição de arquitetura da função RPC

---

## 🧪 Checklist de Validação (QA)

### Correções Mobile
- [ ] Dashboard visualiza corretamente em iPhone SE (375px)
- [ ] Cards de KPI empilham verticalmente sem cortar conteúdo
- [ ] Gráficos permitem scroll horizontal suave
- [ ] Tabela de demonstrativo é legível em mobile

### Sistema de Vendas
- [ ] Busca de produtos funciona corretamente
- [ ] Carrinho atualiza quantidades e totais automaticamente
- [ ] Venda registrada em `me_venda` com itens
- [ ] Conta a receber criada automaticamente
- [ ] Estoque decrementado corretamente
- [ ] Transação faz ROLLBACK em caso de erro
- [ ] Tela funciona perfeitamente em mobile

### Integração
- [ ] Rota `/sales` acessível pelo menu
- [ ] Integração com módulo Financeiro funcionando
- [ ] Beta testers conseguem realizar vendas

---

## 🎯 Métricas de Sucesso

| Métrica | Meta | Status |
|---------|------|--------|
| Tempo para registrar venda | < 2 min | 📋 Pendente |
| Taxa de erro no registro | < 1% | 📋 Pendente |
| Compatibilidade mobile | 100% | 📋 Pendente |
| Testes passando | > 90% | 📋 Pendente |

---

## 📝 Notas da Sprint

**17/02/2026 - Início**
- PRD criado com especificações detalhadas
- Problema mobile identificado: cards em grid 3 colunas sem responsividade
- Decisão: Criar função RPC para garantir atomicidade e permitir API externa futura
- Clientes beta definidos: Gráfica e Confecção

**Próxima Ação:** Iniciar correções mobile no FinanceDashboard.tsx

