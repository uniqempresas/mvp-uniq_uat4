# 🟢 Tracking de Desenvolvimento - UNIQ

**Última atualização:** 03/03/2026  
**Sprint Atual:** Sprint 12  
**Status:** 🟡 EM ANDAMENTO

> 📁 **Arquivos de Sprints Anteriores:**
> - [Sprint 11](tracking_arq/TRACKING_Sprint_11.md) ✅ (Concluída - Migrations + Correção de Bugs)
> - [Sprint 10](tracking_arq/TRACKING_Sprint_10.md) ✅ (Concluída - Unificação CRM + Atendente)
> - [Sprint 09](tracking_arq/TRACKING_Sprint_09.md) ✅ (Concluída)
> - [Sprint 08](tracking_arq/TRACKING_Sprint_08.md) ✅ (Concluída)
> - [Sprint 07](tracking_arq/TRACKING_Sprint_07.md) ✅ (Concluída)
> - [Sprint 06](tracking_arq/TRACKING_Sprint_06.md) ✅ (Concluído)
> - [Sprint 05](tracking_arq/TRACKING_Sprint_05.md) ✅ (Concluído)
> - [Sprint 04](tracking_arq/TRACKING_Sprint_04.md) ✅ (Concluído)
> - [Sprint 03](tracking_arq/TRACKING_Sprint_03.md) ✅ (Concluído)
>
> 📋 **Backlog Geral:**
> - [Backlog do Projeto](TRACKING_Backlog.md)

---

## 🎯 Sprint 12 - Configuração WhatsApp + Testes Beta

**Período:** 03/03/2026 - [A DEFINIR]  
**Status:** 🟡 EM ANDAMENTO  
**Responsável:** AI Agent + Configuração Manual (n8n/Evolution)  
**Objetivo Principal:** Finalizar configuração do WhatsApp (n8n + Evolution), cadastrar empresas beta via onboarding e transformar Vendas & PDV em módulo opcional

### 🎯 Objetivos Principais
1. [ ] **n8n:** Configurar workflows de recebimento e envio de mensagens
2. [ ] **EVOLUTION:** Criar e conectar instâncias WhatsApp (Gráfica e Confecção)
3. [ ] **ONBOARDING:** Cadastrar empresas beta pelo fluxo correto do sistema
4. [ ] **TESTES:** Testar fluxo completo WhatsApp ↔ CRM
5. [ ] **FEEDBACK:** Coletar feedback dos beta testers
6. [x] **BUG #15:** Corrigir ON DELETE CASCADE em tabelas financeiras
7. [ ] **MÓDULO VENDAS & PDV:** Configurar como módulo opcional (não ativado por padrão)
8. [ ] **UX LOGIN:** Adicionar ícone de visualizar senha no formulário de login
9. [ ] **ONBOARDING CNPJ:** Permitir cadastro sem CNPJ (toggle "não possuo CNPJ")
10. [ ] **IMPORTAÇÃO MASSIVA:** Template Excel + interface para importar produtos e clientes
11. [ ] **AJUSTE DE BORDAS:** Revisar layout e reduzir bordas arredondadas excessivas
12. [ ] **DUPLICAR PRODUTOS:** Funcionalidade para clonar produtos existentes + auto-gerar SKU/código de barras
13. [ ] **TIPO ESTOQUE:** Campo tipo_estoque em produtos (revenda/produção/serviço) com CMV
14. [ ] **FILTRO CATEGORIA:** Corrigir combobox de categoria no cadastro de produtos

---

## 🔴 CRÍTICO - Configuração WhatsApp

### 1.1 Criar Instâncias Evolution API

**Gráfica Rápida Beta:**
```bash
curl -X POST https://sua-evolution-api.com/instance/create \
  -H "apikey: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "uniq-grafica-beta",
    "token": "token-unico-para-grafica",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

**Confecção Estilo Beta:**
```bash
curl -X POST https://sua-evolution-api.com/instance/create \
  -H "apikey: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "uniq-confecao-beta",
    "token": "token-unico-para-confecao",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

### 1.2 Configurar Webhooks Evolution

Para cada instância, configurar webhook:
```bash
curl -X POST https://sua-evolution-api.com/webhook/set/{{instance_name}} \
  -H "apikey: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://n8n.uniq.com/webhook/evolution-receive",
    "events": ["MESSAGES_UPSERT"],
    "webhook_by_events": false,
    "webhook_base64": false
  }'
```

### 1.3 Workflows n8n

**Status:** 🔴 PENDENTE - Seguir documentação em `docs/SPRINT_11_N8N_EVOLUTION.md`

| Empresa | Instance ID | Status Evolution | Status n8n |
|---------|-------------|------------------|------------|
| Gráfica | uniq-grafica-beta | 🔴 Pendente | 🔴 Pendente |
| Confecção | uniq-confecao-beta | 🔴 Pendente | 🔴 Pendente |

---

## 🟡 ALTO - Cadastro Empresas Beta

### Dados para Onboarding

**Gráfica Rápida Beta:**
- Nome Fantasia: `Gráfica Rápida Beta`
- CNPJ: `12.345.678/0001-90`
- Email: `contato@graficabeta.com`
- Telefone: `11999998888`
- Slug: `grafica-rapida-beta`

**Confecção Estilo Beta:**
- Nome Fantasia: `Confecção Estilo Beta`
- CNPJ: `98.765.432/0001-10`
- Email: `contato@confecaoestilo.com`
- Telefone: `11988887777`
- Slug: `confecao-estilo-beta`

### Checklist Pós-Onboarding

**Para cada empresa:**
- [ ] Configurar `crm_chat_config` (CRM > Configurações do Agente)
- [ ] Cadastrar respostas rápidas (CRM > Respostas Rápidas)
- [ ] Configurar Evolution instance_id
- [ ] Cadastrar produtos/serviços
- [ ] Configurar categorias financeiras (se necessário)
- [ ] Testar login do usuário administrador

---

## 🔴 CRÍTICO - Bug #15: ON DELETE CASCADE

### Problema
Várias tabelas financeiras não possuem `ON DELETE CASCADE`, impedindo deleção de empresas.

### Tabelas a Corrigir
- [ ] `fn_categoria`
- [ ] `fn_conta`
- [ ] `fn_movimento`
- [ ] `me_cargo`
- [ ] `me_forma_pagamento`
- [ ] `me_horario_funcionamento`

