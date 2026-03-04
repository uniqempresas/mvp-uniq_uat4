# 🟢 Tracking de Desenvolvimento - UNIQ - Sprint 11

**Sprint:** 11 - Configuração n8n + Beta Testers + Correção de Bugs  
**Período:** 01/03/2026 a 03/03/2026  
**Status:** ✅ CONCLUÍDO  
**Responsável:** AI Agent (NEO + Vibe Implementer)  
**Data de Conclusão:** 03/03/2026

---

## 🎯 Resumo Executivo

Sprint focada em configuração da integração WhatsApp (n8n), cadastro de empresas beta e correção de bugs críticos identificados nos testes E2E.

---

## ✅ Entregas Concluídas

### 1. Migrations do Banco de Dados (6/6) ✅

Todas as migrations foram aplicadas com sucesso:

| Migration | Descrição | Bug | Status |
|-----------|-----------|-----|--------|
| `20260305000001_add_observacoes_to_crm_leads` | Adicionar campo observacoes em crm_leads | #12 | ✅ |
| `20260305000002_add_soft_delete_to_me_servico` | Implementar soft delete em serviços | #11 | ✅ |
| `20260305000003_make_lead_cliente_optional` | Tornar lead_id e cliente_id opcionais | #13 | ✅ |
| `20260305000004_fix_fn_conta_rls` | Corrigir políticas RLS em fn_conta | #4 | ✅ |
| `20260305000005_create_caixa_on_company` | Trigger para criar conta CAIXA automaticamente | Onboarding | ✅ |
| `20260305000006_create_default_categories` | Trigger para criar categorias padrão | Onboarding | ✅ |

### 2. Correção de Bugs (5/5) ✅

- ✅ **Bug #4:** RLS fn_conta corrigido - políticas de INSERT/SELECT/UPDATE/DELETE criadas
- ✅ **Bug #5:** Onboarding melhorado com triggers para criar CAIXA e categorias automaticamente
- ✅ **Bug #11:** Soft delete implementado em me_servico (campo deleted_at + view me_servico_ativos)
- ✅ **Bug #12:** Campo observacoes adicionado à tabela crm_leads
- ✅ **Bug #13:** Constraint alterada para permitir oportunidades sem lead/cliente prévio

### 3. Cadastro de Empresas Beta ⚠️

**Status:** ❌ CANCELADO / REALIZAR VIA ONBOARDING

**Problema Identificado:**
As empresas foram criadas diretamente no banco de dados, mas sem o fluxo completo de onboarding:
- ❌ Sem vínculo com usuários do Supabase Auth
- ❌ Sem execução das triggers de onboarding
- ❌ Impossível acessar pelo sistema

**Empresas Criadas e Depois Removidas:**
- Gráfica Rápida Beta (ID: 0bd28334-5652-427c-b346-5a636efc8184) ❌ DELETADA
- Confecção Estilo Beta (ID: 1fd7464a-6519-4f12-9b8f-cb657e606c65) ❌ DELETADA

**Decisão:** As empresas beta devem ser criadas através do fluxo de onboarding normal do sistema para garantir:
- ✅ Vínculo correto com usuários autenticados
- ✅ Execução de todas as triggers (CAIXA, categorias, estágios do funil)
- ✅ Configuração completa do sistema

**Dados para Cadastro via Onboarding:**

**Gráfica Rápida Beta:**
- Nome Fantasia: `Gráfica Rápida Beta`
- CNPJ: `12.345.678/0001-90`
- Email: `contato@graficabeta.com`
- Telefone: `11999998888`
- Slug: `grafica-rapida-beta`
- Evolution Instance ID: `uniq-grafica-beta`

**Confecção Estilo Beta:**
- Nome Fantasia: `Confecção Estilo Beta`
- CNPJ: `98.765.432/0001-10`
- Email: `contato@confecaoestilo.com`
- Telefone: `11988887777`
- Slug: `confecao-estilo-beta`
- Evolution Instance ID: `uniq-confecao-beta`

### 4. Configuração n8n e Evolution API ⚠️

**Status:** PENDENTE / DOCUMENTADO

A configuração dos workflows n8n e instâncias Evolution API não foi executada automaticamente pois requer acesso a sistemas externos.

**Documentação Completa Disponível em:** `docs/SPRINT_11_N8N_EVOLUTION.md`

**Resumo da Configuração:**

#### Workflow de Recebimento (Evolution → Supabase)
```
Trigger: Webhook HTTP POST (evolution-receive)
↓
Transformar Payload (Code Node)
↓
Verificar Skip (IF Node) 
↓
Chamar Supabase Edge Function (/functions/v1/webhook-whatsapp)
↓
Responder 200 OK
```

#### Workflow de Envio (Supabase → Evolution)
```
Trigger: Webhook HTTP POST (send-whatsapp)
↓
Preparar Dados (Code Node)
↓
Evolution API - Enviar Mensagem
```

