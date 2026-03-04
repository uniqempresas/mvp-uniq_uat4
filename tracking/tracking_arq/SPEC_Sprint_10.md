# Especificação Técnica - Sprint 10
## UNIQ Empresas - Unificação CRM + Atendente

**Versão:** 1.0  
**Data:** 01/03/2026  
**Status:** Especificação  
**Arquiteto:** NEO - O Arquiteto UNIQ  

---

## 1. Visão Geral da Arquitetura

### 1.1 Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | React + TypeScript | 18.x |
| **UI Framework** | Tailwind CSS + shadcn/ui | 3.x |
| **Backend** | Supabase (PostgreSQL) | 15.x |
| **Edge Functions** | Deno/TypeScript | 1.40+ |
| **Integração WhatsApp** | Evolution API + n8n | Latest |
| **Estado** | Zustand | 4.x |
| **Query Client** | TanStack Query | 5.x |

### 1.2 Componentes Principais

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────┤
│  CRM Module                                                 │
│  ├── CRMConversations (unificado)                          │
│  ├── CRMSettings (atualizado - add config chat)            │
│  └── CRMChatWindow (atualizado - canais)                   │
│                                                             │
│  [REMOVIDO] Atendente Module                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Supabase)                        │
├─────────────────────────────────────────────────────────────┤
│  Database                                                   │
│  ├── crm_chat_conversas (atualizado)                       │
│  ├── crm_chat_mensagens                                    │
│  ├── crm_chat_config (novo)                                │
│  ├── crm_chat_respostas_rapidas (novo)                     │
│  └── [Migração] atd_* → crm_chat_*                         │
│                                                             │
│  Edge Functions                                             │
│  ├── webhook-whatsapp (atualizado)                         │
│  └── send-whatsapp-message (atualizado)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              INTEGRAÇÃO (n8n + Evolution)                   │
├─────────────────────────────────────────────────────────────┤
│  n8n Workflows                                              │
│  ├── Recebimento: Evolution → Supabase                     │
│  └── Envio: Supabase → n8n → Evolution                     │
│                                                             │
│  Evolution API                                              │
│  └── Gateway WhatsApp Oficial                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Requisitos Funcionais (RF)

### RF-01: Unificação CRM + Atendente

**Descrição:** Consolidar todos os recursos do módulo Atendente dentro do módulo CRM.

**Critérios de Aceitação:**
- [ ] Remover menu "Atendente" da navegação principal
- [ ] Migrar funcionalidades para aba "Conversas" do CRM
- [ ] Manter todas as funcionalidades existentes
- [ ] Preservar histórico de mensagens
- [ ] Redirecionar URLs antigas `/atendente/*` → `/crm/conversas`

**Tarefas Técnicas:**
1. Remover rotas do módulo Atendente
2. Atualizar componente CRMConversations
3. Implementar redirects no router
4. Atualizar permissões (RBAC)

### RF-02: Migração de Dados (atd_* → crm_chat_*)

**Descrição:** Migrar todos os dados das tabelas antigas do Atendente para as novas estruturas do CRM Chat.

**Tabelas de Origem:**
- `atd_conversas`
- `atd_mensagens`
- `atd_tags`
- `atd_conversa_tags`

**Tabelas de Destino:**
- `crm_chat_conversas` (com coluna `canal`)
- `crm_chat_mensagens`
- `crm_tags` (já existe)
- `crm_conversa_tags` (já existe)

**Mapeamento de Dados:**
```sql
-- Conversas
atd_conversas.id → crm_chat_conversas.id
atd_conversas.cliente_id → crm_chat_conversas.contato_id
atd_conversas.status → crm_chat_conversas.status
atd_conversas.ultima_mensagem_em → crm_chat_conversas.updated_at
'whatsapp' → crm_chat_conversas.canal (default para migração)
atd_conversas.created_at → crm_chat_conversas.created_at

-- Mensagens
atd_mensagens.id → crm_chat_mensagens.id
atd_mensagens.conversa_id → crm_chat_mensagens.conversa_id
atd_mensagens.remetente → crm_chat_mensagens.remetente
atd_mensagens.tipo → crm_chat_mensagens.tipo
atd_mensagens.conteudo → crm_chat_mensagens.conteudo
atd_mensagens.arquivo_url → crm_chat_mensagens.arquivo_url
atd_mensagens.created_at → crm_chat_mensagens.created_at
```

### RF-03: Configuração do Agente no CRM

**Descrição:** Permitir configuração do agente virtual diretamente na interface do CRM.

**Localização:** A configuração será integrada à página `CRMSettings.tsx` existente, como uma **terceira seção** (junto às configurações atuais de "Etapas do Funil" e "Origens de Leads"), mantendo a coerência visual da interface.

**Funcionalidades:**
- [ ] Configurar nome do agente
- [ ] Definir avatar/imagem do agente
- [ ] Configurar mensagem de boas-vindas
- [ ] Configurar mensagem de ausência
- [ ] Definir horário de funcionamento
- [ ] Configurar tempo de resposta esperado
- [ ] Ativar/desativar agente por canal

**Campos da Tabela:**
```typescript
interface CRMChatConfig {
  id: string;
  empresa_id: string;
  agente_nome: string;
  agente_avatar_url: string | null;
  mensagem_boas_vindas: string;
  mensagem_ausencia: string;
  horario_funcionamento: {
    dias: ('seg'|'ter'|'qua'|'qui'|'sex'|'sab'|'dom')[];
    inicio: string; // HH:mm
    fim: string;    // HH:mm
  };
  tempo_resposta_minutos: number;
  agente_ativo: boolean;
  created_at: string;
  updated_at: string;
}
```

### RF-04: Cores e Filtros por Canal

**Descrição:** Implementar identificação visual e filtros por canal de comunicação.

