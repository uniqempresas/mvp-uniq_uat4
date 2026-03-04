# Product Requirements Document (PRD) - Sprint 11

**Projeto:** UNIQ Empresas  
**Sprint:** 11 - Configuração n8n + Ativação Beta Testers  
**Período:** 03/03/2026  
**Status:** EM PLANEJAMENTO  
**Fase:** 1 - Validação MVP  
**Versão:** 1.0

---

## 1. Visão Geral

A Sprint 11 tem como objetivo principal **ativar o fluxo completo de WhatsApp** para as empresas beta (Gráfica e Confecção), permitindo que elas recebam e respondam mensagens de clientes através do CRM UNIQ.

Esta sprint foca na **configuração da integração** entre Evolution API → n8n → Supabase, e no **cadastro completo** das empresas beta no sistema.

**Meta:** Duas empresas beta operando com atendimento via WhatsApp integrado ao CRM + 5 bugs críticos corrigidos até o final da sprint.

---

## 2. Problema

### 2.1 Situação Atual
A Sprint 10 foi concluída com sucesso:
- ✅ Backend completo para receber mensagens (tabelas `crm_chat_*`)
- ✅ Frontend de chat unificado no CRM
- ✅ Edge Functions para processar mensagens
- ✅ Interface de configuração do agente
- ✅ Respostas rápidas com atalhos

### 2.2 O Que Falta
❌ Workflows n8n não estão configurados  
❌ Instâncias Evolution API não estão ativas  
❌ Empresas beta (Gráfica e Confecção) não estão cadastradas no sistema  
❌ Fluxo de mensagens WhatsApp ↔ CRM não foi testado  

### 2.3 Impacto
Sem essa configuração, os beta testers **não conseguem usar** o recurso de atendimento via WhatsApp, que é um dos principais diferenciais do UNIQ. Isso bloqueia a validação do MVP e o feedback dos clientes.

### 2.4 Bugs Críticos Identificados nos Testes E2E
Além da configuração do WhatsApp, esta sprint também corrigirá bugs críticos encontrados nos testes end-to-end:

#### 🔴 Bug #4: Erro RLS ao Criar Conta Bancária (CRÍTICO)
- **Erro:** `new row violates row-level security policy for table "fn_conta"`
- **Arquivo:** AccountsPage.tsx:36
- **Impacto:** Impossível criar contas bancárias no Financeiro
- **Solução:** Corrigir política RLS da tabela `fn_conta`

#### 🔴 Bug #5: Combobox do Financeiro Não Carregam Dados (CRÍTICO)
- **Descrição:** Campos de seleção em Contas a Receber/Pagar não carregam dados
- **Problemas:**
  - Conta de Vencimento: não lista contas bancárias
  - Categoria: não lista categorias cadastradas
  - Cliente/Fornecedor: não listam registros
- **Arquivos:** TransactionModal.tsx, ReceivablePage.tsx, PayablePage.tsx
- **Impacto:** Impossível criar receitas/despesas

#### 🔴 Bug #12: Campo 'observacoes' Não Existe na Tabela crm_leads (CRÍTICO)
- **Erro:** `Could not find the 'observacoes' column of 'crm_leads' in the schema cache`
- **Arquivo:** ClientForm.tsx:47
- **Impacto:** Impossível cadastrar leads pelo CRM
- **Solução:** Criar migration para adicionar coluna 'observacoes' (TEXT, nullable)

#### 🔴 Bug #13: Oportunidade Requer Lead/Cliente Cadastrado Anteriormente
- **Descrição:** Não é possível criar oportunidade sem selecionar Lead/Cliente prévio
- **Impacto:** Fluxo de vendas interrompido
- **Solução:** Permitir criar lead rápido no modal ou tornar campo opcional

#### 🔴 Bug #11: Não é Possível Deletar Serviços
- **Descrição:** Ao tentar deletar serviço, o sistema não permite (FK constraint)
- **Causa:** Serviço referenciado em tabela de vendas
- **Solução:** Implementar soft delete (campo `deleted_at` ou `status: inativo`)

#### 🟡 Melhorias de Onboarding (Alta Prioridade)
1. **Criar Conta CAIXA automaticamente** no onboarding
2. **Categorias Financeiras padrão** no cadastro inicial
3. **Vendas & PDV como módulo opcional** (ativável/desativável)

---

## 3. Solução Proposta

### 3.1 Estratégia
Configurar a ponte completa entre WhatsApp e CRM:

```
Cliente WhatsApp → Evolution API → n8n → Supabase Edge Function → CRM UNIQ
                         ↑________________________________________________↓
                                        (resposta)
```

### 3.2 Escopo da Sprint

**Parte 1: Configuração n8n (2 dias)**
- Workflow de recebimento (Evolution → Supabase)
- Workflow de envio (Supabase → Evolution)
- Testes de integração

**Parte 2: Evolution API (2 dias)**
- Criar instância para Gráfica
- Criar instância para Confecção
- Conectar números de WhatsApp

