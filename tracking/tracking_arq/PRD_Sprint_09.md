# Product Requirements Document (PRD)
# Módulo Atendente UNIQ - Sprint 09

**Versão:** 1.0  
**Data:** 24/02/2026  
**Autor:** AI Agent + Squad UNIQ  
**Status:** Em Desenvolvimento

---

## 1. 📋 Visão Geral

### 1.1 Problema
Os pequenos empreendedores (beta testers) trabalham sozinhos ou com equipes de 2-3 pessoas, tendo que produzir, vender, atender fornecedores E atender clientes simultaneamente. Não há tempo para responder mensagens manualmente o dia todo.

### 1.2 Solução
**Atendente UNIQ** - Módulo de atendimento via WhatsApp que permite:
- Automação de respostas (URA configurável)
- Atendimento humano centralizado
- Histórico completo de conversas
- Integração nativa com CRM e Catálogo

### 1.3 Diferencial
Ao contrário de soluções como Chatwoot ou WATI, o Atendente UNIQ é:
- **Integrado ao ecossistema UNIQ** (CRM, Vendas, Catálogo)
- **Enxuto** - focado em pequenos negócios, sem complexidade desnecessária
- **Flexível** - dois modelos: URA simples ou Agente especializado (n8n)

---

## 2. 🎯 Objetivos

### 2.1 Objetivos de Negócio
- Reduzir tempo de resposta para clientes finais
- Permitir que parceiros atendam fora do horário comercial
- Centralizar comunicação em uma única plataforma
- Aumentar taxa de conversão (não perder leads)

### 2.2 Objetivos Técnicos
- Integrar Evolution API via n8n
- Criar interface de chat responsiva
- Sincronizar dados com módulo CRM
- Suportar 200 mensagens/dia por parceiro

### 2.3 Métricas de Sucesso
| Métrica | Meta | Como Medir |
|---------|------|------------|
| Tempo resposta automática | < 5 segundos | Logs do sistema |
| Taxa resolução automática | 30% | Contador de URA |
| Satisfação beta testers | > 4/5 | Pesquisa NPS |
| Setup pelo parceiro | < 10 minutos | Teste de usabilidade |
| Uptime do sistema | 99% | Monitoramento |

---

## 3. 👥 Personas

### 3.1 Parceiro UNIQ (Empresário)
**Nome:** Carlos (Gráfica)  
**Dor:** "Recebo 50 mensagens por dia no WhatsApp pessoal. Não consigo produzir e responder ao mesmo tempo."
**Necessidade:** Sistema que responda automaticamente perguntas simples e me avise só quando for necessário intervir.

### 3.2 Cliente Final
**Nome:** Maria (Cliente da Ótica)  
**Dor:** "Mando mensagem perguntando preço e demoro horas para receber resposta."
**Necessidade:** Resposta rápida e clara, mesmo que automática.

### 3.3 Atendente Humano
**Nome:** Funcionário da Estética  
**Dor:** "Tenho que alternar entre WhatsApp pessoal, celular da empresa e planilhas."
**Necessidade:** Interface única onde vejo todas as conversas e histórico do cliente.

---

## 4. 📱 User Stories

### 4.1 Configuração do Atendente
**US-01:** Como parceiro, quero cadastrar meu número WhatsApp para começar a atender pela plataforma.  
**Critérios:**
- Informar número de telefone
- Conectar com Evolution API
- Validar conexão com teste

**US-02:** Como parceiro, quero escolher entre modo URA ou Agente para definir como quero automatizar.  
**Critérios:**
- Opção clara entre os dois modelos
- Poder mudar de modo a qualquer momento
- Descrição dos benefícios de cada modo

**US-03:** Como parceiro, quero personalizar o nome e personalidade do meu atendente para criar identidade com meus clientes.  
**Critérios:**
- Escolher nome (ex: "Maria", "Bot", "Atendente Virtual")
- Selecionar tom de voz (pré-definidos + campo livre)
- Fazer upload de avatar

