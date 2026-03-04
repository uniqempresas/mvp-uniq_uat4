# SPEC - Sprint 11: Configuração n8n + Ativação Beta Testers

**Projeto:** UNIQ Empresas (mvp-uniq_uat4)  
**Sprint:** 11  
**Período:** 03/03/2026 - 13/03/2026  
**Versão:** 1.0  
**Status:** Especificação Tática Completa

---

## 1. Visão Executiva

### 1.1 Objetivo Principal
Ativar o fluxo completo de WhatsApp para as empresas beta (Gráfica e Confecção), permitindo que elas recebam e respondam mensagens de clientes através do CRM UNIQ.

### 1.2 Escopo Resumido
- Configuração de workflows n8n (recebimento e envio de mensagens)
- Setup de instâncias Evolution API para empresas beta
- Cadastro completo das empresas no sistema
- Correção de 5 bugs críticos identificados nos testes E2E
- Implementação de melhorias no onboarding

### 1.3 Entregáveis Chave
1. ✅ Workflows n8n configurados e testados
2. ✅ Instâncias Evolution API conectadas (Gráfica + Confecção)
3. ✅ Empresas beta cadastradas e configuradas
4. ✅ 5 bugs corrigidos e testados
5. ✅ Fluxo WhatsApp ↔ CRM validado

---

## 2. Análise Técnica

### 2.1 Arquitetura Atual

#### 2.1.1 Descrição do Sistema
O UNIQ Empresas é uma plataforma SaaS ERP completa com os seguintes módulos:
- **CRM**: Gestão de leads, oportunidades e atendimento
- **Financeiro**: Contas a pagar/receber, fluxo de caixa, DRE
- **PDV**: Vendas de produtos e serviços
- **Catálogo**: Cadastro de produtos com variações
- **Loja Virtual**: Vitrine pública de produtos
- **Chat/Atendente**: Integração WhatsApp (Sprint 10)

#### 2.1.2 Stack Tecnológico
```
Frontend: React 18 + TypeScript + TailwindCSS
Backend: Supabase (PostgreSQL + Edge Functions)
Autenticação: Supabase Auth (JWT)
Storage: Supabase Storage
Integração WhatsApp: Evolution API + n8n
Testes: Playwright (E2E)
```

#### 2.1.3 Componentes Principais
```
src/
├── pages/
│   ├── Finance/          # Contas, Categorias, Receitas/Despesas
│   ├── CRM/              # Leads, Oportunidades, Chat
│   ├── Services/         # Cadastro de serviços
│   ├── Attendant/        # Configuração do atendente
│   └── Onboarding/       # Fluxo de criação de empresa
├── services/             # Camada de acesso a dados
├── components/           # Componentes reutilizáveis
└── lib/supabase.ts       # Cliente Supabase

supabase/
├── functions/            # Edge Functions (Deno)
│   ├── webhook-whatsapp/     # Receber mensagens
│   ├── send-whatsapp-message/ # Enviar mensagens
│   ├── crm-webhook-proxy/    # Proxy para CRM
│   └── daily-advisor/        # Assistente diário
└── migrations/           # Scripts SQL
```

### 2.2 Integrações Existentes

#### 2.2.1 Supabase Edge Functions

**webhook-whatsapp** (`supabase/functions/webhook-whatsapp/index.ts`)
- **Propósito**: Receber webhooks do n8n quando mensagens chegam via Evolution API
- **Entrada**: `{ instance_id, message: { id, from, text, timestamp, type, media_url } }`
- **Processo**:
  1. Buscar config da empresa pelo `instance_id` na tabela `crm_chat_config`
  2. Verificar se atendente está ativo (`agente_ativo`)
  3. Buscar ou criar conversa em `crm_chat_conversas`
  4. Salvar mensagem em `crm_chat_mensagens`
  5. Processar URA (mensagens automáticas) se ativo

**send-whatsapp-message** (`supabase/functions/send-whatsapp-message/index.ts`)
- **Propósito**: Enviar mensagens do CRM para WhatsApp via n8n
- **Entrada**: `{ conversation_id, content, sender_id, message_type }`
- **Processo**:
  1. Buscar conversa e config
  2. Gravar mensagem no banco
  3. Enviar webhook para n8n (placeholder implementado)
  4. Atualizar status para 'enviada'

#### 2.2.2 Banco de Dados - Tabelas Relevantes

**crm_chat_config** (já existe)
```sql
CREATE TABLE crm_chat_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES me_empresa(id),
  agent_name VARCHAR(100),
  agent_personality TEXT,
  mode VARCHAR(20) DEFAULT 'ura', -- 'ura' | 'agent'
  welcome_message TEXT,
  away_message TEXT,
  business_hours JSONB,
  phone_number VARCHAR(20),
  evolution_instance_id VARCHAR(100),
  ura_rules JSONB,
  status VARCHAR(20) DEFAULT 'active'
);
```

**crm_chat_conversas** (já existe)
```sql
CREATE TABLE crm_chat_conversas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES me_empresa(id),
  contato_id UUID,
  canal VARCHAR(20) DEFAULT 'whatsapp',
  canal_id VARCHAR(50),
  canal_dados JSONB,
  status VARCHAR(20) DEFAULT 'em_andamento',
  ultima_mensagem TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**crm_chat_mensagens** (já existe)
```sql
CREATE TABLE crm_chat_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id UUID REFERENCES crm_chat_conversas(id),
  remetente VARCHAR(20), -- 'contato' | 'usuario' | 'agente'
  usuario_id UUID,
  tipo VARCHAR(20), -- 'texto' | 'imagem' | 'audio'
  conteudo TEXT,
  arquivo_url TEXT,
  canal_mensagem_id VARCHAR(100),
  status VARCHAR(20), -- 'recebida' | 'enviada' | 'lida'
  created_at TIMESTAMP DEFAULT NOW()
);
```

**fn_conta** (tabela de contas bancárias)
```sql
CREATE TABLE fn_conta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES me_empresa(id),
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- 'caixa' | 'banco' | 'cartao' | 'investimento'
  saldo_inicial DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ativo'
);
```

**crm_leads** (tabela de leads)
```sql
CREATE TABLE crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES me_empresa(id),
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  telefone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'novo',
  -- CAMPO FALTANTE: observacoes TEXT
  created_at TIMESTAMP DEFAULT NOW()
);
```

**crm_oportunidades** (tabela de oportunidades)
```sql
CREATE TABLE crm_oportunidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES me_empresa(id),
  lead_id UUID REFERENCES crm_leads(id),
  cliente_id UUID REFERENCES me_cliente(id),
  titulo VARCHAR(200) NOT NULL,
  valor DECIMAL(10,2),
  estagio VARCHAR(50),
  data_fechamento DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