**Parte 3: Cadastro de Empresas (2 dias)**
- Cadastrar Gráfica no sistema (empresa, usuário, módulos, produtos)
- Cadastrar Confecção no sistema (empresa, usuário, módulos, produtos)
- Configurar `crm_chat_config` para ambas

**Parte 4: Correção de Bugs Críticos (3 dias)**
- Bug #4: Corrigir RLS ao criar conta bancária
- Bug #5: Corrigir comboboxes do Financeiro
- Bug #12: Adicionar campo 'observacoes' na tabela crm_leads
- Bug #13: Permitir criar oportunidade sem lead prévio
- Bug #11: Implementar soft delete em serviços
- Melhorias de onboarding (Conta CAIXA, categorias padrão)

**Parte 5: Testes e Validação (2 dias)**
- Teste de fluxo completo com Gráfica
- Teste de fluxo completo com Confecção
- Testes E2E dos bugs corrigidos
- Ajustes e correções

---

## 4. Funcionalidades

### 4.1 Workflow de Recebimento (Evolution → Supabase)

**Descrição:** Receber mensagens do WhatsApp e armazenar no Supabase

**Fluxo:**
1. Evolution API detecta nova mensagem no número da empresa
2. Evolution envia webhook POST para n8n
3. n8n transforma payload e chama Edge Function do Supabase
4. Edge Function salva mensagem na tabela `crm_mensagens`
5. Mensagem aparece automaticamente no painel do CRM

**Dados Processados:**
- `instance_id` (identifica qual empresa: Gráfica ou Confecção)
- `phone` (número do cliente)
- `message` (texto da mensagem)
- `timestamp` (data/hora)
- `type` (text, image, document)

**Regras de URA (processadas pelo n8n):**
- Verificar se está em horário comercial
- Se fora de horário: enviar mensagem de ausência
- Se dentro do horário: aplicar regras de keyword
- Se keyword match: enviar resposta automática
- Se não match: notificar atendente humano

### 4.2 Workflow de Envio (Supabase → Evolution)

**Descrição:** Enviar mensagens do CRM para o WhatsApp do cliente

**Fluxo:**
1. Operador envia mensagem no painel CRM
2. Supabase dispara webhook (via trigger ou função) para n8n
3. n8n chama Evolution API com dados da mensagem
4. Evolution API entrega mensagem no WhatsApp do cliente

**Dados Enviados:**
- `instance_id` (da empresa)
- `phone` (número do destinatário)
- `message` (texto)
- `type` (text, image)

**Confirmações:**
- Status de envio (sent, delivered, read)
- Registro no histórico do CRM

### 4.3 Cadastro de Empresas Beta

**Empresa 1: Gráfica Rápida Beta**

| Item | Dados |
|------|-------|
| Nome | Gráfica Rápida Beta |
| Segmento | Materiais gráficos (cartões, panfletos, banners) |
| CNPJ | [A definir com cliente] |
| Contato | [A definir com cliente] |
| WhatsApp | [A configurar na Evolution] |

**Setup necessário:**
- [ ] Criar empresa na tabela `me_empresa`
- [ ] Criar usuário administrador em `me_usuario`
- [ ] Ativar módulos em `unq_empresa_modulos`: CRM, Finance, PDV, Store
- [ ] Configurar `crm_chat_config` com URA, horários, mensagens
- [ ] Cadastrar produtos iniciais (cartões de visita, panfletos, banners)
- [ ] Criar categorias financeiras básicas
- [ ] Cadastrar respostas rápidas (/preco, /horario, /endereco)

**Empresa 2: Confecção Estilo Beta**

| Item | Dados |
|------|-------|
| Nome | Confecção Estilo Beta |
| Segmento | Vestuário personalizado (camisetas, moletons) |
| CNPJ | [A definir com cliente] |
| Contato | [A definir com cliente] |
| WhatsApp | [A configurar na Evolution] |

**Setup necessário:**
- [ ] Criar empresa na tabela `me_empresa`
- [ ] Criar usuário administrador em `me_usuario`
- [ ] Ativar módulos em `unq_empresa_modulos`: CRM, Finance, PDV, Store
- [ ] Configurar `crm_chat_config` com URA, horários, mensagens
- [ ] Cadastrar produtos iniciais (camisetas, moletons) com variações (tamanhos, cores)
- [ ] Criar categorias financeiras básicas
- [ ] Cadastrar respostas rápidas (/catalogo, /tamanhos, /prazo)

### 4.4 Configuração Evolution API

**Para cada empresa:**

1. **Criar Instância:**
   - Nome da instância: `uniq-grafica-beta` ou `uniq-confecao-beta`
   - Tipo: WhatsApp
   - Obter `instance_id`

2. **Conectar WhatsApp:**
   - Ler QR Code com celular da empresa
   - Validar conexão
   - Testar envio/recebimento

3. **Configurar Webhooks:**
   - Webhook de mensagens: apontar para n8n
   - Webhook de status: apontar para n8n

### 4.5 Correção de Bugs Críticos

#### 4.5.1 Bug #4: Erro RLS ao Criar Conta Bancária
**Problema:** Política RLS impedindo criação de contas em `fn_conta`