### 4.2 Modo URA
**US-04:** Como parceiro, quero configurar mensagem de boas-vindas automática para receber clientes educadamente.  
**Critérios:**
- Campo de texto livre
- Preview da mensagem
- Ativar/desativar

**US-05:** Como parceiro, quero configurar mensagem fora de horário para não deixar clientes sem resposta.  
**Critérios:**
- Definir horário de funcionamento (dia a dia)
- Mensagem personalizada para fora de horário
- Opção de informar horário de retorno

**US-06:** Como parceiro, quero criar respostas automáticas para keywords (preço, endereço, horário) para responder perguntas frequentes.  
**Critérios:**
- Cadastrar palavras-chave
- Definir resposta para cada keyword
- Suporte a múltiplas keywords
- Testar antes de ativar

### 4.3 Interface de Atendimento
**US-07:** Como atendente, quero ver lista de todas as conversas para saber quem precisa de atenção.  
**Critérios:**
- Lista com foto, nome, preview da última mensagem
- Badge com quantidade de não lidas
- Ordenar por mais recente
- Filtro: todas, não lidas, arquivadas

**US-08:** Como atendente, quero abrir uma conversa e ver histórico completo para contextualizar o atendimento.  
**Critérios:**
- Visualização estilo WhatsApp (bolhas)
- Marcação de quem enviou (cliente/sistema/atendente)
- Horário de cada mensagem
- Scroll infinito para histórico antigo

**US-09:** Como atendente, quero enviar mensagem de texto para responder o cliente em tempo real.  
**Critérios:**
- Campo de input com textarea
- Enviar com Enter
- Indicador de "digitando..."
- Confirmação de envio

**US-10:** Como atendente, quero usar respostas rápidas para agilizar atendimentos repetitivos.  
**Critérios:**
- Cadastrar atalhos (ex: /preco)
- Selecionar atalho e preencher input automaticamente
- Categorizar respostas

**US-11:** Como atendente, quero marcar conversa como resolvida ou pendente para organizar meu trabalho.  
**Critérios:**
- Botões: Resolver, Pendente, Arquivar
- Filtro por status
- Contador de pendentes

**US-12:** Como atendente, quero associar conversa a um cliente do CRM para ter acesso a histórico completo.  
**Critérios:**
- Buscar cliente existente
- Criar novo cliente se não existir
- Ver dados do cliente (nome, telefone, histórico)

### 4.4 Notificações
**US-13:** Como parceiro, quero receber notificação quando houver mensagem nova para não perder atendimentos.  
**Critérios:**
- Notificação no navegador
- Badge na aba do navegador
- Som opcional
- Não notificar se janela está ativa

**US-14:** Como parceiro, quero receber alerta quando uma conversa está sem resposta há X tempo para não deixar cliente esperando.  
**Critérios:**
- Configurar tempo limite (ex: 30 min)
- Alerta visual na interface
- Alerta via Consultor Ativo (n8n)

---

## 5. 🏗️ Arquitetura Técnica

### 5.1 Visão Geral
```
Cliente WhatsApp
    ↓
Evolution API (Docker local)
    ↓
Webhook n8n (fluxo criado pelo parceiro/UNIQ)
    ↓
Grava no Supabase (atd_mensagens)
    ↓
Decide: automático ou humano?
    ↓
├─ Automático → Envia resposta via Evolution
└─ Humano → Notifica parceiro na interface UNIQ
```

### 5.2 Componentes Principais

#### Backend (Supabase)
- **Edge Functions:**
  - `webhook-receive`: Recebe do n8n e grava mensagem
  - `send-message`: Envia mensagem para n8n
  - `process-ura`: Processa regras de URA (se modo = ura)
  
- **Tabelas:**
  - `atd_config`: Configuração do atendente
  - `atd_conversas`: Threads de conversa
  - `atd_mensagens`: Mensagens individuais