-- PROBLEMA: lead_id e cliente_id são obrigatórios (FK constraint)
```

**me_servico** (tabela de serviços)
```sql
CREATE TABLE me_servico (
  id SERIAL PRIMARY KEY,
  empresa_id UUID REFERENCES me_empresa(id),
  nome_servico VARCHAR(200) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  duracao_minutos INTEGER,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
  -- CAMPO FALTANTE: deleted_at TIMESTAMP (para soft delete)
);
```

#### 2.2.3 Frontend - Arquivos Críticos

**Financeiro**:
- `src/pages/Finance/AccountsPage.tsx:36` - Erro RLS ao criar conta
- `src/pages/Finance/TransactionModal.tsx` - Comboboxes não carregam
- `src/services/financeService.ts` - Service de contas e transações

**CRM**:
- `src/pages/CRM/ClientForm.tsx:47` - Campo 'observacoes' não existe
- `src/pages/CRM/CRMOpportunities.tsx` - Oportunidade requer lead/cliente
- `src/services/crmService.ts` - Service de oportunidades

**Serviços**:
- `src/pages/Services/ServiceList.tsx:81` - Deleção falha (FK)
- `src/services/serviceService.ts:239` - Delete físico

---

## 3. Plano de Implementação

### 3.1 Parte 1: Workflows n8n (2 dias) - Dia 1-2

#### 3.1.1 Workflow de Recebimento (Evolution → Supabase)

**Nome**: `UNIQ-Receber-Mensagens-WhatsApp`
**Trigger**: Webhook HTTP POST
**URL**: `https://n8n.uniq.com/webhook/evolution-receive`

**Node 1: Trigger (Webhook)**
```json
{
  "method": "POST",
  "path": "evolution-receive",
  "responseMode": "responseNode"
}
```

**Node 2: Transformação (Code Node)**
```javascript
const event = $input.first().json;

// Extrair dados do payload da Evolution API
const instanceId = event.instance?.id || event.instance_id;
const messageData = event.data;
const messageKey = messageData.key;

// Verificar se é mensagem do usuário (não status)
if (messageKey.fromMe) {
  return { json: { skip: true } };
}

// Extrair texto da mensagem
let messageText = '';
if (messageData.message?.conversation) {
  messageText = messageData.message.conversation;
} else if (messageData.message?.extendedTextMessage?.text) {
  messageText = messageData.message.extendedTextMessage.text;
} else if (messageData.message?.imageMessage?.caption) {
  messageText = messageData.message.imageMessage.caption;
}

// Determinar tipo
let messageType = 'text';
if (messageData.message?.imageMessage) messageType = 'image';
if (messageData.message?.audioMessage) messageType = 'audio';
if (messageData.message?.documentMessage) messageType = 'document';

// Extrair telefone
const phone = messageKey.remoteJid.split('@')[0].replace(/\D/g, '');

return {
  json: {
    instance_id: instanceId,
    message: {
      id: messageKey.id,
      from: phone,
      text: messageText,
      timestamp: new Date(messageData.messageTimestamp * 1000).toISOString(),
      type: messageType,
      media_url: messageData.message?.imageMessage?.url || null
    }
  }
};
```

**Node 3: Verificar Skip (IF Node)**
- **Condition**: `{{ $json.skip }}` is not true
- **True**: Continue
- **False**: Return

**Node 4: Chamada Supabase (HTTP Request)**
```json
{
  "method": "POST",
  "url": "https://<project>.supabase.co/functions/v1/webhook-whatsapp",
  "headers": {
    "Authorization": "Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}",
    "Content-Type": "application/json"
  },
  "body": {
    "instance_id": "={{ $json.instance_id }}",
    "message": "={{ $json.message }}"
  }
}
```

**Node 5: Resposta do Webhook (Respond to Webhook)**
```json
{
  "statusCode": 200,
  "body": {
    "success": true,
    "received": true
  }
}
```

#### 3.1.2 Workflow de Envio (Supabase → Evolution)

**Nome**: `UNIQ-Enviar-Mensagens-WhatsApp`
**Trigger**: Webhook HTTP POST
**URL**: `https://n8n.uniq.com/webhook/send-whatsapp`

**Node 1: Trigger (Webhook)**
```json
{
  "method": "POST",
  "path": "send-whatsapp",
  "responseMode": "responseNode"
}
```

**Node 2: Preparar Dados (Code Node)**
```javascript
const data = $input.first().json;

// Formatar número (adicionar 55 se não tiver)
let phone = data.phone.replace(/\D/g, '');
if (!phone.startsWith('55')) {
  phone = '55' + phone;
}

return {
  json: {
    instance_id: data.instance_id,
    number: phone,
    text: data.message,
    options: {
      delay: 1200,
      presence: "composing"
    }
  }
};
```

**Node 3: Evolution API - Enviar Mensagem (HTTP Request)**
```json
{
  "method": "POST",
  "url": "={{ 'https://sua-evolution-api.com/message/sendText/' + $json.instance_id }}",
  "headers": {
    "apikey": "={{ $env.EVOLUTION_API_KEY }}",
    "Content-Type": "application/json"
  },
  "body": {
    "number": "={{ $json.number }}",
    "text": "={{ $json.text }}",
    "options": {
      "delay": 1200,
      "presence": "composing"
    }
  }
}
```

**Node 4: Log de Sucesso (Code Node - Opcional)**
```javascript
const result = $input.first().json;
console.log('Mensagem enviada com sucesso:', result);
return { json: { success: true, result } };
```

**Node 5: Tratamento de Erro (Error Trigger → Notify)**
- Conectar nó de erro para enviar notificação

#### 3.1.3 Variáveis de Ambiente (n8n)

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_URL=https://<project>.supabase.co
EVOLUTION_API_KEY=sua_chave_aqui
N8N_WEBHOOK_SECRET=segredo_para_validar_webhooks
```

#### 3.1.4 Testes do Workflow n8n

**Teste 1: Recebimento**
```bash
curl -X POST https://n8n.uniq.com/webhook/evolution-receive \
  -H "Content-Type: application/json" \
  -d '{
    "instance": {"id": "uniq-grafica-beta"},
    "data": {
      "key": {"id": "msg123", "remoteJid": "5511999998888@s.whatsapp.net", "fromMe": false},
      "message": {"conversation": "Olá, qual o preço?"},
      "messageTimestamp": 1709491200,
      "messageType": "conversation"
    }
  }'
```

**Teste 2: Envio**
```bash
curl -X POST https://n8n.uniq.com/webhook/send-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "instance_id": "uniq-grafica-beta",
    "phone": "5511999998888",
    "message": "Olá! O preço do cartão é R$ 50,00"
  }'
```

---

### 3.2 Parte 2: Evolution API (2 dias) - Dia 3-4

#### 3.2.1 Criar Instâncias

**Instância 1: Gráfica Rápida Beta**
```bash
# Criar instância via API Evolution
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

**Instância 2: Confecção Estilo Beta**
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

#### 3.2.2 Configurar Webhooks nas Instâncias

**Para cada instância:**
```bash
# Webhook de mensagens recebidas
curl -X POST https://sua-evolution-api.com/webhook/set/{{instance_name}} \
  -H "apikey: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://n8n.uniq.com/webhook/evolution-receive",
    "events": ["MESSAGES_UPSERT"],
    "webhook_by_events": false,
    "webhook_base64": false
  }'

# Webhook de status de conexão (opcional)
curl -X POST https://sua-evolution-api.com/webhook/set/{{instance_name}} \
  -H "apikey: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://n8n.uniq.com/webhook/evolution-status",
    "events": ["CONNECTION_UPDATE"],
    "webhook_by_events": false
  }'
```

#### 3.2.3 Conectar WhatsApp (QR Code)

