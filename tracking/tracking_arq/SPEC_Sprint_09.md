# SPEC Técnica - Sprint 09: Módulo Atendente UNIQ

**Data:** 24/02/2026  
**Versão:** 1.0  
**Status:** 🟡 EM DESENVOLVIMENTO  
**Autor:** AI Agent (NEO + Vibe Planner)

---

## 1. Visão Geral da Arquitetura

### 1.1 Stack Tecnológico

```
Frontend: React 19 + TypeScript + Tailwind CSS
Backend: Supabase (PostgreSQL + Edge Functions)
Estado: React Hooks + Context API
Estilos: Tailwind CSS (mobile-first)
Ícones: Material Symbols
Automação: n8n + Evolution API (Docker)
```

### 1.2 Componentes Principais

**Backend (Supabase):**
- Tabelas: `atd_config`, `atd_conversas`, `atd_mensagens`
- Edge Functions: `webhook-whatsapp`, `send-whatsapp-message`, `process-ura`
- RLS Policies para isolamento multi-tenant

**Frontend (React):**
- Páginas: Configuração, Lista de Conversas, Chat
- Componentes: ConversationList, ChatWindow, ChatInput, UraConfig
- Services: attendantService, conversationService

**Integração (n8n):**
- Webhook de recebimento (Evolution API → Supabase)
- Webhook de envio (Supabase → Evolution API)
- URA Engine (processamento de regras)

---

## 2. Requisitos Funcionais

### 2.1 RF-01: Configuração do Atendente

**Descrição:** Permitir que o parceiro configure seu atendente virtual.

**Funcionalidades:**
- Cadastrar número WhatsApp (Evolution API)
- Escolher modo: URA ou Agente Especializado
- Personalizar nome e avatar do atendente
- Definir personalidade/tom de voz
- Configurar horário de funcionamento

**Arquivos:**
- `src/pages/Attendant/AttendantConfig.tsx`
- `src/pages/Attendant/components/ModeSelector.tsx`
- `src/pages/Attendant/components/PersonalityConfig.tsx`
- `src/services/attendantService.ts`

### 2.2 RF-02: Modo URA (Respostas Automáticas)

**Descrição:** Sistema de URA configurável com respostas automáticas.

**Funcionalidades:**
- Mensagem de boas-vindas automática
- Mensagem fora de horário
- Keywords e respostas automáticas
- Preview/teste das configurações

**Regras de URA:**
```json
{
  "welcome_message": "Olá! Bem-vindo à {nome_empresa}. Como posso ajudar?",
  "away_message": "Nosso horário de atendimento é {horario}. Retornaremos em breve!",
  "business_hours": {
    "mon": {"open": "09:00", "close": "18:00"},
    "tue": {"open": "09:00", "close": "18:00"},
    // ...
  },
  "keywords": [
    {"keyword": "preço", "response": "Nossos preços variam..."},
    {"keyword": "horário", "response": "Funcionamos de..."}
  ]
}
```

**Arquivos:**
- `src/pages/Attendant/components/UraConfig.tsx`
- `supabase/functions/process-ura/index.ts`

### 2.3 RF-03: Interface de Conversas

**Descrição:** Lista de conversas estilo WhatsApp Web.

**Funcionalidades:**
- Lista com foto, nome, preview da última mensagem
- Badge com quantidade de não lidas
- Ordenar por mais recente
- Filtros: todas, não lidas, arquivadas
- Busca por nome/telefone

**Layout:**
```
┌─────────────────────────────────────┐
│  Conversas                    [+]   │
│  ┌───────────────────────────────┐  │
│  │ 🔍 Buscar...                  │  │
│  └───────────────────────────────┘  │
│  [Todos] [Clientes] [Leads]         │
├─────────────────────────────────────┤
│  ┌───┐ João Silva             14:30│
│  │ 👤│ Olá, gostaria de...      [3]│
│  └───┘                               │
│  ┌───┐ Maria Oliveira         14:15│
│  │ 👩│ Obrigada pela ajuda!        │
│  └───┘                               │
└─────────────────────────────────────┘
```