#### Frontend (React)
- **Páginas:**
  - `/attendant/config`: Configuração do atendente
  - `/attendant/conversations`: Lista de conversas
  - `/attendant/chat/:id`: Tela de chat
  
- **Componentes:**
  - `ConversationsList`: Lista de chats
  - `ChatWindow`: Área de mensagens
  - `ChatInput`: Input de texto
  - `UraConfig`: Configuração de URA
  - `AgentConfig`: Configuração de agente

#### Integração n8n (Fluxos do Parceiro)
- **Webhook Receive:** Recebe mensagem do Evolution
- **Send Message:** Envia mensagem para Evolution
- **URA Engine:** Processa regras de automação (Modelo 1)
- **Agent Engine:** Lógica personalizada (Modelo 2)

### 5.3 Modelagem de Dados

```sql
-- Configuração do Atendente
CREATE TABLE atd_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_empresa UUID REFERENCES me_empresa(id) ON DELETE CASCADE,
  agent_name VARCHAR(100) NOT NULL DEFAULT 'Atendente UNIQ',
  agent_personality TEXT,
  mode VARCHAR(10) CHECK (mode IN ('ura', 'agent')) DEFAULT 'ura',
  avatar_url TEXT,
  welcome_message TEXT,
  away_message TEXT,
  business_hours JSONB DEFAULT '{"mon":{"open":"09:00","close":"18:00"}}',
  phone_number VARCHAR(20) NOT NULL,
  evolution_instance_id VARCHAR(100),
  ura_rules JSONB DEFAULT '[]',
  n8n_workflow_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversas
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

-- Mensagens
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

-- Índices
CREATE INDEX idx_conversas_empresa ON atd_conversas(id_empresa);
CREATE INDEX idx_conversas_status ON atd_conversas(status);
CREATE INDEX idx_conversas_last_message ON atd_conversas(last_message_at DESC);
CREATE INDEX idx_mensagens_conversa ON atd_mensagens(id_conversa);
```

### 5.4 APIs

#### Receber Mensagem (Webhook)
```typescript
POST /functions/v1/webhook-whatsapp
Body: {
  instance_id: string,
  message: {
    id: string,
    from: string, // número do cliente
    text: string,
    timestamp: string
  }
}
```

#### Enviar Mensagem
```typescript
POST /functions/v1/send-whatsapp-message
Body: {
  conversation_id: string,
  content: string,
  sender_id: string
}
```

#### Listar Conversas
```typescript
GET /rest/v1/atd_conversas?id_empresa=eq.{id}&order=last_message_at.desc
```

#### Listar Mensagens
```typescript
GET /rest/v1/atd_mensagens?id_conversa=eq.{id}&order=created_at.asc
```

---

## 6. 🎨 Design e UX

### 6.1 Layout
- **Estilo:** Similar ao WhatsApp Web
- **Cores:** Tema UNIQ (azul principal)
- **Responsivo:** Funciona em desktop e tablet
- **Dark mode:** Suporte ao tema escuro da plataforma

### 6.2 Telas Principais

#### Tela 1: Configuração
- Formulário em etapas (wizard)
- Preview em tempo real
- Validação de campos
- Teste de conexão

#### Tela 2: Lista de Conversas
- Sidebar esquerda com lista
- Card de conversa com:
  - Foto (círculo)
  - Nome + telefone
  - Preview última mensagem (truncado)
  - Badge de não lidas
  - Timestamp

#### Tela 3: Chat
- Header: foto, nome, status (online/offline)
- Área de mensagens:
  - Bolhas arredondadas
  - Cores diferentes para cliente/sistema/atendente
  - Timestamp em cada mensagem
- Footer: input + botões de ação

### 6.3 Fluxos de Navegação
```
Dashboard → Menu Atendente → Lista de Conversas → Chat Específico
                    ↓
            Configuração do Atendente
```

---