### Script de Correção
```sql
-- Exemplo para fn_categoria
ALTER TABLE fn_categoria 
DROP CONSTRAINT IF EXISTS fn_categoria_empresa_id_fkey,
ADD CONSTRAINT fn_categoria_empresa_id_fkey 
  FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) 
  ON DELETE CASCADE;

-- Repetir para as outras tabelas...
```

---

## 📋 Checklist de Testes

### Testes WhatsApp
- [ ] Enviar mensagem para Gráfica → Aparece no CRM
- [ ] Enviar mensagem para Confecção → Aparece no CRM
- [ ] Responder pelo CRM → Chega no WhatsApp
- [ ] Testar URA (palavras-chave: preço, horário, endereço)
- [ ] Testar fora de horário → Mensagem de ausência
- [ ] Testar respostas rápidas (/preco, /horario, etc.)

### Testes E2E (Bugs Corrigidos na Sprint 11)
- [ ] Bug #4: Criar conta bancária
- [ ] Bug #5: Comboboxes Financeiro carregam dados
- [ ] Bug #12: Cadastrar lead com observações
- [ ] Bug #13: Criar oportunidade sem lead prévio
- [ ] Bug #11: Soft delete de serviços

---

## ✅ Concluído (Sprint 11)

### Sprint 11 - Migrations + Correção de Bugs (03/03/2026) ✅

**Entregues:**
- ✅ 6 Migrations aplicadas (bugs corrigidos)
- ✅ Bug #4: RLS fn_conta
- ✅ Bug #5: Onboarding melhorado (CAIXA + categorias)
- ✅ Bug #11: Soft delete em serviços
- ✅ Bug #12: Campo observacoes em crm_leads
- ✅ Bug #13: Oportunidade sem lead/cliente
- ✅ Documentação n8n completa
- ⚠️ Empresas beta criadas e removidas (devem ser via onboarding)
- ⚠️ Configuração n8n/Evolution pendente (requer acesso externo)

**Arquivo completo:** [TRACKING_Sprint_11.md](tracking_arq/TRACKING_Sprint_11.md)

---

## 🟢 MÉDIO - Configurar Vendas & PDV como Módulo Opcional

### Contexto
O módulo **Vendas & PDV** (Sistema de Vendas/Ponto de Venda) foi desenvolvido na Sprint 08 e está funcional, mas atualmente não é um módulo selecionável. Todas as empresas têm acesso automaticamente.

### Objetivo
Transformar o módulo Vendas & PDV em um módulo **opcional** que precisa ser ativado manualmente, similar aos outros módulos do sistema.

### Checklist
- [ ] Adicionar `vendas_pdv` na tabela de módulos disponíveis
- [ ] Criar migration para marcar módulo como opcional no onboarding
- [ ] Atualizar menu/rotas para só mostrar quando ativado
- [ ] Testar ativação/desativação pelo painel administrativo
- [ ] Documentar para usuários finais

### Notas
- **Prioridade:** Média (não bloqueia os testes beta)
- **Impacto:** Permite empresas optarem por não usar o PDV se não for necessário

---

## 🟡 MÉDIO - Onboarding Sem CNPJ (Acessibilidade)

### Contexto
Nosso público-alvo são **empreendedores na correria** que muitas vezes ainda não possuem CNPJ por falta de instrução ou burocracia. Atualmente o sistema exige CNPJ obrigatoriamente no cadastro, o que cria barreira de entrada.

### Objetivo
Permitir que empreendedores **sem CNPJ** possam se cadastrar e começar a usar o sistema. O CNPJ pode ser adicionado posteriormente quando o parceiro estiver mais maduro no processo.

### Implementação
- [ ] Adicionar toggle/botão "Não possuo CNPJ" no formulário de cadastro
- [ ] Tornar campo CNPJ opcional na tabela `me_empresa`
- [ ] Adicionar validação condicional (CNPJ OU nome fantasia obrigatório)
- [ ] Criar fluxo de "completar cadastro" para adicionar CNPJ depois
- [ ] Adicionar tooltip/educativo: "Você pode usar o sistema agora e adicionar o CNPJ quando formalizar seu negócio"

### Notas
- **Prioridade:** Média-Alta (remove barreira de entrada)
- **Impacto:** Aumenta conversão de cadastro para empreendedores informais
- **Educação:** Sistema deve incentivar (não obrigar) formalização futura

---

## 🟢 BAIXO - UX: Ícone de Visualizar Senha no Login

### Contexto
Melhoria simples de UX no formulário de login para permitir usuários verem a senha digitada.

### Implementação
- [ ] Adicionar ícone de olho (👁️) no campo de senha do login
- [ ] Toggle entre mostrar/ocultar senha
- [ ] Ícone do Lucide React (Eye / EyeOff)

### Notas
- **Prioridade:** Baixa (melhoria de UX)
- **Complexidade:** Muito baixa - alteração simples no componente de login

---

## 🐛 Backlog de Bugs

### Bug #15: ON DELETE CASCADE em Tabelas Financeiras (RESOLVIDO)
- **Status:** ✅ RESOLVIDO
- **Prioridade:** ALTA
- **Sprint:** 12
- **Descrição:** Tabelas fn_categoria, fn_conta, fn_movimento, me_cargo, me_forma_pagamento, me_horario_funcionamento, agd_agendamentos, est_compra_item e outras não tinham ON DELETE CASCADE
- **Impacto:** Impossível deletar empresas
- **Solução:** 3 migrations aplicadas alterando constraints para incluir ON DELETE CASCADE
- **Tabelas corrigidas:** 30+ constraints em tabelas financeiras, estoque, CRM, vendas e agendamentos

### Bug #4, #5, #11, #12, #13 (Corrigidos na Sprint 11)
- **Status:** ✅ RESOLVIDOS
- **Detalhes:** Ver TRACKING_Sprint_11.md

### Bugs Anteriores (do backlog)
- Ver arquivo completo de backlog para bugs de sprints anteriores

---

## 🎯 Próximas Ações

### ✅ Concluídos
1. ~~**Aplicar migration Bug #15**~~ (ON DELETE CASCADE) - 3 migrations aplicadas com sucesso

### 🔄 Pendentes

#### 🔴 CRÍTICO (Configuração Externa)
1. **Configurar n8n** (seguir documentação em docs/)
2. **Criar instâncias Evolution** para Gráfica e Confecção
3. **Cadastrar empresas via onboarding** (não direto no banco)
4. **Testar fluxo completo** de mensagens WhatsApp
5. **Coletar feedback** dos beta testers