**Solução:**
```sql
-- Verificar política RLS atual
SELECT * FROM pg_policies WHERE tablename = 'fn_conta';

-- Criar ou atualizar política para permitir inserção
CREATE POLICY "Permitir inserção de contas" ON fn_conta
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (
    SELECT id FROM me_empresa WHERE id = fn_conta.empresa_id
  ));
```

**Arquivos afetados:**
- Políticas RLS no Supabase (via SQL)
- AccountsPage.tsx (verificar chamada)

#### 4.5.2 Bug #5: Comboboxes do Financeiro Não Carregam
**Problema:** Campos de seleção não populam com dados do banco

**Investigação:**
1. Verificar se queries estão sendo executadas
2. Verificar se dados existem nas tabelas
3. Verificar se há erro de permissão (RLS)
4. Verificar se o componente combobox está recebendo os dados

**Solução esperada:**
- Corrigir queries nos services
- Garantir que RLS permite leitura
- Verificar se useEffect está carregando dados corretamente

**Arquivos afetados:**
- TransactionModal.tsx
- ReceivablePage.tsx
- PayablePage.tsx
- financeService.ts (ou similar)

#### 4.5.3 Bug #12: Campo 'observacoes' Não Existe em crm_leads
**Problema:** Migration faltando para coluna 'observacoes'

**Solução:**
```sql
-- Migration para adicionar coluna
ALTER TABLE crm_leads 
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Opcional: adicionar índice se necessário
CREATE INDEX IF NOT EXISTS idx_crm_leads_observacoes ON crm_leads(observacoes);
```

**Arquivos afetados:**
- Nova migration SQL
- ClientForm.tsx (já referencia o campo, só precisa da coluna)

#### 4.5.4 Bug #13: Oportunidade Requer Lead/Cliente Prévio
**Problema:** Constraint FK obriga ter lead_id ou cliente_id

**Soluções possíveis:**
1. **Opção A:** Tornar campos opcionais (remover NOT NULL)
   ```sql
   ALTER TABLE crm_oportunidades 
   ALTER COLUMN lead_id DROP NOT NULL,
   ALTER COLUMN cliente_id DROP NOT NULL;
   ```

2. **Opção B:** Permitir criar lead rápido no modal
   - Adicionar botão "+ Novo Lead" no select
   - Abrir mini-formulário para cadastro rápido
   - Associar automaticamente à oportunidade

**Arquivos afetados:**
- crm_oportunidades (migration ou constraint)
- OpportunityModal.tsx
- OpportunityForm.tsx

#### 4.5.5 Bug #11: Não é Possível Deletar Serviços
**Problema:** FK constraint impede exclusão quando serviço tem vendas

**Solução - Soft Delete:**
```sql
-- Adicionar coluna deleted_at
ALTER TABLE unq_servicos 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Atualizar queries para filtrar deleted_at IS NULL
-- Ou adicionar campo status: 'ativo' | 'inativo'
ALTER TABLE unq_servicos 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ativo';
```

**Frontend:**
- Alterar service para atualizar status ao invés de deletar
- Adicionar filtro "Mostrar inativos" na lista

**Arquivos afetados:**
- Migration SQL
- servicesService.ts
- ServicesPage.tsx

#### 4.5.6 Melhorias de Onboarding

**Conta CAIXA Automática:**
```sql
-- No trigger de criação de empresa ou no service de onboarding
INSERT INTO fn_conta (empresa_id, nome, tipo, saldo_inicial)
VALUES (NEW.empresa_id, 'CAIXA', 'caixa', 0.00);
```

**Categorias Financeiras Padrão:**
```sql
-- Inserir após criação da empresa
INSERT INTO fn_categoria (empresa_id, nome, tipo, cor) VALUES
  (NEW.empresa_id, 'Vendas', 'receita', '#10B981'),
  (NEW.empresa_id, 'Serviços', 'receita', '#3B82F6'),
  (NEW.empresa_id, 'Aluguel', 'despesa', '#EF4444'),
  (NEW.empresa_id, 'Salários', 'despesa', '#F59E0B'),
  (NEW.empresa_id, 'Fornecedores', 'despesa', '#8B5CF6'),
  (NEW.empresa_id, 'Marketing', 'despesa', '#EC4899');
```

---

## 5. Requisitos Técnicos

### 5.1 Workflows n8n

#### Workflow 1: Recebimento de Mensagens

**Trigger:** Webhook (POST)
```
URL: https://n8n.seu-dominio.com/webhook/evolution-receive
Method: POST
```

**Node 1: Transformação (Function)**
```javascript
const event = $input.first().json;
return {
  json: {
    instance_id: event.instance.id,
    message: {
      id: event.data.key.id,
      from: event.data.key.remoteJid.split('@')[0],
      text: event.data.message?.conversation || 
            event.data.message?.extendedTextMessage?.text || '',
      timestamp: new Date(event.data.messageTimestamp * 1000).toISOString(),
      type: event.data.messageType || 'text',
      media_url: event.data.message?.imageMessage?.url || null
    }
  }
};
```

