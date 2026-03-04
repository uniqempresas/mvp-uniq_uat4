# 🧠 Brainstorm - Módulo Atendente UNIQ (Sprint 09)

**Data:** 24/02/2026  
**Autor:** AI Agent + Squad UNIQ  
**Objetivo:** Definir escopo e arquitetura do Módulo Atendente UNIQ

---

## 📋 Contexto

### Problema
Os 4 beta testers trabalham sozinhos ou com no máximo 2-3 pessoas. Precisam produzir, comprar, vender, atender fornecedores E atender clientes simultaneamente.

### Solução Proposta
**Atendente UNIQ** - Módulo de atendimento via WhatsApp integrado à plataforma, permitindo:
- Respostas automáticas configuráveis
- Interface unificada para atendimento humano
- Histórico completo de conversas
- Integração com CRM

---

## 🎯 Definições do Módulo

### Nome
**Atendente UNIQ** ✅ Aprovado

### Conceito
Interface entre **Parceiro UNIQ** e **Cliente do Parceiro**  
(Diferente do Consultor Ativo que é UNIQ → Parceiro)

### Inspiração
Chatwoot - mas enxuto e focado em pequenos empreendedores

---

## 👥 Dores dos Beta Testers

| Cliente | Dor Específica | Como o Módulo Ajuda |
|---------|----------------|---------------------|
| **Ótica** | Precisa organizar vendas + atendimento | Centraliza atendimento, associa a vendas |
| **Gráfica** | Fluxo de pedidos confuso | Status automático de pedidos via chat |
| **Confecção** | Ninguém conhece a marca | Resposta rápida 24h, não perde lead |
| **Estética** | Perco tempo agendando | Automação de agendamento |

---

## 🏗️ Arquitetura Definida

### Modelo 1: URA Configurável
**Para quem:** Parceiros que querem automação simples
**Funcionamento:**
- Respostas automáticas baseadas em:
  - Horário (fora de expediente)
  - Keywords ("preço", "horário", "endereço")
  - Mensagem de boas-vindas
- Fallback para atendimento humano

### Modelo 2: Agente Especializado
**Para quem:** Parceiros que querem IA/fluxos avançados
**Funcionamento:**
- Fluxo completo no n8n (você cria)
- Pode usar IA (OpenRouter, etc)
- Integrações personalizadas
- Lógica complexa

### Fluxo Técnico

```
Cliente WhatsApp
    ↓
Evolution API (Docker)
    ↓
Webhook n8n (VOCÊ CRIA)
    ↓
Grava no Supabase (atd_mensagens)
    ↓
Decide: automático ou humano?
    ↓
├─ Automático → Envia resposta via Evolution
└─ Humano → Notifica parceiro na interface UNIQ

Parceiro responde pela interface UNIQ
    ↓
Envia para n8n
    ↓
Evolution API
    ↓
Cliente WhatsApp
```

---

## 🗄️ Modelagem de Dados

### Tabelas

```sql
-- Configuração do Atendente
atd_config (
  id uuid PK,
  id_empresa uuid FK > me_empresa.id,
  agent_name varchar(100), -- "Maria", "Bot Atendente"
  agent_personality text, -- "Formal e educado"
  mode enum('ura', 'agent'), -- Modelo 1 ou 2
  avatar_url text NULL,
  
  -- Configurações comuns
  welcome_message text,
  away_message text,
  business_hours jsonb, -- {"mon": {"open": "09:00", "close": "18:00"}}
  phone_number varchar(20),
  evolution_instance_id varchar(100),
  status enum('active', 'inactive'),
  
  -- Config URA (Modelo 1)
  ura_rules jsonb, -- [{"keyword": "preço", "response": "..."}]
  
  -- Config Agente (Modelo 2)
  n8n_workflow_id varchar(100),
  
  created_at timestamp,
  updated_at timestamp
);

-- Conversas (threads)
atd_conversas (
  id uuid PK,
  id_empresa uuid FK,
  id_cliente uuid FK > me_cliente.id NULL,
  remote_phone varchar(20), -- número do cliente
  remote_name varchar(100) NULL, -- nome no WhatsApp
  status enum('open', 'pending', 'resolved', 'archived'),
  assigned_to uuid FK > me_usuario.id NULL,
  last_message_at timestamp,
  last_message_preview text,
  unread_count int DEFAULT 0,
  created_at timestamp,
  updated_at timestamp
);

-- Mensagens
atd_mensagens (
  id uuid PK,
  id_conversa uuid FK > atd_conversas.id,
  direction enum('in', 'out'), -- in=cliente, out=atendente
  sender_type enum('client', 'agent', 'system', 'bot'),
  sender_id uuid NULL,
  content text,
  media_url text NULL,
  media_type varchar(50) NULL,
  message_type enum('text', 'image', 'audio', 'document', 'location'),
  external_id varchar(100) NULL, -- ID Evolution API
  read_at timestamp NULL,
  is_automated boolean DEFAULT false,
  created_at timestamp
);
```