#### 🟡 MÉDIO (Melhorias & Bugs)
6. **Configurar Vendas & PDV** como módulo opcional
7. **Onboarding sem CNPJ** (toggle "não possuo CNPJ")
8. **UX Login:** Ícone de visualizar senha
9. **Ajuste de bordas:** Revisar layout e modernizar bordas arredondadas
10. **Tipo Estoque:** Campo tipo_estoque em produtos com comportamento financeiro

#### 🔵 ALTO (Importação Massiva - Bloqueia Clientes Beta)
11. **Importação Massiva:** Criar template Excel e interface web
    - Prioridade máxima para Gráfica (produtos) e Confecção (clientes)

#### 🟡 MÉDIO (Facilita Cadastro Mobile)
12. **Duplicar Produtos:** Funcionalidade de clonar + auto-gerar SKU/código de barras
    - Alternativa para quem não tem acesso ao Excel/computador

#### 🟢 BAIXO (UX Simples)
13. **Ícone visualizar senha** no formulário de login

#### 🟢 BAIXO (Bug Simples)
14. **Filtro de categoria:** Corrigir combobox que não busca dados reais do banco

---

## 🔵 ALTO - Importação Massiva via Planilha Excel

### Contexto Detalhado

**Necessidade Real:**
- **Cliente 1 (Gráfica Rápida Beta):** Migração de sistema antigo com 500+ produtos. Cadastrar um a um é inviável.
- **Cliente 2 (Confecção Estilo Beta):** Lista de 200+ contatos de clientes em Excel. Precisa importar tudo de uma vez.

**Por que isso é crítico:**
- Barreira de adoção: Empresas não migram se tiverem que recadastrar tudo manualmente
- Concorrência: Outros ERPs oferecem importação em massa
- Oportunidade: Facilita substituição de planilhas desorganizadas por UNIQ

**Visão Futura (Melissa/Agente IA):**
Através do WhatsApp, a Melissa poderá:
- Receber: "Melissa, quero cadastrar meus produtos"
- Responder: "Me envie sua planilha ou preencha esse modelo"
- Processar: Receber arquivo Excel e importar automaticamente
- Para já: Implementação via interface web primeiro

---

### FASE 1: Estrutura do Template Excel (PRIORIDADE ALTA)

**Arquivo:** `template_importacao_uniq.xlsx`

#### ABA 1: Produtos (OBRIGATÓRIO para Cliente 1)
Colunas obrigatórias marcadas com *

| Coluna | Tipo | Obrigatório | Exemplo | Descrição |
|--------|------|-------------|---------|-----------|
| nome_produto* | Texto | SIM | Cartão de Visita | Nome do produto |
| preco* | Número | SIM | 50.00 | Preço de venda |
| preco_custo | Número | NÃO | 25.00 | Custo de produção |
| estoque_atual | Inteiro | NÃO | 100 | Quantidade em estoque |
| sku | Texto | NÃO | CART-VIS-001 | Código interno |
| categoria | Texto | NÃO | Gráficos | Nome da categoria (cria se não existir) |
| descricao | Texto | NÃO | Cartão 9x5cm | Descrição completa |
| codigo_barras | Texto | NÃO | 789123456 | Código de barras GTIN |

#### ABA 2: Clientes (OBRIGATÓRIO para Cliente 2)
Colunas obrigatórias marcadas com *

| Coluna | Tipo | Obrigatório | Exemplo | Descrição |
|--------|------|-------------|---------|-----------|
| nome_cliente* | Texto | SIM | João Silva | Nome completo |
| telefone | Texto | NÃO | 11999998888 | Com DDD, apenas números |
| email | Texto | NÃO | joao@email.com | Email válido |
| cpf_cnpj | Texto | NÃO | 123.456.789-00 | CPF ou CNPJ |
| endereco | Texto | NÃO | Rua ABC, 123 | Endereço completo |
| cidade | Texto | NÃO | São Paulo | Cidade |
| estado | Texto | NÃO | SP | Sigla do estado |
| observacoes | Texto | NÃO | Cliente VIP | Anotações internas |

#### ABA 3: Serviços (OPCIONAL - Fase 2)
**Status:** 🟡 Em desenvolvimento - Não implementar agora

| Coluna | Tipo | Obrigatório | Exemplo |
|--------|------|-------------|---------|
| nome_servico | Texto | SIM | Consultoria |
| preco | Número | SIM | 150.00 |
| duracao_minutos | Inteiro | NÃO | 60 |
| categoria | Texto | NÃO | Serviços |
| descricao | Texto | NÃO | Atendimento personalizado |

#### ABA 4: Fornecedores (OPCIONAL - Fase 2)
**Status:** 🟡 Em desenvolvimento - Não implementar agora

| Coluna | Tipo | Obrigatório | Exemplo |
|--------|------|-------------|---------|
| nome_fornecedor | Texto | SIM | Papelaria XYZ |
| cnpj | Texto | NÃO | 12.345.678/0001-90 |
| telefone | Texto | NÃO | 1188887777 |
| email | Texto | NÃO | contato@xyz.com |

#### ABA 5: Cargos (OPCIONAL - Fase 2)
**Status:** 🟡 Em desenvolvimento - Não implementar agora

| Coluna | Tipo | Obrigatório |
|--------|------|-------------|
| nome_cargo | Texto | SIM |
| descricao | Texto | NÃO |

#### ABA 6: Colaboradores (OPCIONAL - Fase 2)
**Status:** 🟡 Em desenvolvimento - Não implementar agora

| Coluna | Tipo | Obrigatório |
|--------|------|-------------|
| nome_usuario | Texto | SIM |
| email | Texto | SIM |
| cargo | Texto | NÃO |
| telefone | Texto | NÃO |

---

### FASE 2: Interface Web de Importação

**Localização:** Menu Configurações > Importação de Dados

#### Componentes Frontend:

**1. TELA PRINCIPAL (`ImportacaoMassivaPage.tsx`)**
```
┌─────────────────────────────────────────────────────────┐
│  📥 IMPORTAÇÃO DE DADOS                                 │
│                                                          │
│  [📄 Baixar Template Excel]  ← Botão primário          │
│                                                          │
│  ─── ou ───                                              │
│                                                          │
│  [Arraste seu arquivo Excel aqui]                       │
│  ou clique para selecionar                              │
│                                                          │
│  Formatos aceitos: .xlsx, .xls (máx 5MB)               │
│                                                          │
│  ⚠️ Atenção: Esta ação não pode ser desfeita           │
└─────────────────────────────────────────────────────────┘
```