**Arquivos:**
- `src/pages/Attendant/ConversationsPage.tsx`
- `src/pages/Attendant/components/ConversationList.tsx`
- `src/pages/Attendant/components/ConversationCard.tsx`

### 2.4 RF-04: Interface de Chat

**Descrição:** Tela de chat estilo WhatsApp Web.

**Funcionalidades:**
- Visualização estilo bolhas (chat bubbles)
- Marcação de quem enviou (cliente/sistema/atendente)
- Horário de cada mensagem
- Input de texto com envio por Enter
- Indicador de "digitando..."
- Respostas rápidas (shortcuts)
- Associar conversa a cliente do CRM

**Layout:**
```
┌──────────────────────────────────────────────┐
│  ←  João Silva                    [Info]     │
│      Online • WhatsApp                       │
├──────────────────────────────────────────────┤
│                                              │
│         ┌──────────────┐                     │
│         │ Olá! Como    │ 14:30 ✓✓           │
│         │ posso ajudar?│                     │
│         └──────────────┘                     │
│                                              │
│  ┌──────────────┐                            │
│  │ Gostaria de  │ 14:31                      │
│  │ saber o preço│                            │
│  └──────────────┘                            │
│                                              │
├──────────────────────────────────────────────┤
│  [📎] [😊] Digite sua mensagem...      [➤]   │
└──────────────────────────────────────────────┘
```

**Arquivos:**
- `src/pages/Attendant/ChatPage.tsx`
- `src/pages/Attendant/components/ChatWindow.tsx`
- `src/pages/Attendant/components/ChatInput.tsx`
- `src/pages/Attendant/components/MessageBubble.tsx`

### 2.5 RF-05: Integração WhatsApp (Evolution API)

**Descrição:** Integração bidirecional com WhatsApp via Evolution API.

**Fluxo de Recebimento:**
```
Cliente WhatsApp
    ↓
Evolution API
    ↓
Webhook n8n (fluxo do parceiro)
    ↓
Supabase Edge Function (webhook-whatsapp)
    ↓
Grava em atd_mensagens
    ↓
Notifica frontend (Realtime ou Polling)
```

**Fluxo de Envio:**
```
Frontend (chat)
    ↓
Supabase Edge Function (send-whatsapp-message)
    ↓
Webhook n8n
    ↓
Evolution API
    ↓
Cliente WhatsApp
```

**Arquivos:**
- `supabase/functions/webhook-whatsapp/index.ts`
- `supabase/functions/send-whatsapp-message/index.ts`

### 2.6 RF-06: Notificações

**Descrição:** Sistema de notificações para novas mensagens.

**Funcionalidades:**
- Notificação no navegador
- Badge na aba do navegador
- Som opcional
- Alerta de conversa sem resposta (timeout configurável)

**Arquivos:**
- `src/services/notificationService.ts`
- `src/hooks/useNotifications.ts`

---

## 3. Modelagem de Dados

### 3.1 Tabela: atd_config

```sql
CREATE TABLE atd_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_empresa UUID REFERENCES me_empresa(id) ON DELETE CASCADE,
  agent_name VARCHAR(100) NOT NULL DEFAULT 'Atendente UNIQ',
  agent_personality TEXT,
  mode VARCHAR(10) CHECK (mode IN ('ura', 'agent')) DEFAULT 'ura',
  avatar_url TEXT,
  
  -- Configurações comuns
  welcome_message TEXT,
  away_message TEXT,
  business_hours JSONB DEFAULT '{"mon":{"open":"09:00","close":"18:00"},"tue":{"open":"09:00","close":"18:00"},"wed":{"open":"09:00","close":"18:00"},"thu":{"open":"09:00","close":"18:00"},"fri":{"open":"09:00","close":"18:00"},"sat":{"open":"09:00","close":"12:00"},"sun":null}',
  phone_number VARCHAR(20) NOT NULL,
  evolution_instance_id VARCHAR(100),
  
  -- Config URA (Modelo 1)
  ura_rules JSONB DEFAULT '[]',
  
  -- Config Agente (Modelo 2)
  n8n_workflow_id VARCHAR(100),
  
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE atd_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's config"
  ON atd_config FOR SELECT
  USING (id_empresa IN (
    SELECT id_empresa FROM me_usuario WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their company's config"
  ON atd_config FOR UPDATE
  USING (id_empresa IN (
    SELECT id_empresa FROM me_usuario WHERE id = auth.uid()
  ));
```

