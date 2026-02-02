# 📊 Tracking de Desenvolvimento - UNIQ Empresas

**Última atualização:** 31/01/2026 21:43 BRT  
**Máquina:** UNIQ + Ultra

---

## ✅ CONCLUÍDOS

### [TRACK-002] Cadastro de Usuários - Correção e Testes ✅
- **Responsável:** Dev
- **Máquina:** UNIQ + Ultra
- **Status:** ✅ Concluído
- **Início:** 31/01/2026 10:07
- **Conclusão:** 31/01/2026 12:51
- **Progresso:** 100%
- **Prioridade:** 🔴 CRÍTICA

**Descrição:**
Corrigir problemas no fluxo de cadastro de novos usuários e implementar RPC com dados iniciais.

**Sub-tarefas:**
- [x] Identificar problemas no fluxo atual (falta validações frontend)
- [x] Criar utils de validação (validators.ts, errorMessages.ts)
- [x] Implementar validações em Step1Personal (CPF, email, senha)
- [x] Implementar validações em Step2Company (CNPJ, CEP)
- [x] Melhorar tratamento de erros no Onboarding
- [x] Corrigir RPC criar_empresa_e_configuracoes_iniciais (schema correto)
- [x] Adicionar criação de dados iniciais (2 categorias + 3 produtos exemplo)
- [x] Adicionar CASCADE DELETE para me_empresa
- [x] Testar cadastro end-to-end (funcional!)

**Dependências:**
Nenhuma

**Observações:**
Cadastro funcional com validações robustas, RPC corrigida, dados iniciais automáticos (app não nasce vazio!), CASCADE delete implementado. 
**Limitação conhecida:** Email pode ficar bloqueado se cadastro falhar após auth.signUp (ver TRACK-009).

**Migrations aplicadas:**
- 20260131_fix_criar_empresa_rpc.sql
- 20260131_fix_criar_empresa_rpc_v2.sql (correção de schema)
- 20260131_add_cascade_delete_empresa.sql

---

### [TRACK-003] Separar CRM de "Minha Empresa" ✅
- **Responsável:** Dev
- **Máquina:** UNIQ + Ultra
- **Status:** ✅ Concluído
- **Início:** 31/01/2026 13:08
- **Conclusão:** 31/01/2026 13:30
- **Progresso:** 100%
- **Prioridade:** � ALTA

**Descrição:**
Separar CRM de dentro de "Minha Empresa", transformando-o em módulo independente.

**Sub-tarefas:**
- [x] Analisar estrutura atual (Minha Empresa continha CRM dentro)
- [x] Restaurar "Minha Empresa" como módulo default
- [x] Remover submenu CRM de dentro de "Minha Empresa"
- [x] Manter CRM como módulo separado no MainSidebar
- [x] Testar navegação completa

**Dependências:**
Nenhuma

**Observações:**
Separação concluída! Minha Empresa permanece como módulo default (Produtos, Serviços, Funcionários), CRM agora é módulo independente com rota própria `/crm` e sidebar dedicado.

**Arquivos modificados:**
- MainSidebar.tsx ("Minha Empresa" restaurado)
- SubSidebar.tsx (CRM removido de dentro, context dashboard restaurado)

---

## �📋 AGUARDANDO INÍCIO

### [TRACK-009] Rollback Completo de Cadastro com Edge Function
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando
- **Prioridade:** � ALTA (Pós-MVP)

**Descrição:**
Implementar Edge Function para garantir rollback 100% em caso de falha no cadastro, incluindo deleção de auth user.

**Problema Atual:**
Quando `auth.signUp()` funciona mas a RPC `criar_empresa_e_configuracoes_iniciais` falha, o email fica bloqueado permanentemente pois o frontend não pode deletar auth users (requer service role key).

**Solução Proposta:**
Criar Edge Function que:
1. Recebe dados do cadastro
2. Cria auth user (com service role key)
3. Chama RPC criar_empresa_e_configuracoes_iniciais
4. Se RPC falhar: **deleta auth user** automaticamente
5. Retorna sucesso/erro ao frontend