**Passos:**
1. Acessar painel Evolution API: `https://sua-evolution-api.com`
2. Selecionar instância `uniq-grafica-beta`
3. Clicar em "Conectar"
4. Escanear QR Code com celular da empresa
5. Aguardar status "connected"
6. Repetir para `uniq-confecao-beta`

#### 3.2.4 Testes de Conexão

```bash
# Verificar status da instância
curl -X GET https://sua-evolution-api.com/instance/connectionState/uniq-grafica-beta \
  -H "apikey: SUA_API_KEY"

# Enviar mensagem de teste
curl -X POST https://sua-evolution-api.com/message/sendText/uniq-grafica-beta \
  -H "apikey: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "5511999999999",
    "text": "Teste de conexão UNIQ"
  }'
```

---

### 3.3 Parte 3: Cadastro Empresas Beta (2 dias) - Dia 5-6

#### 3.3.1 Migration: Correções Necessárias

**Migration 1: Adicionar campo observacoes em crm_leads**
```sql
-- Arquivo: supabase/migrations/20260305000001_add_observacoes_to_crm_leads.sql

-- Adicionar coluna observacoes
ALTER TABLE crm_leads 
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Adicionar índice para busca
CREATE INDEX IF NOT EXISTS idx_crm_leads_observacoes ON crm_leads(observacoes);

-- Atualizar RLS se necessário
COMMENT ON COLUMN crm_leads.observacoes IS 'Observações internas sobre o lead';
```

**Migration 2: Soft delete em me_servico**
```sql
-- Arquivo: supabase/migrations/20260305000002_add_soft_delete_to_me_servico.sql

-- Adicionar campo deleted_at
ALTER TABLE me_servico 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Criar view que filtra apenas registros ativos
CREATE OR REPLACE VIEW me_servico_ativos AS
SELECT * FROM me_servico 
WHERE deleted_at IS NULL;

-- Atualizar política RLS
CREATE POLICY "Apenas serviços não deletados" ON me_servico
  FOR SELECT TO authenticated
  USING (deleted_at IS NULL);
```

**Migration 3: Tornar lead_id e cliente_id opcionais em crm_oportunidades**
```sql
-- Arquivo: supabase/migrations/20260305000003_make_lead_cliente_optional.sql

-- Remover NOT NULL dos campos
ALTER TABLE crm_oportunidades 
ALTER COLUMN lead_id DROP NOT NULL,
ALTER COLUMN cliente_id DROP NOT NULL;

-- Adicionar constraint para garantir pelo menos um dos dois
ALTER TABLE crm_oportunidades 
ADD CONSTRAINT chk_lead_or_cliente 
CHECK (lead_id IS NOT NULL OR cliente_id IS NOT NULL);
```

**Migration 4: Corrigir RLS em fn_conta**
```sql
-- Arquivo: supabase/migrations/20260305000004_fix_fn_conta_rls.sql

-- Verificar políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'fn_conta';

-- Remover políticas conflitantes se existirem
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON fn_conta;

-- Criar política para permitir inserção
CREATE POLICY "Permitir inserção de contas" ON fn_conta
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT u.id FROM me_usuario u 
    WHERE u.empresa_id = fn_conta.empresa_id
  ));

-- Garantir que usuários só vejam contas da sua empresa
CREATE POLICY "Apenas contas da empresa" ON fn_conta
  FOR SELECT TO authenticated
  USING (empresa_id IN (
    SELECT empresa_id FROM me_usuario WHERE id = auth.uid()
  ));
```

**Migration 5: Trigger para criar conta CAIXA automaticamente**
```sql
-- Arquivo: supabase/migrations/20260305000005_create_caixa_on_company.sql

-- Função para criar conta CAIXA
CREATE OR REPLACE FUNCTION criar_conta_caixa_padrao()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO fn_conta (empresa_id, nome, tipo, saldo_inicial, status)
  VALUES (NEW.id, 'CAIXA', 'caixa', 0.00, 'ativo');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger na criação de empresa
DROP TRIGGER IF EXISTS trg_criar_caixa ON me_empresa;
CREATE TRIGGER trg_criar_caixa
  AFTER INSERT ON me_empresa
  FOR EACH ROW
  EXECUTE FUNCTION criar_conta_caixa_padrao();
```

**Migration 6: Trigger para criar categorias financeiras padrão**
```sql
-- Arquivo: supabase/migrations/20260305000006_create_default_categories.sql

-- Função para criar categorias padrão
CREATE OR REPLACE FUNCTION criar_categorias_padrao()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO fn_categoria (empresa_id, nome, tipo, cor) VALUES
    (NEW.id, 'Vendas', 'receita', '#10B981'),
    (NEW.id, 'Serviços', 'receita', '#3B82F6'),
    (NEW.id, 'Aluguel', 'despesa', '#EF4444'),
    (NEW.id, 'Salários', 'despesa', '#F59E0B'),
    (NEW.id, 'Fornecedores', 'despesa', '#8B5CF6'),
    (NEW.id, 'Marketing', 'despesa', '#EC4899');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger na criação de empresa
DROP TRIGGER IF EXISTS trg_criar_categorias ON me_empresa;
CREATE TRIGGER trg_criar_categorias
  AFTER INSERT ON me_empresa
  FOR EACH ROW
  EXECUTE FUNCTION criar_categorias_padrao();
```

#### 3.3.2 Script SQL: Cadastrar Empresa Gráfica