### 3.2 Tabela: atd_conversas

```sql
CREATE TABLE atd_conversas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_empresa UUID REFERENCES me_empresa(id) ON DELETE CASCADE,
  id_cliente UUID REFERENCES me_cliente(id) ON DELETE SET NULL,
  remote_phone VARCHAR(20) NOT NULL,
  remote_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'archived')),
  assigned_to UUID REFERENCES me_usuario(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE atd_conversas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's conversations"
  ON atd_conversas FOR SELECT
  USING (id_empresa IN (
    SELECT id_empresa FROM me_usuario WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their company's conversations"
  ON atd_conversas FOR UPDATE
  USING (id_empresa IN (
    SELECT id_empresa FROM me_usuario WHERE id = auth.uid()
  ));

-- Índices
CREATE INDEX idx_conversas_empresa ON atd_conversas(id_empresa);
CREATE INDEX idx_conversas_status ON atd_conversas(status);
CREATE INDEX idx_conversas_last_message ON atd_conversas(last_message_at DESC);
```

### 3.3 Tabela: atd_mensagens

```sql
CREATE TABLE atd_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_conversa UUID REFERENCES atd_conversas(id) ON DELETE CASCADE,
  direction VARCHAR(3) CHECK (direction IN ('in', 'out')),
  sender_type VARCHAR(10) CHECK (sender_type IN ('client', 'agent', 'system', 'bot')),
  sender_id UUID REFERENCES me_usuario(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type VARCHAR(50),
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'document', 'location')),
  external_id VARCHAR(100),
  read_at TIMESTAMPTZ,
  is_automated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE atd_mensagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's messages"
  ON atd_mensagens FOR SELECT
  USING (id_conversa IN (
    SELECT id FROM atd_conversas WHERE id_empresa IN (
      SELECT id_empresa FROM me_usuario WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert messages"
  ON atd_mensagens FOR INSERT
  WITH CHECK (id_conversa IN (
    SELECT id FROM atd_conversas WHERE id_empresa IN (
      SELECT id_empresa FROM me_usuario WHERE id = auth.uid()
    )
  ));

-- Índices
CREATE INDEX idx_mensagens_conversa ON atd_mensagens(id_conversa);
CREATE INDEX idx_mensagens_created_at ON atd_mensagens(created_at);
```

### 3.4 Tabela: atd_respostas_rapidas

```sql
CREATE TABLE atd_respostas_rapidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_empresa UUID REFERENCES me_empresa(id) ON DELETE CASCADE,
  shortcut VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE atd_respostas_rapidas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their company's quick replies"
  ON atd_respostas_rapidas FOR ALL
  USING (id_empresa IN (
    SELECT id_empresa FROM me_usuario WHERE id = auth.uid()
  ));
```

---

## 4. APIs e Edge Functions

### 4.1 Edge Function: webhook-whatsapp

**Endpoint:** `POST /functions/v1/webhook-whatsapp`

**Request:**
```typescript
{
  instance_id: string,
  message: {
    id: string,
    from: string,
    text: string,
    timestamp: string,
    type: 'text' | 'image' | 'audio' | 'document'
  }
}
```

**Fluxo:**
1. Identificar empresa pelo `instance_id`
2. Buscar ou criar conversa pelo número `from`
3. Gravar mensagem em `atd_mensagens`
4. Atualizar `last_message_at` e `unread_count`
5. Se modo = 'ura', processar regras de automação
6. Retornar 200 OK

**Arquivo:** `supabase/functions/webhook-whatsapp/index.ts`

### 4.2 Edge Function: send-whatsapp-message

**Endpoint:** `POST /functions/v1/send-whatsapp-message`