**2. TELA DE VALIDAÇÃO (`ImportacaoPreview.tsx`)**
```
┌─────────────────────────────────────────────────────────┐
│  📊 PREVIEW DA IMPORTAÇÃO                               │
│                                                          │
│  ✅ Produtos: 150 registros válidos                     │
│  ⚠️ Produtos: 10 registros com avisos                  │
│  ❌ Produtos: 5 registros com erros                     │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ TABELA DE PREVIEW (primeiros 10 registros)         ││
│  │ Nome          │ Preço   │ Estoque │ Status         ││
│  │ Cartão Visita │ R$ 50   │ 100     │ ✅ Válido      ││
│  │ Panfleto      │ R$ 30   │ -       │ ⚠️ Sem estoque ││
│  │ Produto X     │ -       │ 50      │ ❌ Sem preço   ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  [❌ Cancelar]        [⚠️ Importar válidos apenas]      │
│                       [✅ Importar todos (ignorar erros)]│
└─────────────────────────────────────────────────────────┘
```

**3. TELA DE RESULTADO (`ImportacaoResultado.tsx`)**
```
┌─────────────────────────────────────────────────────────┐
│  ✅ IMPORTAÇÃO CONCLUÍDA                                │
│                                                          │
│  📊 Resumo:                                              │
│  • 150 produtos importados com sucesso                  │
│  • 10 produtos ignorados (sem preço)                    │
│  • 5 produtos com erro (não importados)                 │
│                                                          │
│  [📥 Download relatório completo (CSV)]                 │
│                                                          │
│  ❌ ERROS ENCONTRADOS:                                  │
│  Linha 45: "Produto ABC" - Preço inválido               │
│  Linha 67: "Produto XYZ" - SKU duplicado                │
│                                                          │
│  [🔄 Tentar novamente]  [✅ Concluir]                   │
└─────────────────────────────────────────────────────────┘
```

#### Serviços Frontend:

**`importacaoService.ts`:**
```typescript
- uploadPlanilha(file: File): Promise<UploadResponse>
- validarDados(empresaId: string, dados: any[]): Promise<ValidacaoResponse>
- importarProdutos(empresaId: string, produtos: Produto[]): Promise<ImportacaoResult>
- importarClientes(empresaId: string, clientes: Cliente[]): Promise<ImportacaoResult>
- gerarTemplate(): Blob  // Download do Excel modelo
```

---

### FASE 3: Backend (Edge Functions)

**Edge Function:** `supabase/functions/importar-dados/index.ts`

#### Processo:

```typescript
1. RECEBER ARQUIVO
   - Upload temporário (Storage)
   - Validação de formato e tamanho
   
2. PARSER EXCEL
   - Biblioteca: xlsx (sheetjs)
   - Ler cada aba separadamente
   - Mapear colunas para schema
   
3. VALIDAÇÃO
   - Verificar campos obrigatórios
   - Validar tipos (preço é número, etc)
   - Verificar duplicatas (SKU, email)
   - Validar CPF/CNPJ
   - Verificar categorias (cria automaticamente se não existir)
   
4. IMPORTAÇÃO EM BATCH
   - Processar em lotes de 100 registros
   - Transaction atômica (rollback em caso de erro)
   - Barra de progresso via WebSocket (futuro)
   
5. RELATÓRIO
   - Retornar JSON com sucessos/erros
   - Gerar CSV de erros para download
```

#### Validações Específicas:

**Produtos:**
- ✅ nome_produto: obrigatório, mínimo 2 caracteres
- ✅ preco: obrigatório, número > 0
- ⚠️ estoque: número >= 0 (avisa se zerado)
- ⚠️ sku: único por empresa (avisa se duplicado)
- ℹ️ categoria: cria automaticamente se não existir

**Clientes:**
- ✅ nome_cliente: obrigatório
- ⚠️ email: válido e único (avisa se duplicado)
- ⚠️ telefone: apenas números, 10-11 dígitos
- ℹ️ cpf_cnpj: validar dígitos verificadores

---

### FASE 4: Fluxo Melissa (Futuro - WhatsApp)

**Conversa Típica:**
```
Usuário: "Melissa, preciso cadastrar meus produtos"

Melissa: "Claro! Você tem uma planilha com os produtos? 
          Posso te ajudar a importar tudo de uma vez.
          
          Me envie o arquivo Excel ou baixe nosso template:
          [📄 Template Importação]"

[Usuário envia arquivo]

Melissa: "📊 Recebi sua planilha! Encontrei 150 produtos.
          
          ✅ 140 produtos prontos para importar
          ⚠️ 10 produtos sem preço (serão ignorados)
          
          Posso importar agora? (sim/não)"

Usuário: "sim"

Melissa: "✅ Importação concluída! 
          140 produtos cadastrados com sucesso!
          
          ❌ 10 produtos não importados:
          - Produto ABC (sem preço)
          - Produto XYZ (código duplicado)
          
          Quer que eu te envie a lista dos que faltam?"
```

---

### CHECKLIST DE IMPLEMENTAÇÃO

#### Sprint 12 (Atual) - Fase 1: Produtos + Clientes
- [ ] Criar template Excel modelo (`template_importacao_uniq.xlsx`)
- [ ] Criar página ImportacaoMassivaPage.tsx
- [ ] Criar componente UploadPlanilha.tsx (drag & drop)
- [ ] Criar componente PreviewTabela.tsx
- [ ] Criar service importacaoService.ts
- [ ] Criar Edge Function importar-dados/index.ts
- [ ] Implementar parser Excel (biblioteca xlsx)
- [ ] Implementar validações de produtos
- [ ] Implementar validações de clientes
- [ ] Implementar importação em batch
- [ ] Criar relatório de erros em CSV
- [ ] Testar com dados da Gráfica (produtos)
- [ ] Testar com dados da Confecção (clientes)

#### Sprint 13+ (Futuro) - Fase 2: Demais Entidades
- [ ] Adicionar aba Serviços
- [ ] Adicionar aba Fornecedores
- [ ] Adicionar aba Cargos
- [ ] Adicionar aba Colaboradores

#### Sprint 15+ (Futuro) - Fase 3: Melissa WhatsApp
- [ ] Criar handler de arquivo no webhook
- [ ] Integrar Edge Function com conversa
- [ ] Permitir upload via WhatsApp
- [ ] Responder com resumo da importação

---

### NOTAS TÉCNICAS