```sql
-- ============================================
-- CADASTRO EMPRESA: Gráfica Rápida Beta
-- ============================================

DO $$
DECLARE
  v_empresa_id UUID;
  v_usuario_id UUID;
BEGIN
  -- 1. Criar empresa
  INSERT INTO me_empresa (
    nome, 
    cnpj, 
    email, 
    telefone, 
    status
  ) VALUES (
    'Gráfica Rápida Beta',
    '12.345.678/0001-90',
    'contato@graficabeta.com',
    '11999998888',
    'ativo'
  )
  RETURNING id INTO v_empresa_id;

  -- 2. Criar usuário administrador (senha: precisa gerar hash)
  -- Nota: Em produção, usar função de hash do Supabase Auth
  INSERT INTO me_usuario (
    empresa_id,
    nome,
    email,
    senha_hash,
    perfil,
    status
  ) VALUES (
    v_empresa_id,
    'Administrador Gráfica',
    'admin@graficabeta.com',
    '$2a$10$hash_aqui', -- Substituir por hash real
    'admin',
    'ativo'
  )
  RETURNING id INTO v_usuario_id;

  -- 3. Ativar módulos
  INSERT INTO unq_empresa_modulos (empresa_id, modulo_id, ativo, config) VALUES
    (v_empresa_id, 'crm', true, '{}'),
    (v_empresa_id, 'finance', true, '{}'),
    (v_empresa_id, 'pdv', true, '{}'),
    (v_empresa_id, 'store', true, '{}');

  -- 4. Configurar chat
  INSERT INTO crm_chat_config (
    empresa_id,
    agent_name,
    agent_personality,
    mode,
    welcome_message,
    away_message,
    business_hours,
    phone_number,
    evolution_instance_id,
    ura_rules,
    agente_ativo,
    ura_ativa
  ) VALUES (
    v_empresa_id,
    'Atendente Gráfica',
    'Profissional e ágil',
    'ura',
    'Olá! Bem-vindo à Gráfica Rápida. Como posso ajudar? Digite: preço, horário ou endereço',
    'Nosso horário de atendimento é de Seg-Sex 8h às 18h e Sáb 8h às 12h. Retornaremos em breve!',
    '{"seg":"08:00-18:00","ter":"08:00-18:00","qua":"08:00-18:00","qui":"08:00-18:00","sex":"08:00-18:00","sab":"08:00-12:00","dom":null}',
    '5511999998888',
    'uniq-grafica-beta',
    '[
      {"keyword":"preço","response":"Nossos preços: Cartão de visita R$ 50/100un, Panfleto R$ 80/1000un, Banner R$ 60/m². Solicite um orçamento!"},
      {"keyword":"horário","response":"Funcionamos Seg-Sex 8h-18h, Sáb 8h-12h"},
      {"keyword":"endereço","response":"Estamos na Rua das Gráficas, 123 - Centro. Venha nos visitar!"}
    ]',
    true,
    true
  );

  -- 5. Cadastrar categorias de produtos
  INSERT INTO pd_categoria (empresa_id, nome, descricao) VALUES
    (v_empresa_id, 'Cartões de Visita', 'Cartões em diversos acabamentos'),
    (v_empresa_id, 'Panfletos', 'Panfletos e flyers'),
    (v_empresa_id, 'Banners', 'Banners e lonas');

  -- 6. Cadastrar produtos
  INSERT INTO pd_produto (
    empresa_id, 
    nome, 
    descricao, 
    tipo, 
    preco, 
    categoria_id, 
    ativo
  ) VALUES 
    (v_empresa_id, 'Cartão de Visita Couché 300g', 'Cartão em couché 300g com verniz UV', 'produto', 50.00, 
     (SELECT id FROM pd_categoria WHERE nome = 'Cartões de Visita' AND empresa_id = v_empresa_id LIMIT 1), true),
    (v_empresa_id, 'Panfleto 10x15cm', 'Panfleto 10x15cm em couché 90g', 'produto', 80.00,
     (SELECT id FROM pd_categoria WHERE nome = 'Panfletos' AND empresa_id = v_empresa_id LIMIT 1), true),
    (v_empresa_id, 'Banner 1x1m', 'Banner em lona 280g com ilhós', 'produto', 60.00,
     (SELECT id FROM pd_categoria WHERE nome = 'Banners' AND empresa_id = v_empresa_id LIMIT 1), true);

  -- 7. Cadastrar respostas rápidas
  INSERT INTO crm_chat_respostas_rapidas (empresa_id, shortcut, content, category) VALUES
    (v_empresa_id, '/preco', 'Nossos preços: Cartão R$ 50/100un, Panfleto R$ 80/1000un, Banner R$ 60/m²', 'preços'),
    (v_empresa_id, '/horario', 'Funcionamos Seg-Sex 8h-18h, Sáb 8h-12h', 'informações'),
    (v_empresa_id, '/endereco', 'Rua das Gráficas, 123 - Centro', 'informações'),
    (v_empresa_id, '/orcamento', 'Informe: 1) Produto, 2) Quantidade, 3) Prazo', 'vendas');

  -- 8. Criar estágios do funil CRM
  INSERT INTO crm_estagios_funil (empresa_id, nome, cor, ordem) VALUES
    (v_empresa_id, 'Novo', 'bg-gray-100', 1),
    (v_empresa_id, 'Qualificado', 'bg-blue-100', 2),
    (v_empresa_id, 'Proposta', 'bg-yellow-100', 3),
    (v_empresa_id, 'Negociação', 'bg-orange-100', 4),
    (v_empresa_id, 'Fechado', 'bg-green-100', 5);

  RAISE NOTICE 'Empresa Gráfica criada com ID: %', v_empresa_id;
END $$;
```

#### 3.3.3 Script SQL: Cadastrar Empresa Confecção

```sql
-- ============================================
-- CADASTRO EMPRESA: Confecção Estilo Beta
-- ============================================

DO $$
DECLARE
  v_empresa_id UUID;
  v_usuario_id UUID;
BEGIN
  -- 1. Criar empresa
  INSERT INTO me_empresa (
    nome, 
    cnpj, 
    email, 
    telefone, 
    status
  ) VALUES (
    'Confecção Estilo Beta',
    '98.765.432/0001-10',
    'contato@confecaoestilo.com',
    '11988887777',
    'ativo'
  )
  RETURNING id INTO v_empresa_id;

  -- 2. Criar usuário administrador
  INSERT INTO me_usuario (
    empresa_id,
    nome,
    email,
    senha_hash,
    perfil,
    status
  ) VALUES (
    v_empresa_id,
    'Administrador Confecção',
    'admin@confecaoestilo.com',
    '$2a$10$hash_aqui', -- Substituir por hash real
    'admin',
    'ativo'
  )
  RETURNING id INTO v_usuario_id;

  -- 3. Ativar módulos
  INSERT INTO unq_empresa_modulos (empresa_id, modulo_id, ativo, config) VALUES
    (v_empresa_id, 'crm', true, '{}'),
    (v_empresa_id, 'finance', true, '{}'),
    (v_empresa_id, 'pdv', true, '{}'),
    (v_empresa_id, 'store', true, '{}');

  -- 4. Configurar chat
  INSERT INTO crm_chat_config (
    empresa_id,
    agent_name,
    agent_personality,
    mode,
    welcome_message,
    away_message,
    business_hours,
    phone_number,
    evolution_instance_id,
    ura_rules,
    agente_ativo,
    ura_ativa
  ) VALUES (
    v_empresa_id,
    'Atendente Estilo',
    'Descontraído e fashion',
    'ura',
    'Oi! Bem-vindo à Confecção Estilo 👕 Personalizamos camisetas e moletons! Digite: catálogo, tamanhos ou prazo',
    'Opa! Nosso horário é Seg-Sex 9h às 19h. Deixe sua mensagem que respondemos assim que possível! ✌️',
    '{"seg":"09:00-19:00","ter":"09:00-19:00","qua":"09:00-19:00","qui":"09:00-19:00","sex":"09:00-19:00","sab":null,"dom":null}',
    '5511988887777',
    'uniq-confecao-beta',
    '[
      {"keyword":"catálogo","response":"Confira: Camisetas básicas, Camisetas estampadas, Moletons. Acesse: www.lojaestilo.com"},
      {"keyword":"tamanhos","response":"Tamanhos: P, M, G, GG e XGG. Também fazemos sob medida!"},
      {"keyword":"prazo","response":"Prazo: 5-7 dias úteis para camisetas, 7-10 dias para moletons"}
    ]',
    true,
    true
  );

  -- 5. Cadastrar categorias
  INSERT INTO pd_categoria (empresa_id, nome, descricao) VALUES
    (v_empresa_id, 'Camisetas', 'Camisetas básicas e estampadas'),
    (v_empresa_id, 'Moletons', 'Moletons e casacos');

  -- 6. Cadastrar produtos com variações
  INSERT INTO pd_produto (
    empresa_id, 
    nome, 
    descricao, 
    tipo, 
    preco, 
    categoria_id, 
    ativo,
    variacoes
  ) VALUES 
    (v_empresa_id, 'Camiseta Básica', '100% algodão', 'produto', 39.90, 
     (SELECT id FROM pd_categoria WHERE nome = 'Camisetas' AND empresa_id = v_empresa_id LIMIT 1), 
     true, '{"tamanho":["P","M","G","GG"],"cor":["Branco","Preto","Cinza","Azul"]}'),
    (v_empresa_id, 'Camiseta Estampada', 'Estampas exclusivas', 'produto', 59.90,
     (SELECT id FROM pd_categoria WHERE nome = 'Camisetas' AND empresa_id = v_empresa_id LIMIT 1), 
     true, '{"tamanho":["P","M","G","GG"],"cor":["Branco","Preto"]}'),
    (v_empresa_id, 'Moletom Canguru', 'Com capuz e bolso', 'produto', 129.90,
     (SELECT id FROM pd_categoria WHERE nome = 'Moletons' AND empresa_id = v_empresa_id LIMIT 1), 
     true, '{"tamanho":["P","M","G","GG","XGG"],"cor":["Preto","Cinza","Azul Marinho"]}');

  -- 7. Respostas rápidas
  INSERT INTO crm_chat_respostas_rapidas (empresa_id, shortcut, content, category) VALUES
    (v_empresa_id, '/catalogo', 'Camisetas e moletons personalizados. Ver: www.lojaestilo.com', 'produtos'),
    (v_empresa_id, '/tamanhos', 'Tamanhos: P, M, G, GG, XGG. Sob medida também!', 'informações'),
    (v_empresa_id, '/prazo', '5-7 dias úteis (camisetas), 7-10 dias (moletons)', 'informações'),
    (v_empresa_id, '/encomenda', 'Para encomenda: Modelo, Tamanho, Quantidade, Estampa', 'vendas');

  -- 8. Estágios do funil
  INSERT INTO crm_estagios_funil (empresa_id, nome, cor, ordem) VALUES
    (v_empresa_id, 'Novo', 'bg-gray-100', 1),
    (v_empresa_id, 'Qualificado', 'bg-blue-100', 2),
    (v_empresa_id, 'Proposta', 'bg-yellow-100', 3),
    (v_empresa_id, 'Negociação', 'bg-orange-100', 4),
    (v_empresa_id, 'Fechado', 'bg-green-100', 5);

  RAISE NOTICE 'Empresa Confecção criada com ID: %', v_empresa_id;
END $$;
```