**Request:**
```typescript
{
  conversation_id: string,
  content: string,
  sender_id: string,
  message_type?: 'text' | 'image' | 'audio'
}
```

**Fluxo:**
1. Validar permissões do sender
2. Gravar mensagem em `atd_mensagens` (direction = 'out')
3. Enviar webhook para n8n
4. Retornar confirmação

**Arquivo:** `supabase/functions/send-whatsapp-message/index.ts`

### 4.3 Edge Function: process-ura

**Endpoint:** `POST /functions/v1/process-ura`

**Request:**
```typescript
{
  message_id: string,
  conversation_id: string,
  content: string
}
```

**Fluxo:**
1. Buscar configuração URA da empresa
2. Verificar horário de funcionamento
3. Verificar keywords
4. Se match, enviar resposta automática
5. Gravar resposta em `atd_mensagens` (is_automated = true)

**Arquivo:** `supabase/functions/process-ura/index.ts`

---

## 5. Interfaces TypeScript

### 5.1 Tipos Principais

```typescript
// src/types/attendant.ts

export interface AttendantConfig {
  id: string;
  id_empresa: string;
  agent_name: string;
  agent_personality?: string;
  mode: 'ura' | 'agent';
  avatar_url?: string;
  welcome_message?: string;
  away_message?: string;
  business_hours: BusinessHours;
  phone_number: string;
  evolution_instance_id?: string;
  ura_rules: UraRule[];
  n8n_workflow_id?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  mon?: { open: string; close: string } | null;
  tue?: { open: string; close: string } | null;
  wed?: { open: string; close: string } | null;
  thu?: { open: string; close: string } | null;
  fri?: { open: string; close: string } | null;
  sat?: { open: string; close: string } | null;
  sun?: { open: string; close: string } | null;
}

export interface UraRule {
  id: string;
  keyword: string;
  response: string;
  active: boolean;
}

export interface Conversation {
  id: string;
  id_empresa: string;
  id_cliente?: string;
  remote_phone: string;
  remote_name?: string;
  status: 'open' | 'pending' | 'resolved' | 'archived';
  assigned_to?: string;
  last_message_at?: string;
  last_message_preview?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
  cliente?: {
    id: string;
    nome_cliente: string;
  };
}

export interface Message {
  id: string;
  id_conversa: string;
  direction: 'in' | 'out';
  sender_type: 'client' | 'agent' | 'system' | 'bot';
  sender_id?: string;
  content: string;
  media_url?: string;
  media_type?: string;
  message_type: 'text' | 'image' | 'audio' | 'document' | 'location';
  external_id?: string;
  read_at?: string;
  is_automated: boolean;
  created_at: string;
}

export interface QuickReply {
  id: string;
  id_empresa: string;
  shortcut: string;
  content: string;
  category?: string;
  created_at: string;
}
```

---

## 6. Fluxos de Dados

### 6.1 Fluxo: Recebimento de Mensagem

```
Cliente WhatsApp
    ↓
Evolution API (Docker)
    ↓
Webhook n8n (fluxo parceiro)
    ↓
POST /webhook-whatsapp
    ↓
├─ Identificar empresa
├─ Buscar/criar conversa
├─ Gravar mensagem (direction='in')
├─ Atualizar conversa
└─ Se modo='ura': processar automação
    ↓
Frontend (via polling ou realtime)
```

### 6.2 Fluxo: Envio de Mensagem

```
Frontend (usuário digita)
    ↓
POST /send-whatsapp-message
    ↓
├─ Validar permissões
├─ Gravar mensagem (direction='out')
└─ Enviar webhook n8n
    ↓
n8n → Evolution API
    ↓
Cliente WhatsApp
```

### 6.3 Fluxo: Automação URA

```
Mensagem recebida
    ↓
Verificar horário comercial
    ↓
Fora de horário? → Enviar away_message
    ↓
Verificar keywords
    ↓
Match? → Enviar resposta automática
    ↓
Gravar resposta (is_automated=true)
```

---

## 7. Estrutura de Arquivos

### 7.1 Backend