**Sub-tarefas:**
- [ ] Criar Edge Function `register-user-complete`
- [ ] Implementar lógica de criação de auth user
- [ ] Implementar chamada à RPC
- [ ] Implementar rollback completo (auth + RPC)
- [ ] Atualizar Onboarding.tsx para chamar Edge Function
- [ ] Testar cenários de falha
- [ ] Validar rollback 100%

**Dependências:**
Nenhuma (melhoria do TRACK-002)

**Observações:**
Solução ideal para produção. Para MVP, limitação atual é aceitável pois validações impedem maioria dos erros. Suporte pode intervir manualmente em casos raros.

**Referência:**
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Service Role Key: Ambiente seguro para operações admin

---

### [TRACK-004] Storefront - Catálogo Público Funcional
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando
- **Prioridade:** 🟡 ALTA

**Descrição:**
Desenvolver loja virtual pública com catálogo de produtos, carrinho e checkout via WhatsApp.

**Sub-tarefas:**
- [ ] Planejar arquitetura de página pública
- [ ] Criar página home do catálogo
- [ ] Implementar separação por categorias
- [ ] Criar página de detalhes do produto
- [ ] Implementar carrinho de compras
- [ ] Desenvolver fluxo de checkout
- [ ] Integrar botão "Finalizar no WhatsApp"
- [ ] Testar responsividade mobile
- [ ] Validar UX completo

**Dependências:**
Nenhuma

**Observações:**
3 dos 4 clientes MVP precisam desta feature. Sem método de pagamento - redireciona para WhatsApp com pedido formatado.

---

### [TRACK-005] Cadastro de Serviços - Conexão com Supabase
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando
- **Prioridade:** 🟡 ALTA

**Descrição:**
Conectar tela de cadastro de serviços (mockup pronto) ao Supabase.

**Sub-tarefas:**
- [ ] Revisar mockup existente
- [ ] Criar schema no Supabase (se não existir)
- [ ] Desenvolver service layer (servicesService.ts)
- [ ] Conectar tela ao Supabase
- [ ] Implementar CRUD completo
- [ ] Validar campos obrigatórios
- [ ] Testar integração

**Dependências:**
Nenhuma

**Observações:**
Layout já existe e está OK. Falta apenas conectar com backend.

---

### [TRACK-006] Cadastro de Clientes - Implementação Completa
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando
- **Prioridade:** 🟡 ALTA

**Descrição:**
Implementar cadastro completo de clientes com CPF/CNPJ, endereços e contatos.

**Sub-tarefas:**
- [ ] Planejar schema de banco de dados
- [ ] Criar tabela `clientes` no Supabase
- [ ] Desenvolver interface de cadastro
- [ ] Implementar campos: CPF/CNPJ, Endereços, Contatos
- [ ] Criar service layer (clientsService.ts)
- [ ] Implementar CRUD completo
- [ ] Testar validações

**Dependências:**
Nenhuma

**Observações:**
Feature ainda não iniciada. Base fundamental para CRM e vendas.

---

### [TRACK-007] Cadastro de Fornecedores - Implementação Completa
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando
- **Prioridade:** 🟢 MÉDIA

**Descrição:**
Implementar cadastro de fornecedores para gestão de compras e estoque.

**Sub-tarefas:**
- [ ] Planejar schema de banco de dados
- [ ] Criar tabela `fornecedores` no Supabase
- [ ] Desenvolver interface de cadastro
- [ ] Implementar campos: CNPJ, Razão Social, Contatos
- [ ] Criar service layer (suppliersService.ts)
- [ ] Implementar CRUD completo
- [ ] Testar validações

**Dependências:**
Nenhuma

**Observações:**
Feature ainda não iniciada. Necessário para gestão de compras.

---

### [TRACK-008] Cadastro de Colaboradores - Implementação com Auth
- **Responsável:** TBD
- **Máquina:** TBD
- **Status:** ⏸️ Aguardando
- **Prioridade:** 🟢 MÉDIA

**Descrição:**
Implementar cadastro de colaboradores com sistema de permissões e acesso diferenciado.