---

## 🎨 Interface (Telas)

### 1. Configuração do Atendente
- Escolher nome e avatar
- Definir personalidade/tom de voz
- Selecionar modo (URA ou Agente)
- Configurar horário de funcionamento
- Cadastrar número WhatsApp

### 2. Configuração URA (se modo = ura)
- Mensagem de boas-vindas
- Mensagem fora de horário
- Keywords e respostas automáticas
- Preview/teste

### 3. Lista de Conversas
- Estilo WhatsApp Web
- Lista de chats (foto, nome, preview última msg)
- Badge de não lidas
- Filtro: todas, não lidas, arquivadas
- Busca por nome/telefone

### 4. Tela de Chat
- Cabeçalho: foto, nome, telefone, status
- Área de mensagens (bolhas)
- Input de texto
- Botões de ação: respostas rápidas, transferir, resolver
- Histórico completo

---

## ✅ Features MVP (Sprint 09)

### Must Have
- [ ] Cadastro número WhatsApp (Evolution API)
- [ ] Escolher modo: URA ou Agente
- [ ] Configurar URA (mensagens, horários, keywords)
- [ ] Tela de conversas (lista)
- [ ] Tela de chat (responder)
- [ ] Gravar mensagens no Supabase
- [ ] Webhook n8n (ponte)

### Should Have
- [ ] Mensagem de boas-vindas automática
- [ ] Notificação de novas mensagens
- [ ] Associação automática com cliente CRM
- [ ] Respostas rápidas (shortcuts)

### Could Have
- [ ] Status da conversa (open/pending/resolved)
- [ ] Filtros e busca
- [ ] Múltiplos atendentes

### Won't Have (agora)
- [ ] Integração Facebook/Instagram
- [ ] Chatbots avançados com IA
- [ ] Ligações de voz

---

## 🤖 Integração n8n (Você Cria)

### Fluxo 1: Receber Mensagem (Webhook)
```
Webhook (Evolution) → 
  Gravar no Supabase (atd_mensagens) →
  Verifica se precisa resposta automática →
  Se sim: envia resposta
  Se não: notifica parceiro
```

### Fluxo 2: Enviar Mensagem
```
Interface UNIQ chama n8n →
  n8n envia via Evolution API →
  Grava no Supabase (confirmação)
```

### Fluxo 3: URA (Modelo 1)
```
Recebe mensagem →
  Verifica horário (fora de expediente?) →
  Verifica keywords →
  Responde conforme regra →
  Grava resposta automática
```

### Fluxo 4: Agente Especializado (Modelo 2)
```
Recebe mensagem →
  Seu fluxo completo (IA, integrações, etc) →
  Decide responder ou passar humano →
  Executa ação
```

---

## 📊 Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| Tempo de resposta automática | < 5 segundos |
| Taxa de resolução automática (URA) | 30% |
| Satisfação beta testers | > 4/5 |
| Conversas registradas/dia | > 50 |
| Tempo de setup pelo parceiro | < 10 minutos |

---

## 🚀 Próximos Passos

1. **Criar PRD detalhado** ✅ (a seguir)
2. **Criar SPEC técnica** com arquivos e migrations
3. **Desenvolver backend** (tabelas, APIs)
4. **Desenvolver frontend** (telas)
5. **Criar fluxos n8n** (você)
6. **Testar com beta testers**

---

## 📝 Notas Importantes

- **Evolution API** já está configurada no Docker
- **Chat no módulo CRM** já funciona (pode reaproveitar componentes)
- **n8n** já está integrado ao projeto
- Volume esperado: ~200 mensagens/dia por parceiro
- Personalidade do atendente: pré-definir opções + campo livre

---

**Status:** ✅ Brainstorm Concluído  
**Próximo:** Criar PRD detalhado