**Bibliotecas Necessárias:**
```json
{
  "dependencies": {
    "xlsx": "^0.18.5"  // Para parse Excel no frontend e backend
  }
}
```

**Limitações:**
- Máximo 5MB por arquivo
- Máximo 5000 registros por importação
- Apenas .xlsx e .xls
- Timeout de 30 segundos para Edge Function

**Segurança:**
- Validar empresa_id no token JWT
- Sanitizar todos os inputs
- Não expor dados de outras empresas
- Log de todas as importações (auditoria)

---

### PRIORIDADE E IMPACTO

- **Prioridade:** 🔵 ALTA (bloqueia adoção pelos 2 clientes beta)
- **Impacto:** Permite migração de sistemas legados e planilhas
- **Complexidade:** Média (3-5 dias de trabalho)
- **Dependências:** Nenhuma (pode ser feito em paralelo com n8n)

---

## 🟡 MÉDIO - Campo Tipo de Estoque em Produtos

### Contexto

Para controle financeiro correto e preparação para o futuro módulo de estoque/produção, produtos precisam indicar como sua venda afeta o financeiro e o estoque.

**Cenário 1 - Revenda (Mercadoria):**
- Empresa compra por R$ 60 → vende por R$ 100
- Financeiro: Entrada R$ 100 (Conta a Receber) + Saída R$ 60 (Conta a Pagar - CMV)
- Estoque: Baixa simples do item
- **Importante:** CMV gerado como Conta a Pagar com status **PENDENTE** (pode precisar de ajuste, desconto, etc.)

**Cenário 2 - Produção (Produto Acabado):**
- Empresa produz a peça (insumos do estoque)
- Financeiro: Entrada R$ 100 (venda)
- Estoque: Baixa dos insumos utilizados na produção
- CMV = custo dos insumos consumidos
- **Para já:** Apenas registra venda, aguarda módulo de produção para baixa de insumos

**Cenário 3 - Serviço:**
- Apenas entrada financeira, sem estoque

---

### Implementação

#### Migration:
```sql
-- Adicionar campo na tabela me_produto
ALTER TABLE me_produto 
ADD COLUMN tipo_estoque VARCHAR(20) DEFAULT 'revenda';

-- Adicionar constraint de valores permitidos
ALTER TABLE me_produto 
ADD CONSTRAINT chk_tipo_estoque 
CHECK (tipo_estoque IN ('revenda', 'producao', 'servico'));

-- Criar índice para performance em filtros
CREATE INDEX idx_produto_tipo_estoque 
ON me_produto(empresa_id, tipo_estoque);
```

#### Comportamento na Venda (RPC registrar_venda):

```typescript
// Ao registrar venda:
if (produto.tipo_estoque === 'revenda') {
  // 1. Criar conta a receber (entrada) - status: pendente
  // 2. Criar conta a pagar (CMV - custo da mercadoria) - status: PENDENTE
  //    Justificativa: pode precisar de ajuste, desconto, etc.
  // 3. Baixar estoque do produto (quando tivermos módulo de estoque)
} else if (produto.tipo_estoque === 'producao') {
  // 1. Criar conta a receber (entrada) - status: pendente
  // 2. POR ENQUANTO: apenas registra venda, sem CMV automático
  //    FUTURO: Baixar insumos do estoque e calcular CMV real
} else if (produto.tipo_estoque === 'servico') {
  // 1. Apenas criar conta a receber - status: pendente
  // 2. Sem movimentação de estoque
}
```

#### Frontend:

**No Cadastro de Produto:**
- Campo select: "Tipo de Estoque"
- Opções: Revenda | Produção | Serviço
- Default: "Revenda"
- Tooltip: "Revenda: gera CMV automático | Produção: aguarda módulo de produção | Serviço: sem estoque"

**Na Edição de Produto:**
- Campo deve estar **visível mas NÃO EDITÁVEL** (read-only/disabled)
- Mostrar badge com o tipo atual
- Tooltip: "Tipo de estoque não pode ser alterado após criação"
- Motivo: evitar inconsistências financeiras em vendas já realizadas

**Interface:**
```tsx
// Cadastro (editável)
<div className="space-y-2">
  <Label htmlFor="tipo_estoque">Tipo de Estoque</Label>
  <Select 
    value={tipoEstoque} 
    onValueChange={setTipoEstoque}
    defaultValue="revenda"
  >
    <SelectTrigger>
      <SelectValue placeholder="Selecione o tipo" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="revenda">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Revenda (Mercadoria)
        </div>
      </SelectItem>
      <SelectItem value="producao">
        <div className="flex items-center gap-2">
          <Factory className="h-4 w-4" />
          Produção (Produto Acabado)
        </div>
      </SelectItem>
      <SelectItem value="servico">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Serviço
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
  <p className="text-xs text-gray-500">
    Define como a venda afeta financeiro e estoque
  </p>
</div>

// Edição (não editável)
<div className="space-y-2">
  <Label>Tipo de Estoque</Label>
  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
    {tipoEstoque === 'revenda' && <Package className="h-4 w-4" />}
    {tipoEstoque === 'producao' && <Factory className="h-4 w-4" />}
    {tipoEstoque === 'servico' && <Wrench className="h-4 w-4" />}
    <span className="capitalize">{tipoEstoque}</span>
    <Badge variant="secondary" className="ml-auto">Não editável</Badge>
  </div>
  <p className="text-xs text-gray-500">
    Tipo não pode ser alterado após criação do produto
  </p>
</div>
```

#### Produtos com Variações:
- Cada variação **herda** o `tipo_estoque` do produto pai
- Não é possível ter variações com tipos diferentes do produto principal
- Campo não aparece no formulário de variação

---

### Checklist de Implementação

#### Backend:
- [ ] Migration: adicionar campo `tipo_estoque` na tabela `me_produto`
- [ ] Atualizar RPC `registrar_venda` para considerar o tipo_estoque
- [ ] Implementar geração de CMV como Conta a Pagar (status PENDENTE) para tipo 'revenda'
- [ ] Criar função para calcular CMV baseado no preco_custo do produto
- [ ] Adicionar constraint CHECK para valores permitidos
- [ ] Criar índice para performance

#### Frontend:
- [ ] Adicionar campo select "Tipo de Estoque" no formulário de cadastro de produto
- [ ] Mostrar campo como read-only na edição de produto
- [ ] Adicionar ícones visuais para cada tipo (Package, Factory, Wrench)
- [ ] Adicionar tooltips explicativos
- [ ] Remover campo do formulário de variações (herda do pai)
- [ ] Atualizar service de produto para incluir tipo_estoque