**Sub-tarefas:**
- [ ] Analisar schema existente no Supabase
- [ ] Planejar sistema de permissões
- [ ] Criar/validar tabela `colaboradores`
- [ ] Desenvolver interface de cadastro
- [ ] Implementar campos e permissões
- [ ] Criar sistema de convite/acesso
- [ ] Implementar níveis de permissão
- [ ] Criar service layer (employeesService.ts)
- [ ] Testar fluxo de criação e acesso

**Dependências:**
Nenhuma

**Observações:**
Colaborador também acessa o sistema - precisa auth diferenciado. Pode ter schema parcial no Supabase.

---

## ✅ CONCLUÍDO

### [TRACK-001] Sistema de Tracking de Desenvolvimento
- **Responsável:** Dev
- **Máquina:** UNIQ
- **Status:** ✅ Concluído
- **Início:** 31/01/2026
- **Conclusão:** 31/01/2026
- **Prioridade:** 🔴 CRÍTICA

**Descrição:**
Criar sistema robusto de tracking para coordenação de desenvolvimento entre máquinas Ultra e UNIQ.

**Sub-tarefas:**
- [x] Analisar sistema atual (Markdown)
- [x] Planejar solução avançada
- [x] Criar implementation_plan.md
- [x] Criar TRACKING.md
- [x] Criar CHANGELOG.md
- [x] Atualizar ROADMAP.md
- [x] Documentar workflow de uso (TRACKING_GUIDE.md)
- [x] Testar sincronização Git

**Entregáveis:**
- `docs/TRACKING.md` - Status detalhado de 8 tarefas
- `docs/CHANGELOG.md` - Histórico de mudanças
- `docs/TRACKING_GUIDE.md` - Guia de uso completo
- `docs/ROADMAP.md` - Atualizado com links
- 8 tarefas mapeadas (TRACK-001 a TRACK-008)

**Observações:**
Sistema implementado com sucesso. Base sólida para sincronização multi-máquina via Git.

---

## 🚫 BLOQUEADO

*(Vazio - nenhuma tarefa bloqueada)*

---

## 📝 Template de Nova Tarefa

```markdown
### [TRACK-XXX] Nome da Tarefa
- **Responsável:** [Nome/Máquina]
- **Máquina:** [Ultra/UNIQ/Ambas]
- **Status:** [🔴 Bloqueado / ⏸️ Aguardando / 🔧 Em Progresso / ✅ Concluído]
- **Início:** DD/MM/YYYY
- **Previsão:** DD/MM/YYYY
- **Progresso:** XX%
- **Prioridade:** [🔴 CRÍTICA / 🟡 ALTA / 🟢 MÉDIA / ⚪ BAIXA]

**Descrição:**
[Descrição breve da tarefa]

**Sub-tarefas:**
- [ ] Sub-tarefa 1
- [ ] Sub-tarefa 2

**Dependências:**
[TRACK-XXX ou "Nenhuma"]

**Observações:**
[Notas importantes, blockers, decisões]

**Último commit:** [hash ou mensagem]
```

---

## 📊 Estatísticas

**Total de Tarefas:** 9 (TRACK-001 a TRACK-009)  
**Concluídas:** 3 (TRACK-001, TRACK-002, TRACK-003)  
**Aguardando:** 6 (TRACK-004 a TRACK-009)  
**Em Progresso:** 0  
**Bloqueadas:** 0

**Progresso Geral:** 33.3% (3/9 concluídas)

**Destaques:**
- ✅ Sistema de Tracking implementado (TRACK-001)
- ✅ Cadastro de usuários funcional com RPC e dados iniciais (TRACK-002)
- ✅ CRM separado de Minha Empresa como módulo independente (TRACK-003)
- 📅 Próximo foco: Storefront (TRACK-004) ou Cadastro de Serviços (TRACK-005)

---

**Workflow de Atualização:**
1. Ao iniciar trabalho em uma tarefa → Atualizar data início + status
2. Durante desenvolvimento → Marcar sub-tarefas concluídas com [x]
3. Ao pausar/trocar de máquina → Atualizar "Observações"
4. Ao concluir → Mover para seção "CONCLUÍDOS" + atualizar data conclusão
5. Atualizar estatísticas ao concluir tarefas
6. Sempre fazer `git commit` + `git push` após atualizar este arquivo