```
supabase/
├── migrations/
│   └── 20260224_create_attendant_module.sql
├── functions/
│   ├── webhook-whatsapp/
│   │   └── index.ts
│   ├── send-whatsapp-message/
│   │   └── index.ts
│   └── process-ura/
│       └── index.ts
```

### 7.2 Frontend

```
src/
├── pages/
│   └── Attendant/
│       ├── index.tsx                    # Export/Layout
│       ├── AttendantConfig.tsx          # Configuração
│       ├── ConversationsPage.tsx        # Lista de conversas
│       ├── ChatPage.tsx                 # Chat
│       └── components/
│           ├── ModeSelector.tsx
│           ├── PersonalityConfig.tsx
│           ├── UraConfig.tsx
│           ├── BusinessHoursConfig.tsx
│           ├── ConversationList.tsx
│           ├── ConversationCard.tsx
│           ├── ChatWindow.tsx
│           ├── ChatInput.tsx
│           ├── MessageBubble.tsx
│           ├── QuickReplies.tsx
│           └── CustomerInfo.tsx
├── services/
│   ├── attendantService.ts
│   ├── conversationService.ts
│   └── notificationService.ts
├── types/
│   └── attendant.ts
└── hooks/
    ├── useConversations.ts
    ├── useMessages.ts
    └── useNotifications.ts
```

---

## 8. Menu e Navegação

### 8.1 Adicionar ao Menu

**Arquivo:** `src/config/submenus.ts`

```typescript
dashboard: {
  // ... existing items
  children: [
    // ... existing items
    { 
      icon: 'support_agent', 
      label: 'Atendente', 
      view: 'attendant',
      href: '/attendant'
    },
  ]
}
```

### 8.2 Rotas

**Arquivo:** `src/routes/index.tsx` (ou equivalente)

```typescript
{
  path: '/attendant',
  element: <AttendantLayout />,
  children: [
    { path: '', element: <Navigate to="conversations" /> },
    { path: 'config', element: <AttendantConfig /> },
    { path: 'conversations', element: <ConversationsPage /> },
    { path: 'chat/:id', element: <ChatPage /> }
  ]
}
```

---

## 9. Plano de Implementação

### Dia 1 (25/02): Setup e Modelagem

**Tarefas:**
1. [ ] Criar migration SQL (`20260224_create_attendant_module.sql`)
   - Tabelas: atd_config, atd_conversas, atd_mensagens, atd_respostas_rapidas
   - RLS Policies
   - Índices

2. [ ] Criar Edge Function `webhook-whatsapp`
   - Handler básico
   - Gravação de mensagens
   - Atualização de conversas

3. [ ] Criar tipos TypeScript
   - `src/types/attendant.ts`

4. [ ] Criar services
   - `src/services/attendantService.ts`
   - `src/services/conversationService.ts`

**Entregáveis:**
- Database schema criado
- Edge function básica funcionando
- Tipos e services definidos

### Dia 2 (26/02): Interface de Configuração

**Tarefas:**
1. [ ] Criar página `AttendantConfig.tsx`
   - Formulário de configuração
   - Seleção de modo (URA/Agente)
   - Personalização (nome, avatar, personalidade)

2. [ ] Criar componentes de configuração
   - `ModeSelector.tsx`
   - `PersonalityConfig.tsx`
   - `BusinessHoursConfig.tsx`

3. [ ] Criar configuração URA
   - `UraConfig.tsx`
   - Formulário de keywords
   - Preview de mensagens

4. [ ] Testar integração com Evolution API

**Entregáveis:**
- Tela de configuração funcional
- Configuração URA completa
- Testes básicos de integração

### Dia 3 (27/02): Interface de Chat

**Tarefas:**
1. [ ] Criar página `ConversationsPage.tsx`
   - Lista de conversas
   - Filtros e busca
   - Cards de conversa

2. [ ] Criar componentes de lista
   - `ConversationList.tsx`
   - `ConversationCard.tsx`

3. [ ] Criar página `ChatPage.tsx`
   - Layout de chat
   - Header com informações do cliente

4. [ ] Criar componentes de chat
   - `ChatWindow.tsx`
   - `MessageBubble.tsx`
   - `ChatInput.tsx`