**Node 2: Chamada Supabase (HTTP Request)**
```
Method: POST
URL: https://<project>.supabase.co/functions/v1/webhook-whatsapp
Headers: 
  - Authorization: Bearer ${$env.SUPABASE_SERVICE_ROLE_KEY}
  - Content-Type: application/json
Body: {{$json}}
```

#### Workflow 2: Envio de Mensagens

**Trigger:** Webhook (POST) do Supabase
```
URL: https://n8n.seu-dominio.com/webhook/send-whatsapp
Method: POST
```

**Node 1: Transformação**
```javascript
const data = $input.first().json;
return {
  json: {
    instance_id: data.instance_id,
    number: data.phone,
    text: data.message
  }
};
```

**Node 2: Evolution API (HTTP Request)**
```
Method: POST
URL: https://sua-evolution-api.com/message/sendText/{{$json.instance_id}}
Headers:
  - apikey: ${$env.EVOLUTION_API_KEY}
Body: {
  "number": "{{$json.number}}",
  "text": "{{$json.text}}"
}
```

### 5.2 Variáveis de Ambiente (n8n)

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_URL=https://<project>.supabase.co
EVOLUTION_API_KEY=sua_chave_aqui
```

### 5.3 Scripts SQL para Cadastro

#### Script 1: Cadastrar Empresa Gráfica
```sql
-- Criar empresa
INSERT INTO me_empresa (nome, cnpj, email, telefone, status)
VALUES ('Gráfica Rápida Beta', '12.345.678/0001-90', 'contato@graficabeta.com', '11999998888', 'ativo')
RETURNING id;
-- Resultado: empresa_id = 'uuid-grafica'

-- Criar usuário administrador
INSERT INTO me_usuario (empresa_id, nome, email, senha_hash, perfil, status)
VALUES (
  'uuid-grafica', 
  'Administrador Gráfica', 
  'admin@graficabeta.com', 
  'hash_da_senha', 
  'admin', 
  'ativo'
);

-- Ativar módulos
INSERT INTO unq_empresa_modulos (empresa_id, modulo_id, ativo, config)
VALUES 
  ('uuid-grafica', 'crm', true, '{}'),
  ('uuid-grafica', 'finance', true, '{}'),
  ('uuid-grafica', 'pdv', true, '{}'),
  ('uuid-grafica', 'store', true, '{}');

-- Configurar chat
INSERT INTO crm_chat_config (
  empresa_id, agent_name, agent_personality, mode, 
  welcome_message, away_message, business_hours, 
  phone_number, evolution_instance_id, ura_rules
)
VALUES (
  'uuid-grafica',
  'Atendente Gráfica',
  'Profissional e ágil',
  'ura',
  'Olá! Bem-vindo à Gráfica Rápida. Como posso ajudar? Digite: preço, horário ou endereço',
  'Nosso horário de atendimento é de Seg-Sex 8h às 18h e Sáb 8h às 12h. Retornaremos em breve!',
  '{"mon":{"open":"08:00","close":"18:00"},"tue":{"open":"08:00","close":"18:00"},"wed":{"open":"08:00","close":"18:00"},"thu":{"open":"08:00","close":"18:00"},"fri":{"open":"08:00","close":"18:00"},"sat":{"open":"08:00","close":"12:00"},"sun":null}',
  '5511999998888',
  'uniq-grafica-beta',
  '[{"keyword":"preço","response":"Nossos preços: Cartão de visita R$ 50/100un, Panfleto R$ 80/1000un, Banner R$ 60/m². Solicite um orçamento!"},{"keyword":"horário","response":"Funcionamos Seg-Sex 8h-18h, Sáb 8h-12h"},{"keyword":"endereço","response":"Estamos na Rua das Gráficas, 123 - Centro. Venha nos visitar!"}]'
);

-- Respostas rápidas
INSERT INTO crm_chat_respostas_rapidas (empresa_id, shortcut, content, category)
VALUES 
  ('uuid-grafica', '/preco', 'Nossos preços: Cartão de visita R$ 50/100un, Panfleto R$ 80/1000un, Banner R$ 60/m². Solicite um orçamento!', 'preços'),
  ('uuid-grafica', '/horario', 'Funcionamos Seg-Sex 8h-18h, Sáb 8h-12h', 'informações'),
  ('uuid-grafica', '/endereco', 'Estamos na Rua das Gráficas, 123 - Centro. Venha nos visitar!', 'informações'),
  ('uuid-grafica', '/orcamento', 'Por favor, nos informe: 1) O que precisa, 2) Quantidade, 3) Prazo. Retornaremos em breve!', 'vendas');
```

#### Script 2: Cadastrar Produtos Gráfica
```sql
-- Categorias
INSERT INTO pd_categoria (empresa_id, nome, descricao)
VALUES 
  ('uuid-grafica', 'Cartões de Visita', 'Cartões de visita em diversos acabamentos'),
  ('uuid-grafica', 'Panfletos', 'Panfletos e flyers'),
  ('uuid-grafica', 'Banners', 'Banners e lonas');