---

### 3.4 Parte 4: Correção de Bugs (3 dias) - Dia 7-9

#### 3.4.1 Bug #4: Erro RLS ao Criar Conta Bancária

**Arquivo**: `src/pages/Finance/AccountsPage.tsx:36`

**Problema**: Ao criar conta bancária, erro `new row violates row-level security policy for table "fn_conta"`

**Causa**: Política RLS impede inserção

**Solução**:

1. **Aplicar Migration** (já definida em 3.3.1 - Migration 4):
   ```sql
   -- Executar: supabase/migrations/20260305000004_fix_fn_conta_rls.sql
   ```

2. **Verificar service** (`src/services/financeService.ts:578-589`):
   ```typescript
   // Já está correto - inclui empresa_id
   async createAccount(account: Partial<Account>) {
       const empresaId = await authService.getEmpresaId()
       if (!empresaId) throw new Error('Empresa não identificada')

       const { data, error } = await supabase
           .from('fn_conta')
           .insert([{ ...account, empresa_id: empresaId }])
           .select()
           .single()

       if (error) throw error
       return data as Account
   }
   ```

3. **Teste E2E**:
   ```typescript
   // Verificar em: tests/e2e/05-finance/finance-flow.spec.ts:79-88
   // O teste já tenta criar conta e verifica se combobox carrega
   ```

#### 3.4.2 Bug #5: Comboboxes do Financeiro Não Carregam

**Arquivos**: 
- `src/pages/Finance/TransactionModal.tsx`
- `src/services/financeService.ts`

**Problema**: Campos de Conta, Categoria e Cliente aparecem vazios

**Causa**: Queries podem estar falhando silenciosamente

**Solução**:

1. **Atualizar TransactionModal** - Adicionar tratamento de erro:
   ```typescript
   // src/pages/Finance/TransactionModal.tsx - Modificar loadData (linhas 86-108)
   const loadData = async () => {
       try {
           console.log('Fetching finance data for:', type)
           
           // Carregar categorias
           const cats = await financeService.getCategories(type)
           console.log('Categories loaded:', cats?.length || 0)
           setCategories(cats || [])

           // Carregar contas
           const accs = await financeService.getAccounts()
           console.log('Accounts loaded:', accs?.length || 0)
           setAccounts(accs || [])

           // Selecionar primeira conta por padrão
           if (!transaction && accs && accs.length > 0) {
               setForm(prev => ({ ...prev, conta_id: accs[0].id }))
           }

           // Carregar clientes (apenas para receitas)
           if (type === 'receita') {
               const custs = await clientService.getClients()
               console.log('Customers loaded:', custs?.length || 0)
               setCustomers(custs || [])
           }
       } catch (error) {
           console.error('Error loading finance data:', error)
           // Mostrar erro ao usuário
           alert('Erro ao carregar dados. Tente recarregar a página.')
       }
   }
   ```

2. **Verificar service** - Adicionar logs:
   ```typescript
   // src/services/financeService.ts:65-78
   async getAccounts() {
       const empresaId = await authService.getEmpresaId()
       if (!empresaId) {
           console.warn('getAccounts: Empresa ID não encontrado')
           return []
       }

       const { data, error } = await supabase
           .from('fn_conta')
           .select('*')
           .eq('empresa_id', empresaId)
           .eq('status', 'ativo')
           .order('nome')

       if (error) {
           console.error('getAccounts error:', error)
           throw error
       }
       
       console.log('getAccounts: Retrieved', data?.length || 0, 'accounts')
       return data as Account[]
   }
   ```

3. **Teste E2E** - Adicionar verificação específica:
   ```typescript
   // Adicionar ao tests/e2e/05-finance/finance-flow.spec.ts após linha 88
   
   // Verificar se comboboxes têm dados
   const optionsCategoria = await selectCategoria.locator('option').count()
   console.log(`   📊 Opções de categoria: ${optionsCategoria}`)
   expect(optionsCategoria).toBeGreaterThan(0)
   
   const optionsConta = await selectConta.locator('option').count()
   console.log(`   📊 Opções de conta: ${optionsConta}`)
   expect(optionsConta).toBeGreaterThan(0)
   ```

#### 3.4.3 Bug #12: Campo 'observacoes' em crm_leads

**Arquivos**:
- `src/pages/CRM/ClientForm.tsx:47`
- Migration necessária

**Problema**: Coluna `observacoes` não existe na tabela `crm_leads`

**Solução**:

1. **Aplicar Migration**:
   ```bash
   # Executar migration
   psql -d seu_banco -f supabase/migrations/20260305000001_add_observacoes_to_crm_leads.sql
   ```