#### Variáveis de Ambiente n8n:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_URL=https://<project>.supabase.co
EVOLUTION_API_KEY=sua_chave_aqui
```

---

## 📋 Checklist de Testes Pendentes

### Testes WhatsApp (Pós-configuração n8n)
- [ ] Enviar mensagem de teste para Gráfica
- [ ] Verificar se aparece no CRM > Chat
- [ ] Responder pelo painel UNIQ
- [ ] Verificar se chega no WhatsApp
- [ ] Testar URA automática (palavras-chave: preço, horário, endereço)
- [ ] Testar mensagem de ausência (fora de horário)
- [ ] Testar respostas rápidas (/preco, /horario, etc.)

### Testes E2E (Bugs Corrigidos)
- [ ] Bug #4: Criar conta bancária sem erro RLS
- [ ] Bug #5: Comboboxes Financeiro carregam dados
- [ ] Bug #12: Cadastrar lead com observações
- [ ] Bug #13: Criar oportunidade sem lead prévio
- [ ] Bug #11: Deletar serviço (soft delete)

---

## 🐛 NOVOS BUGS IDENTIFICADOS

### Bug #15: Tabelas Financeiras sem ON DELETE CASCADE
- **Status:** 🔴 NOVO BUG
- **Prioridade:** ALTA
- **Módulo:** Banco de Dados - Integridade Referencial
- **Descrição:** Várias tabelas financeiras não possuem `ON DELETE CASCADE` na foreign key para `me_empresa`, impedindo a deleção de empresas e causando erro de violação de constraint.

**Tabelas Afetadas (sem CASCADE):**
- `fn_categoria` - Regra: NO ACTION
- `fn_conta` - Regra: NO ACTION
- `fn_movimento` - Regra: NO ACTION
- `me_cargo` - Regra: NO ACTION
- `me_forma_pagamento` - Regra: NO ACTION
- `me_horario_funcionamento` - Regra: NO ACTION

**Erro:**
```
ERROR: 23503: update or delete on table "me_empresa" violates foreign key 
constraint "fn_categoria_empresa_id_fkey" on table "fn_categoria"
```

**Impacto:**
- Impossível deletar empresas pelo sistema
- Necessário deletar manualmente registros dependentes primeiro
- Risco de dados órfãos no banco

**Solução Proposta:**
```sql
-- Alterar constraints para incluir ON DELETE CASCADE
ALTER TABLE fn_categoria 
DROP CONSTRAINT fn_categoria_empresa_id_fkey,
ADD CONSTRAINT fn_categoria_empresa_id_fkey 
  FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) 
  ON DELETE CASCADE;

-- Repetir para: fn_conta, fn_movimento, me_cargo, 
-- me_forma_pagamento, me_horario_funcionamento
```

**Responsável:** [DEFINIR PARA SPRINT 12]

---

## 📝 Lições Aprendidas

### 1. Importância do Onboarding Completo
**Problema:** Tentativa de criar empresas diretamente no banco falhou porque o fluxo de onboarding é essencial para:
- Criar vínculo Auth ↔ Usuário ↔ Empresa
- Executar triggers de configuração inicial
- Garantir integridade dos dados

**Solução:** Sempre usar o fluxo de onboarding para criar empresas, mesmo em ambiente de teste.

### 2. Verificar Constraints Antes de Deletar
**Problema:** Ao tentar deletar empresas criadas para teste, descobrimos que várias tabelas não têm CASCADE.

**Solução:** Criar script de deleção em ordem correta ou adicionar CASCADE às constraints.

### 3. Documentação de Configurações Externas
**Problema:** Configurações de n8n e Evolution API não podem ser automatizadas.

**Solução:** Manter documentação detalhada e atualizada para configuração manual.

---

## 🎯 Backlog para Sprint 12

### Prioridade ALTA
1. ✅ Configurar instâncias Evolution API (Gráfica e Confecção)
2. ✅ Configurar workflows n8n (recebimento e envio)
3. ✅ Cadastrar empresas beta via onboarding
4. ✅ Corrigir Bug #15 (ON DELETE CASCADE em tabelas financeiras)
5. ✅ Testar fluxo completo WhatsApp → CRM

### Prioridade MÉDIA
6. Executar testes E2E de regressão
7. Coletar feedback dos beta testers
8. Documentar troubleshooting comum

---

## 📁 Arquivos Relacionados

- [SPEC_Sprint_11.md](SPEC_Sprint_11.md) - Especificação técnica completa
- [PRD_Sprint_11.md](PRD_Sprint_11.md) - Documento de requisitos
- `docs/SPRINT_11_N8N_EVOLUTION.md` - Guia de configuração n8n
- `supabase/migrations/20260305*` - Migrations aplicadas

---

**Notas:**
- Sprint 11 concluída com sucesso na parte de backend/migrations
- Pendências: Configuração manual de n8n/Evolution e cadastro via onboarding
- Bug crítico #15 identificado e agendado para Sprint 12