-- Produtos
INSERT INTO pd_produto (empresa_id, nome, descricao, tipo, preco, categoria_id, ativo)
VALUES 
  ('uuid-grafica', 'Cartão de Visita Couché 300g', 'Cartão de visita em couché 300g com verniz UV total', 'produto', 50.00, (SELECT id FROM pd_categoria WHERE nome = 'Cartões de Visita' LIMIT 1), true),
  ('uuid-grafica', 'Panfleto 10x15cm', 'Panfleto 10x15cm em couché 90g', 'produto', 80.00, (SELECT id FROM pd_categoria WHERE nome = 'Panfletos' LIMIT 1), true),
  ('uuid-grafica', 'Banner 1x1m', 'Banner em lona 280g com ilhós', 'produto', 60.00, (SELECT id FROM pd_categoria WHERE nome = 'Banners' LIMIT 1), true);
```

#### Script 3: Cadastrar Empresa Confecção
```sql
-- Criar empresa
INSERT INTO me_empresa (nome, cnpj, email, telefone, status)
VALUES ('Confecção Estilo Beta', '98.765.432/0001-10', 'contato@confecaoestilo.com', '11988887777', 'ativo')
RETURNING id;
-- Resultado: empresa_id = 'uuid-confecao'

-- Criar usuário administrador
INSERT INTO me_usuario (empresa_id, nome, email, senha_hash, perfil, status)
VALUES (
  'uuid-confecao', 
  'Administrador Confecção', 
  'admin@confecaoestilo.com', 
  'hash_da_senha', 
  'admin', 
  'ativo'
);

-- Ativar módulos
INSERT INTO unq_empresa_modulos (empresa_id, modulo_id, ativo, config)
VALUES 
  ('uuid-confecao', 'crm', true, '{}'),
  ('uuid-confecao', 'finance', true, '{}'),
  ('uuid-confecao', 'pdv', true, '{}'),
  ('uuid-confecao', 'store', true, '{}');

-- Configurar chat
INSERT INTO crm_chat_config (
  empresa_id, agent_name, agent_personality, mode, 
  welcome_message, away_message, business_hours, 
  phone_number, evolution_instance_id, ura_rules
)
VALUES (
  'uuid-confecao',
  'Atendente Estilo',
  'Descontraído e fashion',
  'ura',
  'Oi! Bem-vindo à Confecção Estilo 👕 Personalizamos camisetas e moletons com seu estilo! Digite: catálogo, tamanhos ou prazo',
  'Opa! Nosso horário é Seg-Sex 9h às 19h. Deixe sua mensagem que respondemos assim que possível! ✌️',
  '{"mon":{"open":"09:00","close":"19:00"},"tue":{"open":"09:00","close":"19:00"},"wed":{"open":"09:00","close":"19:00"},"thu":{"open":"09:00","close":"19:00"},"fri":{"open":"09:00","close":"19:00"},"sat":null,"sun":null}',
  '5511988887777',
  'uniq-confecao-beta',
  '[{"keyword":"catálogo","response":"Confira nossos produtos: Camisetas básicas, Camisetas estampadas, Moletons. Acesse: www.lojaestilo.com"},{"keyword":"tamanhos","response":"Trabalhamos com tamanhos: P, M, G, GG e XGG. Também fazemos sob medida!"},{"keyword":"prazo","response":"Prazo de produção: 5-7 dias úteis para camisetas, 7-10 dias para moletons. Encomende já!"}]'
);

-- Respostas rápidas
INSERT INTO crm_chat_respostas_rapidas (empresa_id, shortcut, content, category)
VALUES 
  ('uuid-confecao', '/catalogo', 'Confira nossos produtos: Camisetas básicas, Camisetas estampadas, Moletons. Acesse: www.lojaestilo.com', 'produtos'),
  ('uuid-confecao', '/tamanhos', 'Trabalhamos com tamanhos: P, M, G, GG e XGG. Também fazemos sob medida!', 'informações'),
  ('uuid-confecao', '/prazo', 'Prazo de produção: 5-7 dias úteis para camisetas, 7-10 dias para moletons. Encomende já!', 'informações'),
  ('uuid-confecao', '/encomenda', 'Para fazer uma encomenda, preciso saber: 1) Modelo, 2) Tamanho, 3) Quantidade, 4) Estampa (se houver)', 'vendas');
```

#### Script 4: Cadastrar Produtos Confecção
```sql
-- Categorias
INSERT INTO pd_categoria (empresa_id, nome, descricao)
VALUES 
  ('uuid-confecao', 'Camisetas', 'Camisetas básicas e estampadas'),
  ('uuid-confecao', 'Moletons', 'Moletons e casacos');