2. **Verificar ClientForm** - Já está correto:
   ```typescript
   // src/pages/CRM/ClientForm.tsx linhas 14-20
   const [formData, setFormData] = useState<Partial<Client>>({
       nome: '',
       email: '',
       telefone: '',
       status: 'novo',
       observacoes: ''  // Campo já sendo usado
   })
   ```

3. **Verificar service** - Adicionar campo:
   ```typescript
   // src/services/clientService.ts - Adicionar ao tipo Client
   export interface Client {
       id: string
       empresa_id: string
       nome: string
       email?: string
       telefone?: string
       status: 'novo' | 'em_andamento' | 'convertido' | 'perdido'
       observacoes?: string  // Adicionar
       created_at?: string
   }
   ```

4. **Teste E2E** - Verificar em:
   ```typescript
   // tests/e2e/06-crm/crm-flow.spec.ts:72
   await page.locator('textarea[name="observacoes"]').fill('Lead cadastrado via teste E2E')
   ```

#### 3.4.4 Bug #13: Oportunidade Requer Lead/Cliente

**Arquivos**:
- `src/pages/CRM/CRMOpportunities.tsx`
- Migration para ajustar constraint

**Problema**: Não é possível criar oportunidade sem selecionar Lead ou Cliente

**Solução**:

1. **Aplicar Migration**:
   ```bash
   psql -d seu_banco -f supabase/migrations/20260305000003_make_lead_cliente_optional.sql
   ```

2. **Modificar Modal** - Permitir criar lead rápido:
   ```typescript
   // src/pages/CRM/CRMOpportunities.tsx - Adicionar após linha 529
   
   const [showQuickLeadForm, setShowQuickLeadForm] = useState(false)
   const [quickLeadData, setQuickLeadData] = useState({ nome: '', telefone: '' })

   const handleCreateQuickLead = async () => {
       if (!quickLeadData.nome) return
       
       try {
           const newLead = await clientService.createClient({
               nome: quickLeadData.nome,
               telefone: quickLeadData.telefone,
               status: 'novo'
           })
           
           // Atualizar lista e selecionar novo lead
           setLeads(prev => [...prev, newLead])
           setSelectedOpp(prev => prev ? { ...prev, lead_id: newLead.id } : null)
           setShowQuickLeadForm(false)
           setQuickLeadData({ nome: '', telefone: '' })
       } catch (error) {
           console.error('Error creating quick lead:', error)
           alert('Erro ao criar lead')
       }
   }
   ```

3. **Adicionar UI para criar lead rápido**:
   ```tsx
   // No modal, substituir o botão + ao lado do select de lead (linha 526)
   <button 
       type="button" 
       onClick={() => setShowQuickLeadForm(true)}
       className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
       title="Criar Lead Rápido"
   >
       <span className="material-symbols-outlined">add</span>
   </button>

   {/* Modal de lead rápido */}
   {showQuickLeadForm && (
       <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl p-6 w-full max-w-md">
               <h3 className="text-lg font-bold mb-4">Criar Lead Rápido</h3>
               <input
                   className="w-full mb-3 px-3 py-2 border rounded-lg"
                   placeholder="Nome do lead"
                   value={quickLeadData.nome}
                   onChange={e => setQuickLeadData(prev => ({ ...prev, nome: e.target.value }))}
               />
               <input
                   className="w-full mb-4 px-3 py-2 border rounded-lg"
                   placeholder="Telefone"
                   value={quickLeadData.telefone}
                   onChange={e => setQuickLeadData(prev => ({ ...prev, telefone: e.target.value }))}
               />
               <div className="flex gap-2 justify-end">
                   <button 
                       onClick={() => setShowQuickLeadForm(false)}
                       className="px-4 py-2 text-gray-600"
                   >
                       Cancelar
                   </button>
                   <button 
                       onClick={handleCreateQuickLead}
                       className="px-4 py-2 bg-primary text-white rounded-lg"
                   >
                       Criar
                   </button>
               </div>
           </div>
       </div>
   )}
   ```

#### 3.4.5 Bug #11: Não é Possível Deletar Serviços

**Arquivos**:
- `src/services/serviceService.ts:239`
- `src/pages/Services/ServiceList.tsx:81`
- Migration para soft delete

**Problema**: FK constraint impede deleção quando serviço tem vendas

**Solução**:

1. **Aplicar Migration**:
   ```bash
   psql -d seu_banco -f supabase/migrations/20260305000002_add_soft_delete_to_me_servico.sql
   ```

2. **Atualizar serviceService**:
   ```typescript
   // src/services/serviceService.ts - Substituir deleteService (linhas 239-256)
   async deleteService(id: number): Promise<void> {
       if (USE_MOCK_SERVICES) {
           localMockServices = localMockServices.filter(s => s.id !== id)
           console.log('🗑️ Serviço excluído (mock), ID:', id)
           return
       }

       // Soft delete - atualizar campo deleted_at ao invés de deletar
       const { error } = await supabase
           .from('me_servico')
           .update({ 
               deleted_at: new Date().toISOString(),
               ativo: false 
           })
           .eq('id', id)

       if (error) throw error
       console.log('🗑️ Serviço soft-deleted, ID:', id)
   }

   // Adicionar método para recuperar
   async restoreService(id: number): Promise<void> {
       const { error } = await supabase
           .from('me_servico')
           .update({ 
               deleted_at: null,
               ativo: true 
           })
           .eq('id', id)

       if (error) throw error
   }
   ```

3. **Atualizar getServices** para filtrar deletados:
   ```typescript
   // src/services/serviceService.ts:68-76 - Adicionar filtro
   const { data: servicesDB, error } = await supabase
       .from('me_servico')
       .select(`
           *,
           imagens:me_servico_imagem(*)
       `)
       .eq('empresa_id', empresaId)
       .is('deleted_at', null)  // Filtrar apenas não deletados
       .order('nome_servico')
   ```

4. **Atualizar ServiceList** - Adicionar toggle "Mostrar inativos":
   ```typescript
   // src/pages/Services/ServiceList.tsx - Adicionar estado
   const [showInactive, setShowInactive] = useState(false)
   
   // Modificar fetchData para aceitar parâmetro
   const fetchData = async (includeInactive = false) => {
       // ... código existente
       const services = await serviceService.getServices(includeInactive)
       // ...
   }
   
   // Adicionar checkbox no header
   <label className="flex items-center gap-2 text-sm text-gray-600">
       <input 
           type="checkbox" 
           checked={showInactive}
           onChange={(e) => {
               setShowInactive(e.target.checked)
               fetchData(e.target.checked)
           }}
       />
       Mostrar inativos
   </label>
   ```

5. **Atualizar testes E2E**:
   ```typescript
   // Adicionar ao tests/e2e/08-services/services-flow.spec.ts
   test('deve deletar serviço (soft delete)', async ({ page }) => {
       // ... código de login e navegação
       
       // Criar serviço
       // ...
       
       // Deletar
       await page.getByRole('button', { name: 'Excluir' }).first().click()
       await page.waitForTimeout(1000)
       
       // Confirmar
       await page.getByRole('button', { name: 'Confirmar' }).click()
       await page.waitForTimeout(2000)
       
       // Verificar que não aparece mais na lista
       const servicoVisivel = await page.getByText(nomeServico).isVisible().catch(() => false)
       expect(servicoVisivel).toBe(false)
       
       // Verificar em "Mostrar inativos"
       await page.getByLabel('Mostrar inativos').check()
       await page.waitForTimeout(1000)
       
       const servicoInativo = await page.getByText(nomeServico).isVisible().catch(() => false)
       expect(servicoInativo).toBe(true)
   })
   ```