#### UX/UI:
- [ ] Badge visual no card do produto mostrando o tipo
- [ ] Legenda explicativa na tela de produtos
- [ ] Documentação interna sobre comportamento financeiro

#### Testes:
- [ ] Testar venda de produto tipo revenda (deve gerar Conta a Receber + Conta a Pagar CMV)
- [ ] Verificar se CMV fica com status PENDENTE
- [ ] Testar venda de produto tipo produção (apenas Conta a Receber)
- [ ] Testar venda de serviço (apenas Conta a Receber)
- [ ] Verificar se campo fica não-editável na edição
- [ ] Testar herança em produtos com variações

---

### Notas Técnicas

**CMV - Custo da Mercadoria Vendida:**
- Gerado automaticamente para produtos tipo 'revenda'
- Valor = preco_custo do produto (se preenchido)
- Status PENDENTE permite ajustes antes do pagamento efetivo
- Categoria financeira: "CMV" ou "Custo das Vendas"

**Compatibilidade Futura:**
- Quando tivermos módulo de produção, tipo 'producao' passará a baixar insumos
- Estrutura já preparada para evoluir sem breaking changes

**Validações:**
- Produto tipo 'revenda' deve ter preco_custo preenchido (aviso se vazio)
- Não permitir alterar tipo após produto ter vendas registradas

---

### Prioridade e Impacto

- **Prioridade:** 🟡 MÉDIA (preparação para módulo de estoque)
- **Impacto:** Controle financeiro mais preciso e base para estoque futuro
- **Complexidade:** Média (alterações em RPC de vendas)
- **Dependências:** Funciona sem módulo de estoque completo
- **Bloqueante:** Não bloqueia clientes beta, mas melhora precisão financeira

---

## 🟢 BAIXO - Bug: Filtro de Categoria no Cadastro de Produtos

### Contexto

No formulário de cadastro de produtos, o filtro/combobox de categoria **não está funcionando corretamente**:
- Não busca categorias reais do banco de dados
- Campo parece estar mockado ou desconectado
- Usuário não consegue selecionar categorias existentes

### Problema

**Comportamento atual:**
- Campo de categoria aparece no formulário
- Ao clicar, não mostra as categorias cadastradas na empresa
- Possivelmente mostra dados mockados ou vazio

**Comportamento esperado:**
- Buscar categorias reais da tabela `me_categoria` filtrando por `empresa_id`
- Popular o combobox/select com essas categorias
- Permitir seleção normal

### Implementação

#### Frontend:
```typescript
// ProductForm.tsx ou similar
const { data: categorias, isLoading } = useQuery({
  queryKey: ['categorias', empresaId],
  queryFn: () => categoriaService.listarPorEmpresa(empresaId),
  enabled: !!empresaId,
});

// No select/combobox de categoria
<Select value={categoriaId} onValueChange={setCategoriaId}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione uma categoria" />
  </SelectTrigger>
  <SelectContent>
    {categorias?.map((cat) => (
      <SelectItem key={cat.id_categoria} value={cat.id_categoria.toString()}>
        {cat.nome_categoria}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### Service:
```typescript
// services/categoriaService.ts
async listarPorEmpresa(empresaId: string): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('me_categoria')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('nome_categoria');
    
  if (error) throw error;
  return data || [];
}
```

---

### Checklist

- [ ] Identificar componente de formulário de produto com filtro de categoria
- [ ] Verificar se existe chamada à API/Supabase para buscar categorias
- [ ] Criar/atualizar service de categoria (`categoriaService.ts`)
- [ ] Implementar hook React Query para buscar categorias
- [ ] Conectar combobox de categoria aos dados reais
- [ ] Adicionar estado de loading enquanto busca
- [ ] Tratar erro caso falhe a busca
- [ ] Testar com empresa que tem categorias cadastradas

---

### Notas

- **Prioridade:** 🟢 BAIXA (bug simples, impacto médio)
- **Complexidade:** Muito baixa (apenas conectar ao banco)
- **Tempo Estimado:** 30 minutos
- **Relacionado:** Verificar se o mesmo problema ocorre em outras telas (serviços, etc.)

---

## 🟡 MÉDIO - Ajuste de Bordas no Layout (Design System)

### Contexto

Atualmente o sistema utiliza bordas muito arredondadas (`rounded-2xl`, `rounded-3xl`) em diversos componentes, criando um visual que pode parecer datado ou excessivamente "cartoon". O objetivo é modernizar o visual tornando as bordas mais sutis e profissionais.

**Referência visual atual:**
- Cards com `rounded-2xl` (16px) ou `rounded-3xl` (24px)
- Botões com bordas muito circulares
- Inputs com cantos muito arredondados

**Referência desejada (moderno/profissional):**
- Bordas sutis: `rounded-lg` (8px) ou `rounded-xl` (12px)
- Manter consistência em todo o sistema
- Visual mais clean e empresarial

---

### Objetivo

Revisar TODO o layout do projeto e ajustar as bordas para um padrão mais moderno e suave, substituindo bordas muito arredondadas por bordas moderadas.

---

### Escopo de Alterações

#### 1. **Arquivo: `tailwind.config.js`**
**Alteração:** Reduzir o border-radius padrão do tema

```javascript
// Adicionar ou modificar no tema:
borderRadius: {
  'none': '0',
  'sm': '0.125rem',   // 2px
  'DEFAULT': '0.25rem', // 4px
  'md': '0.375rem',   // 6px
  'lg': '0.5rem',     // 8px (novo padrão)
  'xl': '0.75rem',    // 12px
  '2xl': '1rem',      // 16px (usar com moderação)
  '3xl': '1.5rem',    // 24px (evitar)
  'full': '9999px',
}
```

#### 2. **Componentes de UI Gerais**

**Cards e Containers:**
- ❌ `rounded-2xl` → ✅ `rounded-lg` ou `rounded-xl`
- ❌ `rounded-3xl` → ✅ `rounded-xl` ou `rounded-2xl`

**Botões:**
- ❌ `rounded-full` (exceto botões circulares de ícone) → ✅ `rounded-lg`
- ❌ `rounded-2xl` → ✅ `rounded-lg`

**Inputs e Formulários:**
- ❌ `rounded-xl` → ✅ `rounded-md` ou `rounded-lg`
- Manter `rounded` padrão para inputs simples

**Modais e Dialogs:**
- ❌ `rounded-2xl` → ✅ `rounded-xl`

#### 3. **Módulos a Revisar**

- [ ] **Dashboard** - Cards de métricas, widgets
- [ ] **Financeiro** - Cards de contas, tabelas
- [ ] **CRM** - Cards de leads, cards de conversas
- [ ] **Catálogo** - Cards de produtos
- [ ] **Vendas** - Cards do PDV, lista de itens
- [ ] **Configurações** - Cards de configuração
- [ ] **Onboarding** - Telas de cadastro
- [ ] **Login** - Card de login

#### 4. **Arquivos Específicos (Exemplos)**

**Padrão de busca para refatoração:**
```bash
# Buscar todos os arquivos com bordas arredondadas excessivas
grep -r "rounded-2xl\|rounded-3xl" src/ --include="*.tsx" --include="*.ts"
```

**Substituições sugeridas:**
```typescript
// ANTES:
className="bg-white rounded-2xl shadow-lg p-6"