-- Produtos com variações
INSERT INTO pd_produto (empresa_id, nome, descricao, tipo, preco, categoria_id, ativo, variacoes)
VALUES 
  ('uuid-confecao', 'Camiseta Básica', 'Camiseta 100% algodão', 'produto', 39.90, (SELECT id FROM pd_categoria WHERE nome = 'Camisetas' LIMIT 1), true, '{"tamanho":["P","M","G","GG"],"cor":["Branco","Preto","Cinza","Azul"]}'),
  ('uuid-confecao', 'Camiseta Estampada', 'Camiseta com estampas exclusivas', 'produto', 59.90, (SELECT id FROM pd_categoria WHERE nome = 'Camisetas' LIMIT 1), true, '{"tamanho":["P","M","G","GG"],"cor":["Branco","Preto"]}'),
  ('uuid-confecao', 'Moletom Canguru', 'Moletom com capuz e bolso canguru', 'produto', 129.90, (SELECT id FROM pd_categoria WHERE nome = 'Moletons' LIMIT 1), true, '{"tamanho":["P","M","G","GG","XGG"],"cor":["Preto","Cinza","Azul Marinho"]}');
```

### 5.4 Edge Functions

**Edge Function: `webhook-whatsapp` (já existe, apenas validar)**
- Recebe payload do n8n
- Busca empresa pelo `instance_id`
- Cria/atualiza conversa em `crm_chat_conversas`
- Salva mensagem em `crm_chat_mensagens`
- Retorna 200 OK

**Edge Function: `send-whatsapp-message` (já existe, apenas validar)**
- Recebe conversation_id, content, sender_id
- Busca dados da conversa e empresa
- Dispara webhook para n8n
- Atualiza status da mensagem

---

## 6. Fluxos de Usuário

### 6.1 Fluxo: Configuração Completa

```
Dia 1: Setup n8n
├── Configurar variáveis de ambiente
├── Importar workflows (receber + enviar)
├── Configurar webhooks
└── Testar conexão n8n → Supabase

Dia 2: Evolution API
├── Acessar painel Evolution
├── Criar instância "uniq-grafica-beta"
├── Criar instância "uniq-confecao-beta"
├── Conectar WhatsApp (QR Code)
├── Configurar webhooks apontando para n8n
└── Testar envio/recebimento manual

Dia 3: Cadastro Gráfica
├── Executar Script 1 (empresa + usuário + módulos)
├── Executar Script 2 (produtos)
├── Verificar login no sistema
├── Configurar crm_chat_config
└── Testar URA

Dia 4: Cadastro Confecção
├── Executar Script 3 (empresa + usuário + módulos)
├── Executar Script 4 (produtos)
├── Verificar login no sistema
├── Configurar crm_chat_config
└── Testar URA

Dia 5: Testes Gráfica
├── Enviar mensagem de teste para número da Gráfica
├── Verificar se aparece no CRM
├── Responder pelo CRM
├── Verificar se chega no WhatsApp
├── Testar regras URA (keywords)
└── Testar fora de horário

Dia 6: Testes Confecção
├── Enviar mensagem de teste para número da Confecção
├── Verificar se aparece no CRM
├── Responder pelo CRM
├── Verificar se chega no WhatsApp
├── Testar regras URA (keywords)
└── Testar fora de horário

Dia 7: Correção de Bugs - Parte 1
├── Bug #4: Corrigir RLS ao criar conta bancária
├── Bug #5: Corrigir comboboxes do Financeiro
├── Testar correções
└── Validar testes E2E do Financeiro

Dia 8: Correção de Bugs - Parte 2
├── Bug #12: Criar migration para campo 'observacoes'
├── Bug #13: Ajustar constraint de oportunidade
├── Bug #11: Implementar soft delete em serviços
└── Testar correções

Dia 9: Melhorias de Onboarding
├── Criar conta CAIXA automaticamente
├── Criar categorias financeiras padrão
├── Testar fluxo de criação de empresa
└── Documentar