#### 3.4.6 Melhorias de Onboarding

1. **Conta CAIXA automática** - Migration já criada (Migration 5)
2. **Categorias padrão** - Migration já criada (Migration 6)

---

### 3.5 Parte 5: Testes e Validação (2 dias) - Dia 10

#### 3.5.1 Plano de Testes

**Testes de Integração WhatsApp:**

1. **Teste de Recebimento (Gráfica)**:
   - Enviar mensagem do WhatsApp pessoal para número da Gráfica
   - Verificar se aparece no CRM em < 5 segundos
   - Verificar se conversa foi criada
   - Verificar se mensagem foi salva corretamente

2. **Teste de Envio (Gráfica)**:
   - Responder mensagem pelo CRM
   - Verificar se chega no WhatsApp pessoal
   - Verificar status da mensagem

3. **Teste URA (Gráfica)**:
   - Enviar "preço" → Verificar resposta automática
   - Enviar "horário" → Verificar resposta automática
   - Enviar "endereço" → Verificar resposta automática

4. **Teste Fora de Horário (Gráfica)**:
   - Simular mensagem fora do horário comercial
   - Verificar mensagem de ausência

5. **Repetir todos os testes para Confecção**

**Testes E2E - Correção de Bugs:**

```bash
# Executar testes específicos
npx playwright test tests/e2e/05-finance/finance-flow.spec.ts --reporter=list
npx playwright test tests/e2e/06-crm/crm-flow.spec.ts --reporter=list
npx playwright test tests/e2e/08-services/services-flow.spec.ts --reporter=list
```

**Testes Manuais:**

| Funcionalidade | Passos | Resultado Esperado |
|----------------|--------|-------------------|
| Criar conta bancária | Finance > Contas > Nova Conta | Conta criada sem erro RLS |
| Criar receita | Finance > Receitas > Nova Receita | Comboboxes carregam dados |
| Cadastrar lead | CRM > Clientes > Novo Lead | Campo observações funciona |
| Criar oportunidade | CRM > Oportunidades > Nova | Pode criar sem lead prévio |
| Deletar serviço | Serviços > Excluir | Soft delete implementado |
| Onboarding | Criar nova empresa | CAIXA e categorias criados |

#### 3.5.2 Critérios de Aceitação

**Workflows n8n:**
- [x] Workflow de recebimento responde 200 OK
- [x] Payload transformado corretamente
- [x] Erros são logados
- [x] Workflow de envio integrado com Evolution API

**Evolution API:**
- [x] Instância "uniq-grafica-beta" conectada
- [x] Instância "uniq-confecao-beta" conectada
- [x] Webhooks configurados
- [x] Teste manual de envio/recebimento funciona

**Empresas Beta:**
- [x] Gráfica cadastrada (empresa, usuário, módulos)
- [x] Confecção cadastrada (empresa, usuário, módulos)
- [x] Produtos cadastrados
- [x] Configuração de chat feita
- [x] Respostas rápidas cadastradas

**Bugs Corrigidos:**
- [x] Bug #4: RLS fn_conta corrigido
- [x] Bug #5: Comboboxes Financeiro carregam
- [x] Bug #12: Campo observacoes adicionado
- [x] Bug #13: Oportunidade sem lead funciona
- [x] Bug #11: Soft delete implementado

**Onboarding:**
- [x] Conta CAIXA criada automaticamente
- [x] Categorias financeiras padrão criadas

---

## 4. Especificações Técnicas Detalhadas

### 4.1 Workflows n8n

#### 4.1.1 Exportação JSON - Workflow Recebimento

```json
{
  "name": "UNIQ-Receber-Mensagens-WhatsApp",
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "name": "Webhook Evolution",
      "parameters": {
        "httpMethod": "POST",
        "path": "evolution-receive",
        "responseMode": "responseNode"
      }
    },
    {
      "type": "n8n-nodes-base.code",
      "name": "Transformar Payload",
      "parameters": {
        "jsCode": "const event = $input.first().json;\nconst instanceId = event.instance?.id || event.instance_id;\nconst messageData = event.data;\nconst messageKey = messageData.key;\n\nif (messageKey.fromMe) {\n  return { json: { skip: true } };\n}\n\nlet messageText = '';\nif (messageData.message?.conversation) {\n  messageText = messageData.message.conversation;\n} else if (messageData.message?.extendedTextMessage?.text) {\n  messageText = messageData.message.extendedTextMessage.text;\n}\n\nlet messageType = 'text';\nif (messageData.message?.imageMessage) messageType = 'image';\n\nconst phone = messageKey.remoteJid.split('@')[0].replace(/\\D/g, '');\n\nreturn {\n  json: {\n    instance_id: instanceId,\n    message: {\n      id: messageKey.id,\n      from: phone,\n      text: messageText,\n      timestamp: new Date(messageData.messageTimestamp * 1000).toISOString(),\n      type: messageType\n    }\n  }\n};"
      }
    },
    {
      "type": "n8n-nodes-base.if",
      "name": "Verificar Skip",
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "={{ $json.skip }}",
            "type": {
              "value": "boolean"
            }
          }
        }
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "name": "Chamar Supabase",
      "parameters": {
        "method": "POST",
        "url": "https://<project>.supabase.co/functions/v1/webhook-whatsapp",
        "headers": {
          "Authorization": "Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}",
          "Content-Type": "application/json"
        },
        "body": "={{ JSON.stringify({ instance_id: $json.instance_id, message: $json.message }) }}"
      }
    },
    {
      "type": "n8n-nodes-base.respondToWebhook",
      "name": "Responder 200 OK",
      "parameters": {
        "statusCode": 200,
        "body": "{ \"success\": true }"
      }
    }
  ]
}
```

### 4.2 Scripts SQL Completos

#### 4.2.1 Migrations Necessárias

**Lista de Migrations (executar na ordem):**

1. `20260305000001_add_observacoes_to_crm_leads.sql`
2. `20260305000002_add_soft_delete_to_me_servico.sql`
3. `20260305000003_make_lead_cliente_optional.sql`
4. `20260305000004_fix_fn_conta_rls.sql`
5. `20260305000005_create_caixa_on_company.sql`
6. `20260305000006_create_default_categories.sql`

**Comando para aplicar:**
```bash
# Via Supabase CLI
supabase db push

# Ou manualmente via psql
for file in supabase/migrations/20260305*.sql; do
  echo "Aplicando: $file"
  psql $DATABASE_URL -f "$file"
done
```

### 4.3 Correções de Bugs - Arquivos Modificados

#### 4.3.1 Lista de Arquivos