## 7. ✅ Critérios de Aceitação

### 7.1 Funcionalidade
- [ ] Parceiro consegue cadastrar número WhatsApp em < 5 min
- [ ] Mensagens são recebidas e exibidas em < 3 segundos
- [ ] Respostas automáticas funcionam conforme regras configuradas
- [ ] Interface mostra histórico completo de conversas
- [ ] Associação com cliente CRM funciona automaticamente

### 7.2 Usabilidade
- [ ] Interface intuitiva (teste com 3 usuários sem treinamento)
- [ ] Funciona em Chrome, Firefox e Safari
- [ ] Responsivo (teste em 1366x768 e 1920x1080)
- [ ] Tempo de carregamento inicial < 2 segundos

### 7.3 Performance
- [ ] Suporta 50 conversas simultâneas sem degradação
- [ ] Lista de conversas carrega em < 1 segundo
- [ ] Histórico de 1000 mensagens carrega em < 3 segundos

### 7.4 Segurança
- [ ] Números de telefone mascarados quando apropriado
- [ ] Acesso apenas para usuários autenticados
- [ ] Logs de auditoria de mensagens

---

## 8. 📅 Plano de Implementação

### Sprint 09 (4 dias)

#### Dia 1: Setup e Modelagem
- [ ] Criar migrations das tabelas
- [ ] Configurar políticas de segurança (RLS)
- [ ] Criar Edge Functions básicas
- [ ] Setup inicial do frontend

#### Dia 2: Interface de Configuração
- [ ] Tela de configuração do atendente
- [ ] Formulário de modo (URA/Agente)
- [ ] Configuração de URA (mensagens, keywords)
- [ ] Testes iniciais

#### Dia 3: Interface de Chat
- [ ] Lista de conversas
- [ ] Componente de chat
- [ ] Envio/recebimento de mensagens
- [ ] Integração com backend

#### Dia 4: Integração e Testes
- [ ] Integrar com n8n (webhooks)
- [ ] Testes com Evolution API
- [ ] Testes beta (Gráfica e Confecção)
- [ ] Ajustes finais e documentação

---

## 9. 🔗 Dependências

### Técnicas
- Evolution API configurada e funcionando
- n8n acessível e configurado
- Módulo CRM existente (para associação de clientes)

### Externas
- Conta no Evolution API
- Webhook configurado no n8n
- Números de teste disponíveis

---

## 10. 📝 Notas e Decisões

### Decisões Arquiteturais
1. **Dois modelos (URA/Agente):** Dá flexibilidade para diferentes perfis de parceiros
2. **Prefixo atd_ nas tabelas:** Padronização do módulo
3. **n8n como "ponte":** Você cria os fluxos, a plataforma só consome
4. **Campos JSONB para regras:** Flexível para evolução futura

### Riscos e Mitigações
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Evolution API instável | Média | Alto | Fallback para notificação manual |
| Parceiro não configurar corretamente | Alta | Média | Wizard intuitivo + documentação |
| Volume de mensagens alto | Baixa | Médio | Monitorar e escalar |

### Futuro (fora do MVP)
- [ ] Integração Facebook/Instagram
- [ ] Chatbots com IA (OpenAI)
- [ ] Múltiplos atendentes simultâneos
- [ ] Análise de sentimento
- [ ] Relatórios avançados

---

## 11. 📚 Documentação Relacionada

- [Brainstorm Sprint 09](../research/Brainstorm_Sprint_09_Atendente.md)
- [SPEC Sprint 09](../../specs/SPEC_Sprint_09.md) (a ser criado)
- [Documentação Evolution API](https://doc.evolution-api.com)
- [Documentação n8n](https://docs.n8n.io)

---

**Status:** ✅ PRD Completo  
**Próximo Passo:** Criar SPEC técnica com detalhes de implementação

**Aprovação:**
- [ ] Product Owner
- [ ] Tech Lead
- [ ] Stakeholder Principal