Dia 10: Ajustes e Feedback
├── Corrigir bugs identificados
├── Ajustar mensagens de URA
├── Treinar usuários beta
├── Coletar feedback inicial
└── Documentar aprendizados
```

### 6.2 Fluxo: Cliente Envia Mensagem

```
Cliente (WhatsApp)
├── Abre chat com número da Gráfica
├── Envia: "Qual o preço de cartão de visita?"
├── Evolution API recebe mensagem
├── Evolution dispara webhook para n8n
├── n8n processa payload
├── n8n chama Edge Function do Supabase
├── Edge Function:
│   ├── Busca empresa pelo instance_id
│   ├── Verifica se é horário comercial
│   ├── Cria conversa em crm_chat_conversas
│   ├── Salva mensagem em crm_chat_mensagens
│   ├── Aplica regra URA (keyword "preço")
│   └── Retorna resposta automática
├── n8n envia resposta via Evolution API
├── Cliente recebe: "Nossos preços: Cartão de visita R$ 50/100un..."
└── Operador vê conversa no CRM Chat
```

### 6.3 Fluxo: Operador Responde

```
Operador (CRM UNIQ)
├── Acessa CRM > Chat
├── Vê conversa nova (badge vermelho)
├── Clica para abrir
├── Visualiza mensagem do cliente
├── Digita resposta personalizada
├── Clica em "Enviar"
├── CRM chama Edge Function
├── Edge Function dispara webhook para n8n
├── n8n chama Evolution API
├── Evolution API entrega mensagem
└── Cliente recebe no WhatsApp
```

---

## 7. Critérios de Aceitação

### 7.1 Workflows n8n
- [ ] Workflow de recebimento configurado e funcionando
- [ ] Workflow de envio configurado e funcionando
- [ ] Payload transformado corretamente
- [ ] Erros são logados e tratados

### 7.2 Evolution API
- [ ] Instância "uniq-grafica-beta" criada e conectada
- [ ] Instância "uniq-confecao-beta" criada e conectada
- [ ] Webhooks configurados apontando para n8n
- [ ] Teste de envio/recebimento manual funciona

### 7.3 Cadastro de Empresas
- [ ] Gráfica cadastrada no sistema (empresa, usuário, módulos)
- [ ] Confecção cadastrada no sistema (empresa, usuário, módulos)
- [ ] Produtos cadastrados para ambas
- [ ] Configuração de chat (`crm_chat_config`) feita para ambas
- [ ] Respostas rápidas cadastradas

### 7.4 Testes de Integração
- [ ] Mensagem enviada para Gráfica aparece no CRM em < 5 segundos
- [ ] Mensagem enviada para Confecção aparece no CRM em < 5 segundos
- [ ] Resposta pelo CRM chega no WhatsApp do cliente
- [ ] URA responde automaticamente às keywords configuradas
- [ ] Mensagem de ausência enviada fora de horário comercial
- [ ] Respostas rápidas funcionam (/preco, /horario, etc.)

### 7.5 Validação Beta
- [ ] Usuário da Gráfica consegue fazer login
- [ ] Usuário da Confecção consegue fazer login
- [ ] Ambos conseguem ver o módulo Chat
- [ ] Ambos conseguem responder mensagens
- [ ] Feedback positivo dos beta testers

### 7.6 Correção de Bugs (CRÍTICO)
- [ ] **Bug #4:** Consegue criar conta bancária sem erro RLS
- [ ] **Bug #5:** Comboboxes de Conta, Categoria e Cliente carregam dados corretamente
- [ ] **Bug #5:** Consegue salvar receitas e despesas no Financeiro
- [ ] **Bug #12:** Consegue cadastrar lead com campo observações
- [ ] **Bug #13:** Consegue criar oportunidade sem lead prévio (ou criar lead rápido)
- [ ] **Bug #11:** Consegue deletar serviço (soft delete implementado)
- [ ] **Onboarding:** Conta CAIXA criada automaticamente para novas empresas
- [ ] **Onboarding:** Categorias financeiras padrão cadastradas automaticamente

---

## 8. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Evolution API instável ou fora do ar | Média | Alto | Ter plano B (documentar fallback manual); monitorar status |
| n8n com downtime | Baixa | Alto | Configurar monitoramento; alertas via email/Slack |
| Empresa não consegue conectar WhatsApp (QR Code) | Alta | Médio | Documentação passo a passo com screenshots; suporte remoto |
| Delay na entrega de mensagens (> 10s) | Média | Médio | Monitorar logs; otimizar workflows; verificar latência |
| Perda de mensagens | Baixa | Alto | Logs completos; retry automático; notificação de erro |
| Empresa beta desistir de participar | Baixa | Alto | Ter lista de backup; manter relacionamento próximo |
| Bug crítico em produção | Média | Alto | Testes extensivos; deploy gradual; rollback rápido |

---

## 9. Dependências

### 9.1 Dependências Técnicas
- [x] Supabase: Banco de dados e Edge Functions
- [x] Sprint 10: Módulo CRM + Atendente unificado concluído
- [ ] Evolution API: Acesso ao painel de administração
- [ ] n8n: Instância configurada e acessível
- [ ] Números WhatsApp: Validados e disponíveis para teste

### 9.2 Dependências de Negócio
- [ ] Gráfica: Disponível para teste e configuração
- [ ] Confecção: Disponível para teste e configuração
- [ ] Dados das empresas: CNPJ, contato, endereço

### 9.3 Dependências de Equipe
- [ ] Dev Backend: Disponível para edge functions (se necessário)
- [ ] DevOps: Suporte para n8n e Evolution API
- [ ] QA: Disponível para testes de integração

---

## 10. Métricas de Sucesso

### 10.1 KPIs Técnicos
- **Tempo de processamento:** < 3 segundos (mensagem recebida → aparece no CRM)
- **Taxa de sucesso de envio:** > 95%
- **Uptime dos workflows:** > 99%
- **Zero perda de mensagens**

### 10.2 KPIs de Negócio
- **2 empresas beta ativas** até final da sprint
- **100% das mensagens** aparecendo no CRM
- **Tempo de resposta automática:** < 5 segundos
- **Satisfação dos beta testers:** > 4/5

### 10.3 KPIs de Qualidade
- **Zero bugs críticos** em produção
- **100% dos testes** passando
- **Documentação completa** dos workflows

### 10.4 KPIs de Correção de Bugs
- **5 bugs críticos corrigidos:** #4, #5, #11, #12, #13
- **100% dos testes E2E passando** (incluindo Financeiro)
- **Zero regressões** introduzidas
- **2 melhorias de onboarding implementadas**

---

## 11. Checklist Técnico Completo

### n8n
- [ ] Variáveis de ambiente configuradas
- [ ] Workflow "Receber Mensagens" importado/configurado
- [ ] Workflow "Enviar Mensagens" importado/configurado
- [ ] Webhooks testados
- [ ] Logs de erro configurados

### Evolution API
- [ ] Acesso ao painel de admin
- [ ] Instância "uniq-grafica-beta" criada
- [ ] Instância "uniq-confecao-beta" criada
- [ ] WhatsApp da Gráfica conectado
- [ ] WhatsApp da Confecção conectado
- [ ] Webhooks configurados

### Banco de Dados
- [ ] Script 1 executado (Gráfica - empresa e configurações)
- [ ] Script 2 executado (Gráfica - produtos)
- [ ] Script 3 executado (Confecção - empresa e configurações)
- [ ] Script 4 executado (Confecção - produtos)
- [ ] Dados validados

### Correção de Bugs (CRÍTICO)
- [ ] **Bug #4:** Migration/política RLS para `fn_conta` aplicada
- [ ] **Bug #5:** Services do Financeiro corrigidos (carregamento de dados)
- [ ] **Bug #5:** Teste E2E Financeiro passando (`tests/e2e/05-finance/finance-flow.spec.ts`)
- [ ] **Bug #12:** Migration `add_observacoes_to_crm_leads.sql` aplicada
- [ ] **Bug #13:** Constraint de oportunidade ajustada (permitir sem lead/cliente)
- [ ] **Bug #11:** Soft delete implementado em serviços
- [ ] **Onboarding:** Trigger para criar conta CAIXA automaticamente
- [ ] **Onboarding:** Trigger para criar categorias financeiras padrão
- [ ] **Opcional:** Vendas & PDV como módulo opcional

### Testes - WhatsApp/Chat
- [ ] Teste de recebimento (Gráfica)
- [ ] Teste de envio (Gráfica)
- [ ] Teste URA (Gráfica)
- [ ] Teste de recebimento (Confecção)
- [ ] Teste de envio (Confecção)
- [ ] Teste URA (Confecção)
- [ ] Teste fora de horário
- [ ] Teste respostas rápidas

### Testes - Correção de Bugs
- [ ] **Bug #4:** Teste E2E criação de conta bancária (`tests/e2e/...`)
- [ ] **Bug #5:** Teste E2E comboboxes Financeiro carregam dados
- [ ] **Bug #5:** Teste E2E criar receita/despesa completo
- [ ] **Bug #12:** Teste E2E cadastrar lead com observações
- [ ] **Bug #13:** Teste E2E criar oportunidade sem lead prévio
- [ ] **Bug #11:** Teste deletar serviço (soft delete)

### Documentação
- [ ] Workflows n8n documentados
- [ ] Scripts SQL documentados
- [ ] Guia de configuração Evolution escrito
- [ ] Playbook de troubleshooting criado

---

## 12. Anexos

### 12.1 Estrutura de Dados

**crm_chat_config:**
```typescript
interface CRMChatConfig {
  id: string;
  empresa_id: string;
  agent_name: string;
  agent_personality?: string;
  mode: 'ura' | 'agent';
  avatar_url?: string;
  welcome_message?: string;
  away_message?: string;
  business_hours: BusinessHours;
  phone_number?: string;
  evolution_instance_id?: string;
  n8n_workflow_id?: string;
  ura_rules: UraRule[];
  status: 'active' | 'inactive' | 'paused';
}
```

**UraRule:**
```typescript
interface UraRule {
  keyword: string;
  response: string;
  active: boolean;
}
```

### 12.2 URLs Importantes

- **Evolution API:** `https://api.evolution-api.com/v1` (ou sua instância)
- **n8n Webhook Receber:** `https://seu-n8n.com/webhook/evolution-receive`
- **n8n Webhook Enviar:** `https://seu-n8n.com/webhook/send-whatsapp`
- **Supabase Edge Function:** `https://<project>.supabase.co/functions/v1/webhook-whatsapp`

### 12.3 Contatos das Empresas Beta

**Gráfica Rápida Beta:**
- Responsável: [Nome]
- Telefone: [Número]
- Email: [Email]
- Instance ID: `uniq-grafica-beta`

**Confecção Estilo Beta:**
- Responsável: [Nome]
- Telefone: [Número]
- Email: [Email]
- Instance ID: `uniq-confecao-beta`

---

## 13. Próximo Passo

**Ação Requerida:** Aprovar este PRD e iniciar **Passo 2: Especificação Tática** para gerar o SPEC.md com:
- Detalhes técnicos dos workflows n8n
- Passo a passo da configuração Evolution API
- Scripts SQL finais
- Plano de testes detalhado

---

**Documento gerado em:** 03/03/2026  
**Versão:** 1.0  
**Status:** Aguardando aprovação para início da Sprint

---

## Aprovações

**Product Owner:** ___________________ Data: _______

**Tech Lead:** ___________________ Data: _______

**Stakeholder:** ___________________ Data: _______