**Canais Suportados:**
- `whatsapp` - Verde (#25D366)
- `email` - Azul (#4285F4)
- `chat` - Roxo (#7C3AED)
- `instagram` - Gradiente (pink/orange)

**Funcionalidades:**
- [ ] Ícone colorido por canal na lista de conversas
- [ ] Filtro por canal no header
- [ ] Badge com nome do canal
- [ ] Filtro múltiplo (checkbox)

**Interface:**
```typescript
interface CanalConfig {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  ativo: boolean;
}

interface FiltroCanais {
  canais: string[]; // ['whatsapp', 'email']
  busca: string;
  status: 'todos' | 'pendente' | 'em_andamento' | 'resolvido';
}
```

### RF-05: Integração WhatsApp (Evolution + n8n)

**Descrição:** Implementar integração completa com WhatsApp via Evolution API, orquestrada pelo n8n.

**Arquitetura - Opção B (Escolhida):**
```
WhatsApp User
      │
      ▼
Evolution API
      │
      ▼
   [n8n] ───────────┐
      │              │
      ▼              ▼
Supabase      Supabase
(webhook)    (REST API)
```

**Fluxo Recebimento:**
1. Mensagem recebida no WhatsApp
2. Evolution API recebe e envia para n8n
3. n8n processa e grava em `crm_chat_mensagens`
4. Supabase Realtime notifica frontend

**Fluxo Envio:**
1. Usuário envia mensagem no UNIQ
2. Sistema grava em `crm_chat_mensagens`
3. Trigger chama n8n via HTTP
4. n8n envia para Evolution API
5. Evolution entrega ao WhatsApp

**Configuração n8n:**
- Webhook trigger: Evolution events
- HTTP Request: Supabase REST API
- Function node: Transformação de dados
- IF node: Validações

### RF-06: Cadastro Empresas Beta

**Descrição:** Processo simplificado para cadastro de empresas no programa beta.

**Critérios:**
- [ ] Formulário com campos essenciais
- [ ] Validação de CNPJ
- [ ] Confirmação de e-mail
- [ ] Onboarding automatizado
- [ ] Flag `is_beta = true`

**Campos do Formulário:**
```typescript
interface BetaSignup {
  empresa_nome: string;
  cnpj: string;
  responsavel_nome: string;
  email: string;
  telefone: string;
  tamanho_equipe: '1-5' | '6-10' | '11-20' | '20+';
  segmento: string;
  aceita_termos: boolean;
}
```

---

## 3. Modelagem de Dados

### 3.1 Nova Tabela: crm_chat_config

```sql
-- Migration: 20260301000000_create_crm_chat_config.sql

CREATE TABLE IF NOT EXISTS public.crm_chat_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  
  -- Configurações do Agente
  agente_nome varchar(100) NOT NULL DEFAULT 'Assistente Virtual',
  agente_avatar_url text,
  mensagem_boas_vindas text NOT NULL DEFAULT 'Olá! Como posso ajudar?',
  mensagem_ausencia text NOT NULL DEFAULT 'Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Retornaremos em breve!',
  
  -- Horário de Funcionamento (JSONB)
  horario_funcionamento jsonb NOT NULL DEFAULT '{
    "dias": ["seg", "ter", "qua", "qui", "sex"],
    "inicio": "08:00",
    "fim": "18:00"
  }'::jsonb,
  
  -- Configurações de Resposta
  tempo_resposta_minutos integer NOT NULL DEFAULT 5,
  agente_ativo boolean NOT NULL DEFAULT true,
  
  -- URA (Unidade de Resposta Audível)
  ura_ativa boolean NOT NULL DEFAULT false,
  ura_config jsonb DEFAULT '{
    "boas_vindas": "Bem-vindo! Escolha uma opção:",
    "opcoes": [
      {"id": "1", "label": "Suporte Técnico", "acao": "transferir", "destino": "suporte"},
      {"id": "2", "label": "Comercial", "acao": "transferir", "destino": "comercial"},
      {"id": "3", "label": "Falar com Atendente", "acao": "transferir", "destino": "humano"}
    ],
    "tempo_espera": 30
  }'::jsonb,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_horario CHECK (
    (horario_funcionamento->>'inicio') ~ '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' AND
    (horario_funcionamento->>'fim') ~ '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
  )
);

-- RLS
ALTER TABLE public.crm_chat_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa pode ver config" ON public.crm_chat_config
  FOR SELECT USING (empresa_id IN (
    SELECT empresa_id FROM public.usuario_empresas WHERE usuario_id = auth.uid()
  ));

CREATE POLICY "Admin pode modificar config" ON public.crm_chat_config
  FOR ALL USING (empresa_id IN (
    SELECT empresa_id FROM public.usuario_empresas 
    WHERE usuario_id = auth.uid() AND papel = 'admin'
  ));

-- Trigger updated_at
CREATE TRIGGER update_crm_chat_config_updated_at
  BEFORE UPDATE ON public.crm_chat_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index
CREATE INDEX idx_crm_chat_config_empresa ON public.crm_chat_config(empresa_id);
```

### 3.2 Nova Tabela: crm_chat_respostas_rapidas

```sql
-- Migration: 20260301000001_create_crm_chat_respostas_rapidas.sql

CREATE TABLE IF NOT EXISTS public.crm_chat_respostas_rapidas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  
  -- Conteúdo
  titulo varchar(100) NOT NULL,
  conteudo text NOT NULL,
  atalho varchar(50), -- Ex: "/suporte"
  
  -- Categoria
  categoria varchar(50) DEFAULT 'geral',
  cor_tag varchar(7) DEFAULT '#6B7280', -- Hex color
  
  -- Ordenação
  ordem integer NOT NULL DEFAULT 0,
  
  -- Status
  ativo boolean NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE public.crm_chat_respostas_rapidas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa pode ver respostas" ON public.crm_chat_respostas_rapidas
  FOR SELECT USING (empresa_id IN (
    SELECT empresa_id FROM public.usuario_empresas WHERE usuario_id = auth.uid()
  ));

CREATE POLICY "Admin/Atendente pode gerenciar" ON public.crm_chat_respostas_rapidas
  FOR ALL USING (empresa_id IN (
    SELECT empresa_id FROM public.usuario_empresas 
    WHERE usuario_id = auth.uid() AND papel IN ('admin', 'atendente', 'gerente')
  ));

-- Trigger
CREATE TRIGGER update_crm_chat_respostas_rapidas_updated_at
  BEFORE UPDATE ON public.crm_chat_respostas_rapidas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_crm_chat_respostas_empresa ON public.crm_chat_respostas_rapidas(empresa_id);
CREATE INDEX idx_crm_chat_respostas_ativo ON public.crm_chat_respostas_rapidas(ativo);
CREATE INDEX idx_crm_chat_respostas_ordem ON public.crm_chat_respostas_rapidas(ordem);
```

### 3.3 Alteração: crm_chat_conversas (add canal)

```sql
-- Migration: 20260301000002_add_canal_to_crm_chat_conversas.sql

-- Adicionar coluna canal
ALTER TABLE public.crm_chat_conversas 
ADD COLUMN IF NOT EXISTS canal varchar(20) NOT NULL DEFAULT 'whatsapp';

-- Adicionar coluna canal_id (identificador externo)
ALTER TABLE public.crm_chat_conversas 
ADD COLUMN IF NOT EXISTS canal_id varchar(100);

-- Adicionar coluna canal_dados (JSON com dados específicos do canal)
ALTER TABLE public.crm_chat_conversas 
ADD COLUMN IF NOT EXISTS canal_dados jsonb DEFAULT '{}'::jsonb;

-- Constraint para valores válidos
ALTER TABLE public.crm_chat_conversas 
ADD CONSTRAINT valid_canal CHECK (canal IN ('whatsapp', 'email', 'chat', 'instagram', 'facebook', 'telegram'));

-- Index para busca por canal
CREATE INDEX IF NOT EXISTS idx_crm_chat_conversas_canal ON public.crm_chat_conversas(canal);
CREATE INDEX IF NOT EXISTS idx_crm_chat_conversas_canal_id ON public.crm_chat_conversas(canal_id);

-- Atualizar conversas existentes para ter canal explícito
UPDATE public.crm_chat_conversas 
SET canal = 'whatsapp' 
WHERE canal IS NULL OR canal = '';
```

### 3.4 Script de Migração de Dados

```sql
-- Migration: 20260301000003_migrate_atd_to_crm.sql

-- Criar tabela de log de migração
CREATE TABLE IF NOT EXISTS public._migracao_atd_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tabela_origem varchar(50) NOT NULL,
  tabela_destino varchar(50) NOT NULL,
  registros_processados integer DEFAULT 0,
  registros_erro integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  erro_detalhes jsonb DEFAULT '[]'::jsonb
);

-- Função de migração
CREATE OR REPLACE FUNCTION public.migrar_atd_para_crm(p_empresa_id uuid DEFAULT NULL)
RETURNS TABLE (
  tabela varchar,
  registros_migrados bigint,
  status varchar
) AS $$
DECLARE
  v_log_id uuid;
  v_count bigint;
BEGIN
  -- Iniciar log
  INSERT INTO public._migracao_atd_log (tabela_origem, tabela_destino)
  VALUES ('atd_conversas', 'crm_chat_conversas')
  RETURNING id INTO v_log_id;
  
  -- 1. Migrar conversas
  WITH migracao_conversas AS (
    INSERT INTO public.crm_chat_conversas (
      id, empresa_id, contato_id, status, 
      canal, canal_id, created_at, updated_at
    )
    SELECT 
      ac.id,
      ac.empresa_id,
      ac.cliente_id as contato_id,
      CASE 
        WHEN ac.status = 'aberta' THEN 'em_andamento'
        WHEN ac.status = 'fechada' THEN 'resolvido'
        ELSE ac.status
      END::crm_chat_status,
      'whatsapp' as canal,
      ac.whatsapp_numero as canal_id,
      ac.created_at,
      COALESCE(ac.ultima_mensagem_em, ac.updated_at)
    FROM public.atd_conversas ac
    WHERE (p_empresa_id IS NULL OR ac.empresa_id = p_empresa_id)
      AND NOT EXISTS (
        SELECT 1 FROM public.crm_chat_conversas cc 
        WHERE cc.id = ac.id
      )
    RETURNING id
  )
  SELECT count(*) INTO v_count FROM migracao_conversas;
  
  RETURN QUERY SELECT 'crm_chat_conversas'::varchar, v_count, 'SUCCESS'::varchar;
  
  -- 2. Migrar mensagens
  WITH migracao_mensagens AS (
    INSERT INTO public.crm_chat_mensagens (
      id, conversa_id, remetente, tipo, 
      conteudo, arquivo_url, created_at
    )
    SELECT 
      am.id,
      am.conversa_id,
      CASE 
        WHEN am.remetente = 'cliente' THEN 'contato'
        WHEN am.remetente = 'atendente' THEN 'usuario'
        ELSE am.remetente
      END::crm_chat_remetente,
      COALESCE(am.tipo, 'texto')::crm_chat_tipo_mensagem,
      am.conteudo,
      am.arquivo_url,
      am.created_at
    FROM public.atd_mensagens am
    INNER JOIN public.atd_conversas ac ON am.conversa_id = ac.id
    WHERE (p_empresa_id IS NULL OR ac.empresa_id = p_empresa_id)
      AND NOT EXISTS (
        SELECT 1 FROM public.crm_chat_mensagens cm 
        WHERE cm.id = am.id
      )
    RETURNING id
  )
  SELECT count(*) INTO v_count FROM migracao_mensagens;
  
  RETURN QUERY SELECT 'crm_chat_mensagens'::varchar, v_count, 'SUCCESS'::varchar;
  
  -- Atualizar log
  UPDATE public._migracao_atd_log 
  SET completed_at = now(),
      registros_processados = (SELECT count(*) FROM public.crm_chat_conversas WHERE canal = 'whatsapp')
  WHERE id = v_log_id;
  
EXCEPTION WHEN OTHERS THEN
  UPDATE public._migracao_atd_log 
  SET completed_at = now(),
      erro_detalhes = jsonb_build_array(jsonb_build_object('error', SQLERRM))
  WHERE id = v_log_id;
  
  RETURN QUERY SELECT 'ERROR'::varchar, 0::bigint, SQLERRM::varchar;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar migração
-- SELECT * FROM public.migrar_atd_para_crm();
```

---

## 4. APIs e Edge Functions

### 4.1 webhook-whatsapp (atualizada)

**Arquivo:** `supabase/functions/webhook-whatsapp/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface EvolutionWebhookPayload {
  event: 'message' | 'message.update' | 'connection.update'
  data: {
    key: {
      remoteJid: string
      fromMe: boolean
      id: string
    }
    message?: {
      conversation?: string
      imageMessage?: { url: string }
      documentMessage?: { url: string }
    }
    pushName?: string
    messageTimestamp: number
  }
  instance: string
}

serve(async (req) => {
  try {
    const payload: EvolutionWebhookPayload = await req.json()
    
    // Validar payload
    if (payload.event !== 'message' || !payload.data.message) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    const { data, instance } = payload
    const telefone = data.key.remoteJid.split('@')[0]
    const fromMe = data.key.fromMe
    
    // Buscar empresa pela instância
    const { data: config } = await supabase
      .from('crm_chat_config')
      .select('empresa_id')
      .eq('whatsapp_instancia', instance)
      .single()
    
    if (!config) {
      throw new Error('Instância não encontrada: ' + instance)
    }
    
    // Buscar ou criar contato
    let { data: contato } = await supabase
      .from('crm_contatos')
      .select('id')
      .eq('empresa_id', config.empresa_id)
      .eq('telefone', telefone)
      .single()
    
    if (!contato) {
      const { data: newContato } = await supabase
        .from('crm_contatos')
        .insert({
          empresa_id: config.empresa_id,
          nome: data.pushName || telefone,
          telefone: telefone,
          origem: 'whatsapp'
        })
        .select('id')
        .single()
      contato = newContato
    }
    
    // Buscar ou criar conversa
    let { data: conversa } = await supabase
      .from('crm_chat_conversas')
      .select('id')
      .eq('empresa_id', config.empresa_id)
      .eq('contato_id', contato.id)
      .eq('canal', 'whatsapp')
      .eq('status', 'em_andamento')
      .single()
    
    if (!conversa) {
      const { data: newConversa } = await supabase
        .from('crm_chat_conversas')
        .insert({
          empresa_id: config.empresa_id,
          contato_id: contato.id,
          canal: 'whatsapp',
          canal_id: telefone,
          status: 'em_andamento'
        })
        .select('id')
        .single()
      conversa = newConversa
    }
    
    // Extrair conteúdo
    let conteudo = ''
    let tipo: 'texto' | 'imagem' | 'documento' = 'texto'
    let arquivoUrl: string | null = null
    
    if (data.message.conversation) {
      conteudo = data.message.conversation
    } else if (data.message.imageMessage) {
      tipo = 'imagem'
      arquivoUrl = data.message.imageMessage.url
      conteudo = '📷 Imagem'
    } else if (data.message.documentMessage) {
      tipo = 'documento'
      arquivoUrl = data.message.documentMessage.url
      conteudo = '📎 Documento'
    }
    
    // Gravar mensagem
    await supabase.from('crm_chat_mensagens').insert({
      conversa_id: conversa.id,
      remetente: fromMe ? 'usuario' : 'contato',
      tipo: tipo,
      conteudo: conteudo,
      arquivo_url: arquivoUrl,
      canal_mensagem_id: data.key.id
    })
    
    // Atualizar conversa
    await supabase
      .from('crm_chat_conversas')
      .update({ 
        updated_at: new Date().toISOString(),
        ultima_mensagem: conteudo.substring(0, 100)
      })
      .eq('id', conversa.id)
    
    return new Response(
      JSON.stringify({ ok: true, message: 'Mensagem processada' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Erro webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### 4.2 send-whatsapp-message (atualizada)

**Arquivo:** `supabase/functions/send-whatsapp-message/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface SendMessageRequest {
  conversa_id: string
  conteudo: string
  tipo?: 'texto' | 'imagem' | 'documento'
  arquivo_url?: string
}

serve(async (req) => {
  try {
    // Validar método
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }
    
    const body: SendMessageRequest = await req.json()
    const { conversa_id, conteudo, tipo = 'texto', arquivo_url } = body
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    // Buscar conversa e config
    const { data: conversa, error: errConversa } = await supabase
      .from('crm_chat_conversas')
      .select(`
        id,
        canal,
        canal_id,
        empresa_id,
        crm_chat_config(whatsapp_instancia, n8n_webhook_url)
      `)
      .eq('id', conversa_id)
      .single()
    
    if (errConversa || !conversa) {
      throw new Error('Conversa não encontrada')
    }
    
    if (conversa.canal !== 'whatsapp') {
      throw new Error('Canal não suportado para envio via WhatsApp')
    }
    
    // Gravar mensagem no banco
    const { data: mensagem, error: errMensagem } = await supabase
      .from('crm_chat_mensagens')
      .insert({
        conversa_id: conversa.id,
        remetente: 'usuario',
        tipo: tipo,
        conteudo: conteudo,
        arquivo_url: arquivo_url,
        status: 'enviando'
      })
      .select()
      .single()
    
    if (errMensagem) throw errMensagem
    
    // Chamar n8n para envio
    const n8nWebhook = conversa.crm_chat_config?.n8n_webhook_url
    if (!n8nWebhook) {
      throw new Error('Webhook n8n não configurado')
    }
    
    const n8nResponse = await fetch(n8nWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instance: conversa.crm_chat_config.whatsapp_instancia,
        number: conversa.canal_id,
        message: conteudo,
        type: tipo,
        mediaUrl: arquivo_url,
        messageId: mensagem.id
      })
    })
    
    if (!n8nResponse.ok) {
      throw new Error(`n8n error: ${await n8nResponse.text()}`)
    }
    
    // Atualizar status para enviada
    await supabase
      .from('crm_chat_mensagens')
      .update({ status: 'enviada' })
      .eq('id', mensagem.id)
    
    return new Response(
      JSON.stringify({ success: true, messageId: mensagem.id }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### 4.3 Estrutura de Requests/Responses

**Webhook Recebimento (Evolution → n8n → Supabase):**
```typescript
// Evolution envia para n8n
interface EvolutionEvent {
  event: 'message'
  instance: string
  data: {
    key: { remoteJid: string; fromMe: boolean; id: string }
    message: any
    pushName: string
    messageTimestamp: number
  }
}

// n8n transforma e envia para Supabase
interface WebhookSupabasePayload {
  telefone: string
  mensagem: string
  tipo: 'texto' | 'imagem' | 'documento'
  arquivo_url?: string
  instancia: string
  nome_contato?: string
  message_id: string
}
```

**Envio de Mensagem (UNIQ → n8n → Evolution):**
```typescript
// Request
POST /functions/v1/send-whatsapp-message
{
  "conversa_id": "uuid",
  "conteudo": "Olá, tudo bem?",
  "tipo": "texto" // ou "imagem", "documento"
}

// Response Success
{
  "success": true,
  "messageId": "uuid"
}

// Response Error
{
  "error": "Mensagem de erro"
}
```

---

## 5. Interfaces TypeScript

### 5.1 CRMChatConfig

```typescript
// src/types/crm-chat.ts

export type CanalType = 'whatsapp' | 'email' | 'chat' | 'instagram' | 'facebook' | 'telegram'

export interface CRMChatConfig {
  id: string
  empresa_id: string
  agente_nome: string
  agente_avatar_url: string | null
  mensagem_boas_vindas: string
  mensagem_ausencia: string
  horario_funcionamento: {
    dias: Array<'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'>
    inicio: string // HH:mm
    fim: string    // HH:mm
  }
  tempo_resposta_minutos: number
  agente_ativo: boolean
  ura_ativa: boolean
  ura_config: UraConfig
  created_at: string
  updated_at: string
}

export interface UraConfig {
  boas_vindas: string
  opcoes: UraOption[]
  tempo_espera: number // segundos
}

export interface UraOption {
  id: string
  label: string
  acao: 'transferir' | 'mensagem' | 'url'
  destino: string // Setor, mensagem ou URL
}
```

### 5.2 QuickReply

```typescript
export interface QuickReply {
  id: string
  empresa_id: string
  titulo: string
  conteudo: string
  atalho?: string // Ex: "/suporte"
  categoria: string
  cor_tag: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
  created_by?: string
}

export interface QuickReplyCategory {
  id: string
  nome: string
  cor: string
  count: number
}
```

### 5.3 Atualizações em Tipos Existentes

```typescript
// Atualização em CRMChatConversa
export interface CRMChatConversa {
  id: string
  empresa_id: string
  contato_id: string
  usuario_id?: string
  status: 'pendente' | 'em_andamento' | 'resolvido' | 'arquivado'
  canal: CanalType           // NOVO
  canal_id?: string          // NOVO - ID externo (telefone, email, etc)
  canal_dados?: {            // NOVO - Dados específicos do canal
    pushName?: string        // Nome no WhatsApp
    profilePicture?: string  // Foto do perfil
    [key: string]: any
  }
  ultima_mensagem?: string
  unread_count: number
  created_at: string
  updated_at: string
  
  // Relacionamentos
  contato?: CRMContato
  usuario?: User
  tags?: CRMTag[]
}

// Atualização em CRMChatMensagem
export interface CRMChatMensagem {
  id: string
  conversa_id: string
  remetente: 'contato' | 'usuario' | 'sistema' | 'agente'
  usuario_id?: string
  tipo: 'texto' | 'imagem' | 'video' | 'audio' | 'documento' | 'localizacao'
  conteudo: string
  arquivo_url?: string
  status: 'recebida' | 'enviando' | 'enviada' | 'entregue' | 'lida' | 'falha'
  canal_mensagem_id?: string // ID da mensagem no canal externo
  metadata?: {               // Dados adicionais
    caption?: string
    mimeType?: string
    fileName?: string
    fileSize?: number
  }
  created_at: string
  updated_at: string
}

// CanalConfig para UI
export interface CanalConfig {
  id: CanalType
  nome: string
  icone: string
  cor: string
  gradient?: string
  ativo: boolean
}

export const CANAIS_CONFIG: Record<CanalType, CanalConfig> = {
  whatsapp: {
    id: 'whatsapp',
    nome: 'WhatsApp',
    icone: 'MessageCircle',
    cor: '#25D366',
    ativo: true
  },
  email: {
    id: 'email',
    nome: 'E-mail',
    icone: 'Mail',
    cor: '#4285F4',
    ativo: true
  },
  chat: {
    id: 'chat',
    nome: 'Chat',
    icone: 'MessageSquare',
    cor: '#7C3AED',
    ativo: true
  },
  instagram: {
    id: 'instagram',
    nome: 'Instagram',
    icone: 'Instagram',
    cor: '#E4405F',
    gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    ativo: true
  },
  facebook: {
    id: 'facebook',
    nome: 'Facebook',
    icone: 'Facebook',
    cor: '#1877F2',
    ativo: false
  },
  telegram: {
    id: 'telegram',
    nome: 'Telegram',
    icone: 'Send',
    cor: '#0088cc',
    ativo: false
  }
}
```

---

## 6. Fluxos de Dados

### 6.1 Recebimento de Mensagem

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Usuário   │────▶│  WhatsApp    │────▶│  Evolution  │
│  (Cliente)  │     │              │     │     API     │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                                                │ Webhook
                                                ▼
                                         ┌─────────────┐
                                         │     n8n     │
                                         │  (Workflow) │
                                         └──────┬──────┘
                                                │
                                                │ POST /rest/v1/crm_chat_mensagens
                                                ▼
                                         ┌─────────────┐
                                         │  Supabase   │
                                         │  (Insert)   │
                                         └──────┬──────┘
                                                │
                                                │ Realtime
                                                ▼
                                         ┌─────────────┐
                                         │   UNIQ      │
                                         │  (React)    │
                                         │  Atualiza   │
                                         │    UI       │
                                         └─────────────┘
```

**Passos:**
1. Usuário envia mensagem no WhatsApp
2. Evolution API recebe e dispara webhook para n8n
3. n8n processa payload e chama Supabase REST API
4. Mensagem é inserida em `crm_chat_mensagens`
5. Trigger do Supabase atualiza `crm_chat_conversas`
6. Realtime notifica todos os clients conectados
7. UI do UNIQ atualiza automaticamente

### 6.2 Envio de Mensagem

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Usuário   │────▶│    UNIQ      │────▶│  Supabase   │
│  (Atendente)│     │   (React)    │     │  (Insert)   │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                                                │ Trigger
                                                ▼
                                         ┌─────────────┐
                                         │  Edge Func  │
                                         │ send-whatsapp│
                                         └──────┬──────┘
                                                │
                                                │ POST webhook
                                                ▼
                                         ┌─────────────┐
                                         │     n8n     │
                                         │  (Workflow) │
                                         └──────┬──────┘
                                                │
                                                │ Evolution API
                                                ▼
                                         ┌─────────────┐
                                         │  Evolution  │
                                         │     API     │
                                         └──────┬──────┘
                                                │
                                                │ WhatsApp
                                                ▼
                                         ┌─────────────┐
                                         │   Cliente   │
                                         └─────────────┘
```

**Passos:**
1. Atendente digita mensagem no UNIQ
2. Sistema insere mensagem em `crm_chat_mensagens` (status: 'enviando')
3. Database trigger chama Edge Function
4. Edge Function valida e chama webhook do n8n
5. n8n processa e envia para Evolution API
6. Evolution entrega mensagem ao WhatsApp
7. (Async) Evolution confirma entrega via webhook
8. Status da mensagem é atualizado para 'entregue'

### 6.3 Migração de Dados

```
┌──────────────────────────────────────────────────────────┐
│  FASE 1: Preparação                                      │
│  - Criar tabelas novas                                   │
│  - Criar função de migração                              │
│  - Backup dos dados antigos                              │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  FASE 2: Migração Conversas                              │
│  - Ler atd_conversas                                     │
│  - Transformar dados (status, canal)                     │
│  - Inserir em crm_chat_conversas                         │
│  - Log de erros                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  FASE 3: Migração Mensagens                              │
│  - Ler atd_mensagens                                     │
│  - Transformar remetente                                 │
│  - Inserir em crm_chat_mensagens                         │
│  - Manter referência à conversa                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  FASE 4: Validação                                       │
│  - Contar registros origem vs destino                    │
│  - Validar integridade referencial                       │
│  - Testar funcionalidades                                │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  FASE 5: Clean Up (pós-validação)                        │
│  - Remover rotas antigas                                 │
│  - Remover componentes antigos                           │
│  - Arquivar (não deletar) tabelas antigas                │
└──────────────────────────────────────────────────────────┘
```

### 6.4 Configuração do Agente

```
┌─────────────┐
│   Admin     │
│  Acessa     │
│  Config     │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│ CRMAttendant│────▶│   Supabase   │
│   Config    │GET  │   (Select)   │
└──────┬──────┘     └──────────────┘
       │
       │ Carrega config atual
       ▼
┌─────────────┐
│   Formulário│
│   Preenchido│
└──────┬──────┘
       │
       │ Salvar
       ▼
┌─────────────┐     ┌──────────────┐
│    PUT      │────▶│   Supabase   │
│   /config   │     │   (Update)   │
└──────┬──────┘     └──────────────┘
       │
       │ Trigger
       ▼
┌─────────────┐
│  webhook    │
│  n8n        │ (Atualiza config no n8n)
└─────────────┘
```

---

## 7. Estrutura de Arquivos

### 7.1 Árvore Completa

```
src/
├── components/
│   └── crm/
│       ├── chat/
│       │   ├── CRMChatWindow.tsx          # Modificado
│       │   ├── CRMChatInput.tsx           # Modificado
│       │   ├── CRMChatMessage.tsx         # Modificado
│       │   ├── CRMChatQuickReplies.tsx    # NOVO
│       │   ├── CRMChatCanalBadge.tsx      # NOVO
│       │   └── CRMChatFilter.tsx          # Modificado (add canal)
│       ├── conversations/
│       │   ├── CRMConversationsList.tsx   # Modificado
│       │   ├── CRMConversationItem.tsx    # Modificado
│       │   └── CRMConversationsHeader.tsx # Modificado
│       └── config/
│           └── CRMSettings.tsx            # ATUALIZAR (add seção Config Chat)
│           ├── CRMAgentSettings.tsx       # NOVO
│           ├── CRMQuickRepliesManager.tsx # NOVO
│           └── CRMUraBuilder.tsx          # NOVO
│
├── pages/
│   └── crm/
│       ├── CRMPage.tsx                    # Modificado
│       ├── CRMConversations.tsx           # Modificado (unificado)
│       ├── CRMContacts.tsx                # Existente
│       └── CRMSettings.tsx                # ATUALIZAR
│
├── hooks/
│   └── crm/
│       ├── useCRMChatConfig.ts            # NOVO
│       ├── useQuickReplies.ts             # NOVO
│       ├── useCanais.ts                   # NOVO
│       └── useCRMConversations.ts         # Modificado
│
├── types/
│   └── crm-chat.ts                        # NOVO/Modificado
│
├── store/
│   └── crmChatStore.ts                    # Modificado (add canal filter)
│
├── lib/
│   └── canais.ts                          # NOVO (config dos canais)
│
└── [REMOVIDO]/
    ├── components/
    │   └── atendente/                     # REMOVER toda pasta
    ├── pages/
    │   └── AtendentePage.tsx              # REMOVER
    └── hooks/
        └── useAtendente.ts                # REMOVER

supabase/
├── functions/
│   ├── webhook-whatsapp/
│   │   └── index.ts                       # Modificado
│   └── send-whatsapp-message/
│       └── index.ts                       # Modificado
│
└── migrations/
    ├── 20260301000000_create_crm_chat_config.sql
    ├── 20260301000001_create_crm_chat_respostas_rapidas.sql
    ├── 20260301000002_add_canal_to_crm_chat_conversas.sql
    └── 20260301000003_migrate_atd_to_crm.sql
```

### 7.2 Arquivos a Criar

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `src/types/crm-chat.ts` | Novo | Tipos centralizados do CRM Chat |
| `src/lib/canais.ts` | Novo | Configuração e helpers dos canais |
| `src/components/crm/chat/CRMChatQuickReplies.tsx` | Novo | Componente de respostas rápidas |
| `src/components/crm/chat/CRMChatCanalBadge.tsx` | Novo | Badge de identificação do canal |
| `src/pages/CRM/CRMSettings.tsx` | Atualizar | Adicionar seção "Configurações do Chat" junto às configurações existentes (Etapas do Funil e Origens) |
| `src/components/crm/config/CRMAgentSettings.tsx` | Novo | Formulário de config do agente |
| `src/components/crm/config/CRMQuickRepliesManager.tsx` | Novo | Gerenciador de respostas rápidas |
| `src/components/crm/config/CRMUraBuilder.tsx` | Novo | Construtor de URA |
| `src/hooks/crm/useCRMChatConfig.ts` | Novo | Hook para gerenciar configurações |
| `src/hooks/crm/useQuickReplies.ts` | Novo | Hook para respostas rápidas |
| `src/hooks/crm/useCanais.ts` | Novo | Hook para gerenciar canais |

### 7.3 Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/crm/chat/CRMChatWindow.tsx` | Add suporte a canais |
| `src/components/crm/chat/CRMChatFilter.tsx` | Add filtro por canal |
| `src/components/crm/conversations/CRMConversationItem.tsx` | Add badge de canal |
| `src/pages/crm/CRMConversations.tsx` | Unificar funcionalidades |
| `src/App.tsx` | Remover rotas do Atendente |
| `src/components/layout/Navigation.tsx` | Remover menu Atendente |
| `supabase/functions/webhook-whatsapp/index.ts` | Suporte a novo schema |

### 7.4 Arquivos a Remover

| Arquivo | Motivo |
|---------|--------|
| `src/pages/AtendentePage.tsx` | Funcionalidade unificada no CRM |
| `src/components/atendente/*` | Todos os componentes migrados |
| `src/hooks/useAtendente.ts` | Não mais necessário |
| Rotas `/atendente/*` | Redirecionar para `/crm/conversas` |

---

## 8. Menu e Navegação

### 8.1 Estrutura Atual (ANTES)

```
Menu Principal:
├── Dashboard
├── CRM
│   ├── Conversas
│   ├── Contatos
│   └── Pipeline
├── Atendente        <-- REMOVER
│   ├── Chat
│   ├── Histórico
│   └── Configurações
├── Financeiro
└── Configurações
```

### 8.2 Estrutura Nova (DEPOIS)

```
Menu Principal:
├── Dashboard
├── CRM
│   ├── Conversas      <-- Unificado (chat + canais)
│   ├── Contatos
│   ├── Pipeline
│   └── Configurações  <-- NOVO submenu
│       ├── Agente Virtual
│       ├── Respostas Rápidas
│       ├── URA
│       └── Canais
├── Financeiro
└── Configurações Gerais
```

### 8.3 Redirecionamentos

```typescript
// src/routes/index.tsx
const redirects = [
  { from: '/atendente', to: '/crm/conversas' },
  { from: '/atendente/*', to: '/crm/conversas' },
  { from: '/atendente/configuracoes', to: '/crm/configuracoes/agente' },
]

// Implementação
<Route path="/atendente" element={<Navigate to="/crm/conversas" replace />} />
<Route path="/atendente/*" element={<Navigate to="/crm/conversas" replace />} />
```

### 8.4 Novo Submenu CRM Configurações

```typescript
interface CRMConfigMenuItem {
  id: string
  label: string
  icon: string
  path: string
  permission: string
}

const crmConfigMenu: CRMConfigMenuItem[] = [
  {
    id: 'agente',
    label: 'Agente Virtual',
    icon: 'Bot',
    path: '/crm/configuracoes/agente',
    permission: 'crm.config.agente'
  },
  {
    id: 'quick-replies',
    label: 'Respostas Rápidas',
    icon: 'Zap',
    path: '/crm/configuracoes/respostas-rapidas',
    permission: 'crm.config.respostas'
  },
  {
    id: 'ura',
    label: 'URA (Menu)',
    icon: 'Menu',
    path: '/crm/configuracoes/ura',
    permission: 'crm.config.ura'
  },
  {
    id: 'canais',
    label: 'Canais de Comunicação',
    icon: 'MessageSquare',
    path: '/crm/configuracoes/canais',
    permission: 'crm.config.canais'
  }
]
```

---

## 9. Plano de Implementação

### 9.1 Dia 1: Migrations e Estrutura Base

**Manhã (4h)**
- [ ] Criar migration `crm_chat_config`
- [ ] Criar migration `crm_chat_respostas_rapidas`
- [ ] Criar migration `add_canal_to_crm_chat_conversas`
- [ ] Executar migrations no ambiente de dev
- [ ] Validar estrutura no Supabase

**Tarde (4h)**
- [ ] Criar types TypeScript (`src/types/crm-chat.ts`)
- [ ] Criar config dos canais (`src/lib/canais.ts`)
- [ ] Criar hooks base (`useCRMChatConfig`, `useQuickReplies`)
- [ ] Setup inicial dos componentes de config

**Entregáveis do Dia 1:**
- ✅ Banco de dados atualizado
- ✅ Types e hooks criados
- ✅ Estrutura base dos componentes

### 9.2 Dia 2: Frontend (CRMSettings + Chat Config e Atualizações)

**Manhã (4h)**
- [ ] Desenvolver `CRMAgentSettings.tsx`
  - Formulário de config do agente
  - Upload de avatar
  - Horário de funcionamento
- [ ] Desenvolver `CRMQuickRepliesManager.tsx`
  - CRUD de respostas rápidas
  - Ordenação drag & drop
  - Categorias

**Tarde (4h)**
- [ ] Desenvolver `CRMUraBuilder.tsx`
  - Builder visual da URA
  - Configuração de opções
  - Preview
- [ ] Atualizar `CRMChatFilter.tsx`
  - Add filtro por canal
  - Multi-select de canais
- [ ] Atualizar `CRMConversationItem.tsx`
  - Add badge de canal

**Entregáveis do Dia 2:**
- ✅ Tela de configuração do atendente completa
- ✅ Gerenciador de respostas rápidas
- ✅ Builder de URA
- ✅ Filtros por canal implementados

### 9.3 Dia 3: Edge Functions e Integrações

**Manhã (4h)**
- [ ] Atualizar `webhook-whatsapp`
  - Adaptar para novo schema
  - Add suporte a diferentes tipos de mídia
  - Tratamento de erros
- [ ] Atualizar `send-whatsapp-message`
  - Integração com n8n
  - Retry logic
  - Status tracking

**Tarde (4h)**
- [ ] Configurar workflows n8n
  - Webhook receptor (Evolution → Supabase)
  - Webhook emissor (Supabase → Evolution)
  - Testar integração end-to-end
- [ ] Documentar configuração n8n
- [ ] Testar fluxo completo

**Entregáveis do Dia 3:**
- ✅ Edge functions atualizadas
- ✅ Workflows n8n configurados
- ✅ Integração WhatsApp funcionando

### 9.4 Dia 4: Testes e Cadastro Empresas Beta

**Manhã (4h)**
- [ ] Criar migration de dados (`migrate_atd_to_crm`)
- [ ] Testar migração em ambiente de staging
- [ ] Validar integridade dos dados
- [ ] Criar tela de cadastro Beta

**Tarde (4h)**
- [ ] Testes manuais completos
  - Fluxo de recebimento
  - Fluxo de envio
  - Filtros e busca
  - Configurações
- [ ] Testes de migração
- [ ] Remover código antigo (clean up)
- [ ] Preparar deploy

**Entregáveis do Dia 4:**
- ✅ Migração de dados testada
- ✅ Cadastro Beta implementado
- ✅ Testes completos
- ✅ Código antigo removido

---

## 10. Testes

### 10.1 Checklist de Testes Manuais

#### Testes de Integração WhatsApp
- [ ] **Recebimento de mensagem de texto**
  - Enviar mensagem do WhatsApp
  - Verificar se aparece no UNIQ em < 3s
  - Verificar notificação visual
  
- [ ] **Recebimento de mídia**
  - Enviar imagem
  - Enviar documento
  - Enviar áudio
  - Verificar preview/download

- [ ] **Envio de mensagem**
  - Digitar mensagem no UNIQ
  - Verificar entrega no WhatsApp
  - Verificar status (enviando → entregue)

- [ ] **Status de mensagem**
  - Verificar ícone de "enviando"
  - Verificar ícone de "entregue"
  - Verificar ícone de "lida" (se disponível)

#### Testes de Filtros e Canais
- [ ] **Filtro por canal**
  - Selecionar apenas WhatsApp
  - Selecionar múltiplos canais
  - Limpar filtros
  - Verificar contagem correta

- [ ] **Badge de canal**
  - Verificar cor correta por canal
  - Verificar ícone correto
  - Verificar tooltip

#### Testes de Configuração
- [ ] **Configuração do Agente**
  - Alterar nome do agente
  - Upload de avatar
  - Configurar horário
  - Salvar e verificar persistência

- [ ] **Respostas Rápidas**
  - Criar nova resposta
  - Editar resposta existente
  - Usar atalho (ex: "/suporte")
  - Deletar resposta
  - Reordenar (drag & drop)

- [ ] **URA**
  - Adicionar opção
  - Configurar destino
  - Testar preview
  - Ativar/desativar

#### Testes de Migração
- [ ] **Dados migrados corretamente**
  - Verificar conversas
  - Verificar mensagens
  - Verificar tags
  - Verificar contatos

- [ ] **Funcionalidade preservada**
  - Acessar conversas antigas
  - Ver histórico completo
  - Responder conversas migradas

### 10.2 Testes Automatizados

```typescript
// tests/crm-chat.spec.ts

describe('CRM Chat - Canais', () => {
  test('deve filtrar conversas por canal', async () => {
    const { data } = await filterConversationsByCanal(['whatsapp'])
    expect(data?.every(c => c.canal === 'whatsapp')).toBe(true)
  })
  
  test('deve mostrar badge correto do canal', () => {
    const canal = getCanalConfig('whatsapp')
    expect(canal.cor).toBe('#25D366')
    expect(canal.icone).toBe('MessageCircle')
  })
})

describe('CRM Chat - Config', () => {
  test('deve salvar configuração do agente', async () => {
    const config = {
      agente_nome: 'Test Bot',
      mensagem_boas_vindas: 'Olá!'
    }
    const result = await saveCRMChatConfig(config)
    expect(result.agente_nome).toBe('Test Bot')
  })
  
  test('deve criar resposta rápida', async () => {
    const quickReply = {
      titulo: 'Suporte',
      conteudo: 'Como posso ajudar?',
      atalho: '/help'
    }
    const result = await createQuickReply(quickReply)
    expect(result.atalho).toBe('/help')
  })
})

describe('Integração WhatsApp', () => {
  test('deve processar webhook de mensagem', async () => {
    const payload = createMockEvolutionPayload()
    const response = await processWebhook(payload)
    expect(response.ok).toBe(true)
  })
  
  test('deve enviar mensagem via n8n', async () => {
    const message = {
      conversa_id: 'uuid',
      conteudo: 'Teste'
    }
    const result = await sendWhatsAppMessage(message)
    expect(result.success).toBe(true)
  })
})
```

---

## 11. Métricas de Sucesso

### 11.1 KPIs Técnicos

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Tempo de resposta do webhook** | < 500ms | Logs do Edge Function |
| **Taxa de sucesso do envio** | > 99% | Contagem de status 'enviada' vs 'falha' |
| **Uptime da integração** | > 99.5% | Monitoramento n8n + Evolution |
| **Tempo de carregamento do chat** | < 2s | Lighthouse / Analytics |
| **Migração de dados** | 100% sem perda | Query de validação |
| **Cobertura de testes** | > 80% | Relatório de cobertura |

### 11.2 KPIs de Negócio

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Conversas atendidas/dia** | Baseline + 20% | Contagem de conversas resolvidas |
| **Tempo médio de resposta** | < 5 min | Timestamp das mensagens |
| **Taxa de satisfação** | > 4.0/5.0 | Pesquisa pós-atendimento |
| **Empresas Beta ativas** | 10 | Contagem de empresas com flag beta |
| **Adoção de respostas rápidas** | > 50% dos atendentes | Uso das quick replies |
| **Redução de tickets repetitivos** | -30% | Análise de categorias |

### 11.3 Dashboard de Métricas

```typescript
// Dashboard queries
const metricas = {
  // Técnicas
  webhookLatency: `
    SELECT AVG(response_time) 
    FROM edge_function_logs 
    WHERE function = 'webhook-whatsapp'
    AND created_at > NOW() - INTERVAL '24h'
  `,
  
  successRate: `
    SELECT 
      COUNT(*) FILTER (WHERE status = 'enviada') * 100.0 / COUNT(*)
    FROM crm_chat_mensagens
    WHERE created_at > NOW() - INTERVAL '24h'
  `,
  
  // Negócio
  conversasDia: `
    SELECT COUNT(*)
    FROM crm_chat_conversas
    WHERE DATE(updated_at) = CURRENT_DATE
    AND status = 'resolvido'
  `,
  
  tempoResposta: `
    SELECT AVG(
      EXTRACT(EPOCH FROM (m2.created_at - m1.created_at))
    )
    FROM crm_chat_mensagens m1
    JOIN crm_chat_mensagens m2 ON m1.conversa_id = m2.conversa_id
    WHERE m1.remetente = 'contato'
    AND m2.remetente = 'usuario'
    AND m2.created_at > m1.created_at
  `
}
```

---

## 12. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| **Perda de dados na migração** | Baixa | Alto | Backup completo antes da migração; script de validação; rollback automático |
| **Downtime da integração WhatsApp** | Média | Alto | Monitoramento 24/7; fallback para modo manual; notificações em tempo real |
| **n8n indisponível** | Média | Alto | Retry com exponential backoff; fila de mensagens; alertas automáticos |
| **Performance do chat degradada** | Baixa | Médio | Indexação adequada; paginação; virtualização da lista |
| **Usuários resistem à mudança** | Alta | Médio | Comunicação prévia; tutorial interativo; suporte dedicado no primeiro dia |
| **Conflitos de schema com outros módulos** | Baixa | Alto | Testes de integração completos; validação em staging; migração gradual |
| **Limite de rate limit da Evolution** | Média | Médio | Implementar rate limiting; fila de mensagens; upgrade de plano se necessário |
| **Dados migrados incorretamente** | Baixa | Alto | Script de validação automatizado; auditoria manual de amostra; correção em tempo real |

### 12.1 Plano de Contingência

**Caso a migração falhe:**
1. Abortar migração automática
2. Restaurar backup
3. Manter módulo Atendente ativo
4. Analisar logs de erro
5. Corrigir e tentar novamente em horário de baixo uso

**Caso integração WhatsApp pare:**
1. Notificar todos os usuários ativos
2. Ativar modo "somente leitura" no chat
3. Verificar status n8n e Evolution
4. Escalar para equipe de infra
5. Comunicar ETA de retorno

---

## 13. Referências

### 13.1 Documentações

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Evolution API Documentation](https://doc.evolution-api.com/)
- [n8n Documentation](https://docs.n8n.io/)
- [WhatsApp Business API](https://business.whatsapp.com/products/business-platform)

### 13.2 Arquivos Relacionados

| Arquivo | Descrição |
|---------|-----------|
| `prompts/Sprint_10/PRD.md` | Product Requirements Document |
| `tracking/tracking_arq/SPEC_Sprint_09.md` | Template de referência |
| `tracking/TRACKING.md` | Progress tracking do projeto |
| `supabase/migrations/*` | Migrations do banco de dados |
| `src/types/crm.ts` | Tipos existentes do CRM |

### 13.3 Recursos Úteis

```bash
# Comandos úteis para desenvolvimento

# Deploy edge function
supabase functions deploy webhook-whatsapp

# Ver logs
supabase functions logs webhook-whatsapp --tail

# Executar migration
supabase migration up

# Reset database (cuidado!)
supabase db reset

# Gerar types do Supabase
supabase gen types typescript --local > src/types/supabase.ts
```

---

## 14. Checklist de Conclusão

### 14.1 Banco de Dados
- [ ] Migration `crm_chat_config` criada e executada
- [ ] Migration `crm_chat_respostas_rapidas` criada e executada
- [ ] Migration `add_canal_to_crm_chat_conversas` criada e executada
- [ ] Migration de dados `migrate_atd_to_crm` testada
- [ ] RLS policies configuradas
- [ ] Indexes criados
- [ ] Triggers configurados
- [ ] Backup realizado antes da migração

### 14.2 Backend (Edge Functions)
- [ ] `webhook-whatsapp` atualizado e testado
- [ ] `send-whatsapp-message` atualizado e testado
- [ ] Rate limiting implementado
- [ ] Error handling completo
- [ ] Logs estruturados
- [ ] Deploy realizado

### 14.3 Frontend
- [ ] Seção "Configurações do Chat" adicionada ao `CRMSettings.tsx`
- [ ] Componente `CRMAgentSettings` criado
- [ ] Componente `CRMQuickRepliesManager` criado
- [ ] Componente `CRMUraBuilder` criado
- [ ] Componente `CRMChatCanalBadge` criado
- [ ] Filtro por canal implementado
- [ ] Menu atualizado (remoção de Atendente)
- [ ] Redirecionamentos configurados
- [ ] Types TypeScript criados
- [ ] Hooks customizados criados

### 14.4 Integrações
- [ ] Workflow n8n de recebimento configurado
- [ ] Workflow n8n de envio configurado
- [ ] Evolution API conectada
- [ ] Teste end-to-end realizado
- [ ] Documentação dos workflows criada

### 14.5 Migração e Clean Up
- [ ] Script de migração executado em dev
- [ ] Script de migração executado em staging
- [ ] Validação de dados completa
- [ ] Módulo Atendente removido
- [ ] Rotas antigas removidas
- [ ] Código morto removido
- [ ] Testes de regressão passando

### 14.6 Testes
- [ ] Testes manuais executados
- [ ] Testes automatizados passando
- [ ] Testes de integração WhatsApp OK
- [ ] Testes de migração OK
- [ ] Testes de performance OK
- [ ] QA aprovou

### 14.7 Documentação
- [ ] README atualizado
- [ ] Documentação da API atualizada
- [ ] Guia de configuração do n8n criado
- [ ] Guia de troubleshooting criado
- [ ] Changelog atualizado

### 14.8 Deploy e Lançamento
- [ ] Deploy em staging realizado
- [ ] Validação em staging OK
- [ ] Deploy em produção agendado
- [ ] Comunicado aos usuários enviado
- [ ] Suporte dedicado escalado
- [ ] Rollback plan definido
- [ ] Monitoramento ativado

---

## 15. Notas de Implementação

### 15.1 Decisões Técnicas

**Opção B escolhida para integração n8n:**
- URA e lógica de negócio no Supabase
- n8n apenas como "pass-through" para Evolution API
- Vantagens: Maior controle, logs centralizados, fácil debug

**Migração gradual vs big-bang:**
- Escolhido: Big-bang com validação completa
- Motivo: Simplifica código, evita manter duas bases

**Preservação dos dados antigos:**
- Tabelas `atd_*` serão renomeadas para `_deprecated_atd_*`
- Permite rollback se necessário
- Serão removidas após 30 dias de validação

### 15.2 Convenções de Código

```typescript
// Nomenclatura
- Componentes: PascalCase (CRMSettings, ChatConfigSection)
- Hooks: camelCase com prefixo 'use' (useCRMChatConfig)
- Types: PascalCase com sufixo descritivo (CRMChatConfig)
- Constants: SCREAMING_SNAKE_CASE (CANAIS_CONFIG)

// Estrutura de arquivos
- Um componente por arquivo
- Colocar tipos em arquivo separado se reusados
- Hooks customizados em pasta dedicada
- Estilos com Tailwind (não criar arquivos .css)
```

### 15.3 Performance Considerations

```typescript
// Virtualização para listas grandes
import { VirtualList } from '@tanstack/react-virtual'

// Debounce para buscas
const debouncedSearch = useDebounce(searchTerm, 300)

// Paginação
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['conversations'],
  queryFn: fetchConversations,
  getNextPageParam: (lastPage) => lastPage.nextCursor
})

// Otimistic updates
const mutation = useMutation({
  mutationFn: sendMessage,
  onMutate: async (newMessage) => {
    // Atualizar UI imediatamente
    await queryClient.cancelQueries(['messages'])
    const previous = queryClient.getQueryData(['messages'])
    queryClient.setQueryData(['messages'], (old) => [...old, newMessage])
    return { previous }
  },
  onError: (err, newMessage, context) => {
    // Rollback em caso de erro
    queryClient.setQueryData(['messages'], context.previous)
  }
})
```

---

**FIM DA ESPECIFICAÇÃO TÉCNICA**

---

*Documento gerado por NEO - O Arquiteto UNIQ*  
*Metodologia: Vibe Coding (SDD)*  
*Data: 01/03/2026*