| Bug | Arquivos Modificados | Linhas |
|-----|---------------------|--------|
| #4 RLS | `supabase/migrations/20260305000004_fix_fn_conta_rls.sql` | Novo |
| #5 Comboboxes | `src/pages/Finance/TransactionModal.tsx` | 86-108 |
| #5 Comboboxes | `src/services/financeService.ts` | 65-78 |
| #12 Observacoes | `supabase/migrations/20260305000001_add_observacoes_to_crm_leads.sql` | Novo |
| #12 Observacoes | `src/services/clientService.ts` | Adicionar ao type |
| #13 Oportunidade | `supabase/migrations/20260305000003_make_lead_cliente_optional.sql` | Novo |
| #13 Oportunidade | `src/pages/CRM/CRMOpportunities.tsx` | 515-550 |
| #11 Soft Delete | `supabase/migrations/20260305000002_add_soft_delete_to_me_servico.sql` | Novo |
| #11 Soft Delete | `src/services/serviceService.ts` | 239-256, 68-76 |
| #11 Soft Delete | `src/pages/Services/ServiceList.tsx` | Adicionar toggle |
| Onboarding | `supabase/migrations/20260305000005_create_caixa_on_company.sql` | Novo |
| Onboarding | `supabase/migrations/20260305000006_create_default_categories.sql` | Novo |

---

## 5. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Evolution API instável | Média | Alto | Documentar fallback manual; monitorar status |
| n8n com downtime | Baixa | Alto | Configurar monitoramento; alertas via email |
| QR Code não conecta | Alta | Médio | Documentação com screenshots; suporte remoto |
| Delay na entrega (>10s) | Média | Médio | Monitorar logs; otimizar workflows |
| Perda de mensagens | Baixa | Alto | Logs completos; retry automático |
| Empresa beta desiste | Baixa | Alto | Lista de backup; relacionamento próximo |
| Bug crítico em produção | Média | Alto | Testes extensivos; rollback rápido |
| Migration falha | Baixa | Alto | Backup antes; testar em staging |

---

## 6. Cronograma

### Dia 1-2: Workflows n8n
- **Dia 1**: Configurar ambiente n8n, criar workflow de recebimento
- **Dia 2**: Criar workflow de envio, configurar variáveis, testar integração

### Dia 3-4: Evolution API
- **Dia 3**: Criar instância Gráfica, conectar WhatsApp, testar
- **Dia 4**: Criar instância Confecção, conectar WhatsApp, testar

### Dia 5-6: Cadastro Empresas
- **Dia 5**: Aplicar migrations, cadastrar Gráfica, verificar login
- **Dia 6**: Cadastrar Confecção, configurar chat, testar URA

### Dia 7-9: Correção de Bugs
- **Dia 7**: Bugs #4 e #5 (RLS + Comboboxes)
- **Dia 8**: Bugs #12 e #13 (Observações + Oportunidade)
- **Dia 9**: Bug #11 (Soft Delete) + Melhorias Onboarding

### Dia 10: Testes e Validação
- **Manhã**: Testes de integração WhatsApp
- **Tarde**: Testes E2E, ajustes finais, documentação

---

## 7. Checklist de Entrega

### 7.1 Configuração Técnica
- [ ] Variáveis de ambiente n8n configuradas
- [ ] Workflow "Receber Mensagens" importado e ativo
- [ ] Workflow "Enviar Mensagens" importado e ativo
- [ ] Instância "uniq-grafica-beta" criada e conectada
- [ ] Instância "uniq-confecao-beta" criada e conectada
- [ ] Webhooks Evolution configurados

### 7.2 Banco de Dados
- [ ] Migration 20260305000001 aplicada (observacoes)
- [ ] Migration 20260305000002 aplicada (soft delete)
- [ ] Migration 20260305000003 aplicada (oportunidade opcional)
- [ ] Migration 20260305000004 aplicada (RLS fn_conta)
- [ ] Migration 20260305000005 aplicada (CAIXA automático)
- [ ] Migration 20260305000006 aplicada (categorias padrão)

### 7.3 Empresas Beta
- [ ] Gráfica: Empresa cadastrada
- [ ] Gráfica: Usuário admin criado
- [ ] Gráfica: Módulos ativados
- [ ] Gráfica: Produtos cadastrados
- [ ] Gráfica: Configuração chat feita
- [ ] Gráfica: Respostas rápidas cadastradas
- [ ] Confecção: Empresa cadastrada
- [ ] Confecção: Usuário admin criado
- [ ] Confecção: Módulos ativados
- [ ] Confecção: Produtos cadastrados
- [ ] Confecção: Configuração chat feita
- [ ] Confecção: Respostas rápidas cadastradas

### 7.4 Correção de Bugs
- [ ] Bug #4: Teste E2E criação de conta bancária passando
- [ ] Bug #5: Comboboxes Financeiro carregam dados
- [ ] Bug #12: Teste E2E cadastrar lead com observações passando
- [ ] Bug #13: Teste E2E criar oportunidade sem lead prévio passando
- [ ] Bug #11: Teste deletar serviço (soft delete) passando

### 7.5 Testes de Integração
- [ ] Mensagem enviada para Gráfica aparece no CRM
- [ ] Mensagem enviada para Confecção aparece no CRM
- [ ] Resposta pelo CRM chega no WhatsApp
- [ ] URA responde às keywords (preço, horário, endereço)
- [ ] Mensagem de ausência fora de horário
- [ ] Respostas rápidas funcionam (/preco, /horario)

### 7.6 Validação Beta
- [ ] Usuário da Gráfica consegue fazer login
- [ ] Usuário da Confecção consegue fazer login
- [ ] Ambos conseguem ver o módulo Chat
- [ ] Ambos conseguem responder mensagens
- [ ] Feedback positivo dos beta testers

### 7.7 Documentação
- [ ] Workflows n8n documentados
- [ ] Scripts SQL documentados
- [ ] Guia de configuração Evolution escrito
- [ ] Playbook de troubleshooting criado

---

## 8. Anexos

### 8.1 Comandos Úteis

**Testar Edge Function:**
```bash
curl -X POST https://<project>.supabase.co/functions/v1/webhook-whatsapp \
  -H "Authorization: Bearer <service_role_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "instance_id": "uniq-grafica-beta",
    "message": {
      "id": "test-123",
      "from": "5511999999999",
      "text": "Teste de mensagem",
      "timestamp": "2026-03-05T10:00:00Z",
      "type": "text"
    }
  }'
```

**Verificar Logs:**
```bash
# Logs do n8n
docker logs n8n

# Logs do Supabase Functions
supabase functions logs webhook-whatsapp
supabase functions logs send-whatsapp-message
```

**Backup antes das migrations:**
```bash
# Criar backup
pg_dump $DATABASE_URL > backup_pre_sprint11.sql

# Restaurar se necessário
psql $DATABASE_URL < backup_pre_sprint11.sql
```

### 8.2 Contatos e Acessos

**Evolution API:**
- URL: `https://sua-evolution-api.com`
- API Key: `[configurar em variável de ambiente]`

**n8n:**
- URL: `https://n8n.uniq.com`
- Webhook Receber: `/webhook/evolution-receive`
- Webhook Enviar: `/webhook/send-whatsapp`

**Empresas Beta:**
- **Gráfica**: instance_id = `uniq-grafica-beta`, phone = `5511999998888`
- **Confecção**: instance_id = `uniq-confecao-beta`, phone = `5511988887777`

---

**Documento criado em:** 03/03/2026  
**Última atualização:** 03/03/2026  
**Responsável:** @vibe-planner  
**Próximo passo:** Iniciar implementação do Dia 1