// DEPOIS:
className="bg-white rounded-lg shadow-lg p-6"

// ANTES:
className="rounded-full px-6 py-2"

// DEPOIS (para botões principais):
className="rounded-lg px-6 py-2"

// ANTES:
className="rounded-xl border border-gray-300"

// DEPOIS:
className="rounded-md border border-gray-300"
```

---

### Checklist de Implementação

- [ ] Auditar todos os componentes com bordas arredondadas excessivas
- [ ] Criar padrão de bordas no Design System (documentar)
- [ ] Atualizar `tailwind.config.js` (se necessário)
- [ ] Revisar e ajustar Dashboard
- [ ] Revisar e ajustar Módulo Financeiro
- [ ] Revisar e ajustar Módulo CRM
- [ ] Revisar e ajustar Módulo Catálogo
- [ ] Revisar e ajustar Módulo Vendas
- [ ] Revisar e ajustar Configurações
- [ ] Revisar e ajustar Onboarding
- [ ] Revisar e ajustar Login
- [ ] Testar responsividade após alterações
- [ ] Validar visual em diferentes telas (mobile, tablet, desktop)

---

### Guia de Bordas (Novo Padrão)

| Componente | Border Radius Anterior | Border Radius Novo | Classe Tailwind |
|------------|------------------------|-------------------|-----------------|
| Cards principais | `rounded-2xl` (16px) | `rounded-lg` (8px) | `rounded-lg` |
| Cards secundários | `rounded-xl` (12px) | `rounded-md` (6px) | `rounded-md` |
| Botões primários | `rounded-full` | `rounded-lg` (8px) | `rounded-lg` |
| Botões secundários | `rounded-2xl` | `rounded-md` (6px) | `rounded-md` |
| Inputs | `rounded-xl` (12px) | `rounded-md` (6px) | `rounded-md` |
| Modais | `rounded-2xl` (16px) | `rounded-xl` (12px) | `rounded-xl` |
| Toast/Alertas | `rounded-2xl` | `rounded-lg` | `rounded-lg` |
| Dropdowns | `rounded-xl` | `rounded-md` | `rounded-md` |
| Avatares | `rounded-full` | `rounded-full` | Manter |
| Botões ícone | `rounded-full` | `rounded-full` | Manter |

---

### Notas

- **Prioridade:** Média (melhoria de UX/UI)
- **Complexidade:** Baixa (alterações simples de CSS/Tailwind)
- **Impacto Visual:** Alto - moderniza toda a interface
- **Risco:** Baixo - alterações visuais reversíveis
- **Tempo Estimado:** 2-4 horas para revisão completa

---

## 🟡 MÉDIO - Duplicar Produtos (Funcionalidade Mobile)

### Contexto

**Problema real:**
Muitos empreendedores cadastram produtos pelo **celular** e não têm acesso ao Excel para importação massiva. Criar produtos similares um por um é trabalhoso e repetitivo.

**Exemplo prático:**
- Empresário vende 50 variações de camisetas (cores/tamanhos)
- Cada camiseta tem o mesmo preço base, apenas muda cor/tamanho
- Sem duplicação: precisa preencher 50x os mesmos campos
- Com duplicação: clona produto base e altera apenas o que mudou

**Solução:** Funcionalidade "Duplicar Produto" + geração automática de SKU e código de barras

---

### Objetivo

1. Permitir **duplicar** produtos existentes com um clique
2. **Auto-gerar** SKU e código de barras no formato correto
3. Facilitar cadastro de produtos similares no mobile

---

### Funcionalidade "Duplicar Produto"

#### Fluxo do Usuário:
```
1. Usuário entra no Catálogo > Produtos
2. Encontra produto base (ex: "Camiseta Básica Branca P")
3. Clica em [⋯] > "Duplicar Produto"
4. Sistema abre formulário pré-preenchido com:
   - Nome: "Camiseta Básica Branca P (Cópia)"
   - Preço: R$ 49,90 (mesmo do original)
   - Descrição: [copiada]
   - SKU: gerado automaticamente (ex: UNQ-123456)
   - Código de Barras: gerado automaticamente (ex: 7891234567890)
5. Usuário altera apenas o necessário (cor/tamanho)
6. Salva novo produto
```

#### Implementação Frontend:

**1. Botão de Ação no Card do Produto:**
```tsx
// No componente ProductCard ou ProductList
<DropdownMenu>
  <DropdownMenuTrigger>
    <MoreVertical className="h-4 w-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => onEdit(product)}>
      <Edit className="mr-2 h-4 w-4" /> Editar
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => onDuplicate(product)}>
      <Copy className="mr-2 h-4 w-4" /> Duplicar
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => onDelete(product)} className="text-red-600">
      <Trash className="mr-2 h-4 w-4" /> Excluir
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**2. Função de Duplicação:**
```typescript
// services/productService.ts
async duplicateProduct(productId: string): Promise<Product> {
  const original = await this.getProduct(productId);
  
  const duplicated = {
    ...original,
    id: undefined, // novo ID será gerado
    nome_produto: `${original.nome_produto} (Cópia)`,
    sku: generateSKU(), // função auto-gerar
    codigo_barras: generateBarcode(), // função auto-gerar
    criado_em: new Date(),
    atualizado_em: new Date(),
  };
  
  return await this.createProduct(duplicated);
}
```

---

### Geração Automática de SKU e Código de Barras

#### 1. Geração de SKU (Stock Keeping Unit)

**Formato proposto:** `UNQ-[TIMESTAMP]-[RANDOM]`