5. [ ] Implementar polling (5 segundos)

**Entregáveis:**
- Lista de conversas funcional
- Chat com envio/recebimento
- Polling de atualizações

### Dia 4 (28/02): Integração e Validação

**Tarefas:**
1. [ ] Criar Edge Function `send-whatsapp-message`
   - Envio de mensagens
   - Integração com n8n

2. [ ] Criar Edge Function `process-ura`
   - Processamento de regras
   - Respostas automáticas

3. [ ] Implementar respostas rápidas
   - `QuickReplies.tsx`
   - CRUD de atalhos

4. [ ] Notificações
   - `notificationService.ts`
   - Badge na aba
   - Som opcional

5. [ ] Integração com CRM
   - Associar conversa a cliente
   - Buscar histórico

6. [ ] Testes com beta testers
   - Gráfica
   - Confecção

**Entregáveis:**
- Sistema completo funcionando
- Fluxo URA operacional
- Testes com usuários reais
- Ajustes finais

---

## 10. Testes

### 10.1 Testes Manuais

**Configuração:**
- [ ] Cadastrar número WhatsApp
- [ ] Escolher modo URA
- [ ] Configurar mensagens automáticas
- [ ] Testar preview

**Chat:**
- [ ] Enviar mensagem do cliente
- [ ] Verificar recebimento na interface
- [ ] Responder pelo sistema
- [ ] Verificar envio para WhatsApp
- [ ] Testar respostas rápidas

**URA:**
- [ ] Testar mensagem fora de horário
- [ ] Testar keywords
- [ ] Verificar resposta automática

### 10.2 Testes com Beta Testers

**Gráfica:**
- [ ] Setup em < 10 minutos
- [ ] Receber mensagens de clientes
- [ ] Responder pelo sistema
- [ ] Feedback de usabilidade

**Confecção:**
- [ ] Setup em < 10 minutos
- [ ] Testar URA com keywords
- [ ] Associar conversas a clientes
- [ ] Feedback de usabilidade

---

## 11. Métricas de Sucesso

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Tempo resposta automática | < 5 segundos | Logs do sistema |
| Taxa resolução automática (URA) | 30% | Contador de URA |
| Satisfação beta testers | > 4/5 | Pesquisa NPS |
| Setup pelo parceiro | < 10 minutos | Teste de usabilidade |
| Uptime do sistema | 99% | Monitoramento |

---

## 12. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Evolution API instável | Média | Alto | Fallback para notificação manual |
| Parceiro não configurar corretamente | Alta | Média | Wizard intuitivo + documentação |
| Volume de mensagens alto | Baixa | Médio | Monitorar e escalar |
| Latência na entrega | Média | Médio | Otimizar queries, usar índices |

---

## 13. Referências

- **PRD Sprint 09:** `tracking/research/PRD_Sprint_09.md`
- **Brainstorm:** `tracking/research/Brainstorm_Sprint_09_Atendente.md`
- **Documentação Evolution API:** https://doc.evolution-api.com
- **Documentação n8n:** https://docs.n8n.io

---

## 14. Checklist de Conclusão

### Backend
- [ ] Migrations criadas e aplicadas
- [ ] Edge Functions implementadas
- [ ] RLS Policies configuradas
- [ ] Testes de API realizados

### Frontend
- [ ] Páginas criadas
- [ ] Componentes implementados
- [ ] Services funcionando
- [ ] Integrações testadas

### Integração
- [ ] n8n configurado
- [ ] Evolution API integrada
- [ ] Webhooks testados
- [ ] Fluxo end-to-end validado

### Testes
- [ ] Testes manuais realizados
- [ ] Beta testers ativados
- [ ] Feedback coletado
- [ ] Ajustes implementados

---

**Status:** 🟡 EM DESENVOLVIMENTO  
**Próxima Ação:** Iniciar implementação (Dia 1)  
**Data de Início:** 25/02/2026  
**Data de Término Prevista:** 28/02/2026

---

*Documento criado seguindo a metodologia Vibe Coding (SDD) - Passo 2: Especificação Tática*