**Exemplo:** `UNQ-1234567890-AB12`

**Regras:**
- Prefixo: `UNQ` (identifica como SKU UNIQ)
- Timestamp: 10 dígitos (segundos desde época, reduzido)
- Sufixo: 4 caracteres alfanuméricos aleatórios
- Total: 19 caracteres
- Único por empresa (constraint no banco)

**Implementação (Edge Function ou Cliente):**
```typescript
function generateSKU(): string {
  const prefix = 'UNQ';
  const timestamp = Date.now().toString(36).slice(-8); // base36, 8 chars
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Exemplo: UNQ-lk2j9x3a-K9M2
```

**Migration necessária:**
```sql
-- Adicionar constraint de unicidade de SKU por empresa
ALTER TABLE me_produto 
ADD CONSTRAINT unique_sku_por_empresa 
UNIQUE (empresa_id, sku);

-- Criar índice para performance
CREATE INDEX idx_produto_sku ON me_produto(empresa_id, sku);
```

#### 2. Geração de Código de Barras (GTIN/EAN)

**Formato proposto:** EAN-13 válido

**Estrutura:**
- Prefixo: `789` (Brasil)
- Identificador empresa: 4 dígitos (hash do empresa_id)
- Identificador produto: 5 dígitos (sequencial ou timestamp)
- Dígito verificador: 1 dígito (cálculo módulo 10)

**Exemplo:** `7891234567890`

**Algoritmo de geração:**
```typescript
function generateEAN13(): string {
  // Prefixo Brasil + identificador empresa + identificador produto
  const prefix = '789';
  const companyId = getCompanyHash().slice(0, 4); // 4 dígitos
  const productId = generateProductSequence().toString().padStart(5, '0'); // 5 dígitos
  
  const partial = prefix + companyId + productId; // 12 dígitos
  const checkDigit = calculateEANCheckDigit(partial);
  
  return partial + checkDigit;
}

function calculateEANCheckDigit(code12: string): number {
  // Algoritmo módulo 10 para EAN-13
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code12[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit;
}

// Exemplo: 7891234567890
```

**Validação:**
```typescript
function validateEAN13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  
  const partial = code.slice(0, 12);
  const checkDigit = parseInt(code[12]);
  
  return calculateEANCheckDigit(partial) === checkDigit;
}
```

---

### Integração no Formulário de Produto

#### Campos Novos/Modificados:

**SKU:**
- Input com botão "Gerar automático"
- Placeholder: "Deixe em branco para gerar automaticamente"
- Se vazio no submit: chama `generateSKU()`

**Código de Barras:**
- Input com botão "Gerar automático"
- Placeholder: "Deixe em branco para gerar automaticamente"
- Ícone de scanner (futuro: leitura via câmera)
- Se vazio no submit: chama `generateEAN13()`

**Interface:**
```tsx
<div className="space-y-2">
  <Label htmlFor="sku">SKU</Label>
  <div className="flex gap-2">
    <Input 
      id="sku"
      value={sku}
      onChange={(e) => setSku(e.target.value)}
      placeholder="UNQ-XXXX-XXXX"
    />
    <Button 
      type="button" 
      variant="outline"
      onClick={() => setSku(generateSKU())}
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Gerar
    </Button>
  </div>
  <p className="text-xs text-gray-500">
    Deixe em branco para gerar automaticamente
  </p>
</div>
```

---

### Checklist de Implementação

#### Backend:
- [ ] Criar função `generateSKU()` no backend
- [ ] Criar função `generateEAN13()` com algoritmo de dígito verificador
- [ ] Migration: adicionar constraint UNIQUE em (empresa_id, sku)
- [ ] Migration: adicionar constraint UNIQUE em (empresa_id, codigo_barras)
- [ ] Criar Edge Function `generate-codes` se necessário
- [ ] Atualizar trigger/constraint para auto-gerar se vazio

#### Frontend:
- [ ] Adicionar botão "Duplicar" no menu de ações do produto
- [ ] Criar função `duplicateProduct()` no service
- [ ] Modificar formulário de produto para aceitar SKU/código vazio
- [ ] Adicionar botões "Gerar" nos campos SKU e código de barras
- [ ] Adicionar validação visual dos códigos gerados
- [ ] Adicionar tooltip explicando auto-geração

#### UX/UI:
- [ ] Confirmar duplicação: "Deseja duplicar este produto?"
- [ ] Toast de sucesso: "Produto duplicado com sucesso"
- [ ] Redirecionar para edição do novo produto
- [ ] Marcar campos auto-gerados com badge "Auto"

#### Testes:
- [ ] Testar duplicação mantém todos os campos
- [ ] Testar SKU gerado é único
- [ ] Testar código de barras é válido (passa em validador EAN)
- [ ] Testar mobile (fluxo principal de uso)
- [ ] Testar produto sem SKU/código (deve auto-gerar)

---

### Notas Técnicas

**Compatibilidade:**
- SKU gerado: compatível com qual sistema de estoque
- EAN-13: padrão internacional, lido por qualquer leitor de código de barras

**Performance:**
- Verificação de unicidade no banco (constraint UNIQUE)
- Geração no cliente (mais rápido) ou no servidor (mais seguro)
- Recomendado: gerar no cliente, validar no servidor

**Futuro:**
- Personalizar prefixo SKU (configuração por empresa)
- Suporte a outros formatos de código (UPC, CODE128)
- Scanner de código de barras via câmera do celular

---

### Prioridade e Impacto

- **Prioridade:** 🟡 MÉDIA (facilita uso mobile)
- **Impacto:** Reduz drasticamente tempo de cadastro de produtos similares
- **Complexidade:** Baixa-Média (1-2 dias)
- **Público:** Principalmente usuários mobile
- **Alternativa à importação Excel:** Sim, para quem não tem acesso ao computador

---

**Nota:** Sprint 11 concluiu todas as entregas de backend. Sprint 12 focará em:
- Configurações externas (n8n/Evolution) para WhatsApp
- Correções de bugs identificados (Bug #15 ✅ resolvido)
- Melhorias de UX (login, onboarding sem CNPJ)
- Configuração de módulos opcionais (Vendas & PDV)
- Importação massiva via Excel (crítico para clientes beta)
- Ajustes visuais de bordas (modernização do layout)
- Duplicação de produtos com auto-geração de códigos (facilita mobile)
- Campo tipo_estoque em produtos (controle financeiro correto)
- Correção de bug no filtro de categorias
