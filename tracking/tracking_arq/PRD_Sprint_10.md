# Product Requirements Document (PRD) - Sprint 10

**Projeto:** UNIQ Empresas  
**Sprint:** 10 - Unificação CRM + Atendente + Ativação Beta Testers  
**Período:** 01/03/2026  
**Status:** EM PLANEJAMENTO  
**Fase:** 1 - Validação MVP  
**Versão:** 1.0

---

## 1. Visão Geral

A Sprint 10 tem como objetivo principal a **unificação do módulo "Atendente" no CRM**, consolidando todas as funcionalidades de atendimento em um único módulo centralizado. Esta unificação elimina a redundância entre o módulo Atendente (separado) e o CRM Chat (existente), simplificando a arquitetura do sistema e melhorando a experiência do usuário.

Além da unificação técnica, esta sprint inclui:
- Configuração da integração WhatsApp via Evolution API + n8n
- Cadastro das empresas beta (Gráfica e Confecção)
- Testes end-to-end completos
- Liberação do acesso para validação dos beta testers

**Meta:** Ativar os 4 beta testers com um sistema unificado e funcional de CRM + Atendimento.

---

## 2. Problema

### 2.1 Situação Atual
O sistema possui duas implementações paralelas de chat/atendimento:

1. **Módulo Atendente** (`/attendant`)
   - Tabelas: `atd_config`, `atd_conversas`, `atd_mensagens`, `atd_respostas_rapidas`
   - Páginas: `AttendantModule`, `AttendantConfig`, `AttendantLayout`
   - Services: `attendantService.ts`, `conversationService.ts`
   - Tipos: `attendant.ts`

2. **CRM Chat** (`/crm/chat`)
   - Tabelas: `crm_chat_conversas`, `crm_chat_mensagens`
   - Página: `CRMChat.tsx`
   - Service: `crmChatService.ts`
   - Integração com Oportunidades e Clientes do CRM

### 2.2 Problemas Identificados
- **Duplicação de código:** Duas implementações de chat com funcionalidades similares
- **Fragmentação de dados:** Conversas e mensagens armazenadas em tabelas separadas
- **Experiência inconsistente:** Usuários precisam alternar entre módulos
- **Manutenção complexa:** Alterações precisam ser feitas em dois lugares
- **Confusão na arquitetura:** Novos desenvolvedores não sabem qual módulo usar

### 2.3 Justificativa da Unificação
O CRM Chat já possui:
- Interface mais moderna e completa
- Integração nativa com Clientes, Leads e Oportunidades
- Suporte a múltiplos canais (WhatsApp, Instagram, Facebook)
- Funcionalidades avançadas (agendamento, notas, atividades)

O Módulo Atendente possui:
- Configuração do agente (URA, personalidade, horários)
- Respostas rápidas
- Integração com Evolution API configurada

A unificação trará o melhor dos dois mundos em uma única solução robusta.

---

## 3. Solução Proposta

### 3.1 Estratégia de Unificação

**Abordagem:** Consolidar tudo no CRM Chat, migrando as funcionalidades exclusivas do Atendente para o CRM.

**Arquitetura Alvo:**
```
CRM
├── Chat (unificado)
│   ├── Conversas (crm_chat_conversas)
│   ├── Mensagens (crm_chat_mensagens)
│   └── Configuração do Agente (crm_chat_config) [NOVO]
├── Oportunidades
├── Clientes
└── Atividades
```

### 3.2 Funcionalidades a Serem Unificadas

Do **Módulo Atendente** para o **CRM Chat**:

1. **Configuração do Agente**
   - Nome do agente
   - Personalidade do bot
   - Modo de operação (URA/Agente)
   - Horário de funcionamento
   - Mensagem de boas-vindas
   - Mensagem de ausência
   - Regras URA (keywords → respostas)

2. **Respostas Rápidas**
   - Atalhos configuráveis
   - Categorização
   - Gestão completa (CRUD)

3. **Integração Evolution API**
   - Instance ID
   - Webhooks de entrada/saída
   - Processamento de mensagens

4. **Canais de Comunicação**
   - WhatsApp (verde)
   - Instagram (rosa)
   - Facebook (azul)
   - Outros

---

## 4. Funcionalidades

### 4.1 Funcionalidades do CRM Chat (Atualizadas)

#### 4.1.1 Lista de Conversas
- [x] Visualização de todas as conversas
- [x] Ordenação por data da última mensagem
- [x] Indicador de mensagens não lidas
- [x] Badge de canal (ícone colorido por canal)
- [x] Filtros por tipo: Todos, Clientes, Leads, Outros
- [x] **NOVO:** Filtros por canal (WhatsApp, Instagram, Facebook)
- [x] Busca por nome/telefone
- [x] Indicador de modo (Bot/Humano)

#### 4.1.2 Interface de Chat
- [x] Visualização de mensagens em bubbles
- [x] Envio de mensagens de texto
- [x] Anexos (preparado para imagem/documento)
- [x] Indicador de leitura (check duplo)
- [x] Timestamp das mensagens
- [x] **ATUALIZAÇÃO:** Cores por canal
  - WhatsApp: Verde (#10B981)
  - Instagram: Rosa (gradiente)
  - Facebook: Azul (#1877F2)
  - Outros: Cinza

#### 4.1.3 Painel de Detalhes
- [x] Informações do cliente/lead
- [x] Ações rápidas:
  - Marcar resolvido
  - Criar agendamento
  - Adicionar nota
  - Criar oportunidade
  - Adicionar lead
- [x] Histórico de oportunidades
- [x] **NOVO:** Toggle Bot/Humano
- [x] **NOVO:** Configurações do Agente (link)

#### 4.1.4 Ações CRM Integradas
- [x] Criar novo lead a partir da conversa
- [x] Criar oportunidade vinculada
- [x] Criar atividade (ligação, reunião, tarefa)
- [x] Criar agendamento com envio de mensagem

### 4.2 Nova Funcionalidade: Configuração do Agente

#### 4.2.1 CRMAttendantConfig.tsx
Nova página no CRM para configurar o atendente virtual:

**Seções:**

1. **Status do Agente**
   - Toggle Ativo/Pausado
   - Indicador de status atual

2. **Modo de Operação**
   - URA (Respostas automáticas por keyword)
   - Agente (IA/N8N completo)

3. **Personalidade**
   - Nome do agente
   - Avatar
   - Descrição da personalidade

4. **Horário de Funcionamento**
   - Configuração dia a dia
   - Horário de abertura/fechamento
   - Dias fechados

5. **Mensagens**
   - Mensagem de boas-vindas
   - Mensagem de fora de horário

6. **Regras URA** (apenas se modo = URA)
   - Lista de regras (keyword → resposta)
   - Toggle ativar/desativar por regra
   - CRUD completo

7. **Integração**
   - Instance ID da Evolution API
   - Status da conexão
   - Testar conexão

8. **Respostas Rápidas**
   - Lista de atalhos
   - Categorias
   - CRUD completo

### 4.3 Integrações

#### 4.3.1 Evolution API
- Recebimento de mensagens via webhook
- Envio de mensagens via API
- Suporte a mídia (imagens, áudio, documentos)
- Status de entrega/leitura

#### 4.3.2 n8n
- Webhook para processamento de mensagens
- Fluxos de automação
- Integração com IA (OpenAI/Anthropic)
- Respostas automáticas inteligentes

---

## 5. Requisitos Técnicos

### 5.1 Banco de Dados (Migrations)

#### 5.1.1 Criar: `crm_chat_config`
```sql
CREATE TABLE crm_chat_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES me_empresa(id) ON DELETE CASCADE,
  
  -- Identificação
  agent_name VARCHAR(100) NOT NULL DEFAULT 'Atendente UNIQ',
  agent_personality TEXT,
  avatar_url TEXT,
  
  -- Modo e Status
  mode VARCHAR(10) CHECK (mode IN ('ura', 'agent')) DEFAULT 'ura',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),
  
  -- Mensagens
  welcome_message TEXT DEFAULT 'Olá! Bem-vindo à {nome_empresa}. Como posso ajudar?',
  away_message TEXT DEFAULT 'Nosso horário de atendimento é {horario}. Retornaremos em breve!',
  
  -- Horário de funcionamento
  business_hours JSONB DEFAULT '{"mon":{"open":"09:00","close":"18:00"},"tue":{"open":"09:00","close":"18:00"},"wed":{"open":"09:00","close":"18:00"},"thu":{"open":"09:00","close":"18:00"},"fri":{"open":"09:00","close":"18:00"},"sat":{"open":"09:00","close":"12:00"},"sun":null}',
  
  -- Integração
  phone_number VARCHAR(20),
  evolution_instance_id VARCHAR(100),
  n8n_workflow_id VARCHAR(100),
  
  -- URA Rules
  ura_rules JSONB DEFAULT '[]',
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_empresa_chat_config UNIQUE (empresa_id)
);

-- Índices
CREATE INDEX idx_crm_chat_config_empresa ON crm_chat_config(empresa_id);
CREATE INDEX idx_crm_chat_config_status ON crm_chat_config(status);

-- Trigger updated_at
CREATE TRIGGER trigger_crm_chat_config_updated_at
  BEFORE UPDATE ON crm_chat_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 5.1.2 Criar: `crm_chat_respostas_rapidas`
```sql
CREATE TABLE crm_chat_respostas_rapidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES me_empresa(id) ON DELETE CASCADE,
  shortcut VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_shortcut_empresa UNIQUE (empresa_id, shortcut)
);

CREATE INDEX idx_crm_chat_respostas_empresa ON crm_chat_respostas_rapidas(empresa_id);
CREATE INDEX idx_crm_chat_respostas_category ON crm_chat_respostas_rapidas(category);
```

#### 5.1.3 Atualizar: `crm_chat_conversas`
Adicionar campo de canal (se não existir):
```sql
-- Verificar se coluna existe, se não, adicionar
ALTER TABLE crm_chat_conversas 
ADD COLUMN IF NOT EXISTS canal VARCHAR(20) DEFAULT 'whatsapp';

-- Índice para filtro por canal
CREATE INDEX IF NOT EXISTS idx_crm_chat_conversas_canal ON crm_chat_conversas(canal);
```

#### 5.1.4 Migrar Dados: `atd_config` → `crm_chat_config`
```sql
-- Migration de dados
INSERT INTO crm_chat_config (
  empresa_id, agent_name, agent_personality, mode, avatar_url,
  welcome_message, away_message, business_hours, phone_number,
  evolution_instance_id, n8n_workflow_id, ura_rules, status
)
SELECT 
  id_empresa, agent_name, agent_personality, mode, avatar_url,
  welcome_message, away_message, business_hours, phone_number,
  evolution_instance_id, n8n_workflow_id, ura_rules, status
FROM atd_config
ON CONFLICT (empresa_id) DO UPDATE SET
  agent_name = EXCLUDED.agent_name,
  agent_personality = EXCLUDED.agent_personality,
  mode = EXCLUDED.mode,
  avatar_url = EXCLUDED.avatar_url,
  welcome_message = EXCLUDED.welcome_message,
  away_message = EXCLUDED.away_message,
  business_hours = EXCLUDED.business_hours,
  phone_number = EXCLUDED.phone_number,
  evolution_instance_id = EXCLUDED.evolution_instance_id,
  n8n_workflow_id = EXCLUDED.n8n_workflow_id,
  ura_rules = EXCLUDED.ura_rules,
  status = EXCLUDED.status;
```

#### 5.1.5 Migrar Dados: `atd_respostas_rapidas` → `crm_chat_respostas_rapidas`
```sql
INSERT INTO crm_chat_respostas_rapidas (
  id_empresa, shortcut, content, category
)
SELECT 
  id_empresa, shortcut, content, category
FROM atd_respostas_rapidas
ON CONFLICT (empresa_id, shortcut) DO UPDATE SET
  content = EXCLUDED.content,
  category = EXCLUDED.category;
```

### 5.2 Frontend (Componentes)

#### 5.2.1 Novos Arquivos
```
src/pages/CRM/
├── CRMAttendantConfig.tsx          [NOVO - Configuração do Agente]
└── components/
    ├── AttendantModeSelector.tsx   [NOVO - Seletor URA/Agente]
    ├── BusinessHoursConfig.tsx     [NOVO - Config horários]
    ├── UraRulesManager.tsx         [NOVO - Gerenciador URA]
    ├── QuickRepliesManager.tsx     [NOVO - Respostas rápidas]
    └── ChannelBadge.tsx            [NOVO - Badge de canal]

src/services/
└── crmChatConfigService.ts         [NOVO - Service config]

src/types/
└── crmChatConfig.ts                [NOVO - Tipos config]
```

#### 5.2.2 Atualizações em Arquivos Existentes

**CRMChat.tsx:**
- [ ] Adicionar filtros por canal (WhatsApp, Instagram, Facebook)
- [ ] Implementar cores diferentes por canal
- [ ] Adicionar toggle Bot/Humano no header
- [ ] Adicionar link para Configurações no painel lateral
- [ ] Integrar respostas rápidas no input

**crmChatService.ts:**
- [ ] Adicionar métodos para respostas rápidas
- [ ] Adicionar método para verificar horário comercial
- [ ] Adicionar método para processar regras URA

### 5.3 Edge Functions (Atualizações)

#### 5.3.1 `webhook-whatsapp` → Atualizar para `crm_chat_*`
- Alterar tabela de `atd_config` para `crm_chat_config`
- Alterar tabela de `atd_conversas` para `crm_chat_conversas`
- Alterar tabela de `atd_mensagens` para `crm_chat_mensagens`

#### 5.3.2 `send-whatsapp-message` → Atualizar para `crm_chat_*`
- Mesmas alterações de tabela

#### 5.3.3 Criar: `crm-chat-webhook`
Unificar processamento de webhooks:
- Receber mensagens da Evolution API
- Aplicar regras URA se modo = URA
- Encaminhar para n8n se modo = Agente
- Retornar respostas automáticas

### 5.4 Configurações de Menu

**src/config/submenus.ts:**
- [ ] Remover entrada `attendant` do menu
- [ ] Adicionar entrada `Configuração do Agente` no submenu CRM

**src/App.tsx:**
- [ ] Remover rotas `/attendant/*`
- [ ] Adicionar rota `/crm/attendant-config` para CRMAttendantConfig

### 5.5 Remoções (Clean Up)

Após migração e testes:

**Remover páginas:**
- [ ] `src/pages/Attendant/index.tsx`
- [ ] `src/pages/Attendant/AttendantConfig.tsx`
- [ ] `src/pages/Attendant/AttendantLayout.tsx`
- [ ] `src/pages/Attendant/ChatPage.tsx`
- [ ] `src/pages/Attendant/ConversationsPage.tsx`
- [ ] `src/pages/Attendant/components/*`

**Remover services:**
- [ ] `src/services/attendantService.ts`
- [ ] `src/services/conversationService.ts`

**Remover tipos:**
- [ ] `src/types/attendant.ts`

**Remover migrations (opcional - após backup):**
- [ ] Dropar tabelas `atd_*` (após confirmação de migração bem-sucedida)

---

## 6. Fluxos de Usuário

### 6.1 Fluxo: Configuração Inicial do Agente

```
Dono da Empresa
├── Acessa CRM > Configuração do Agente
├── Define:
│   ├── Nome do Agente
│   ├── Modo (URA ou Agente)
│   ├── Personalidade
│   └── Avatar
├── Configura Horário de Funcionamento
├── Define Mensagens (welcome/away)
├── Configura Regras URA (se modo = URA)
├── Cadastra Respostas Rápidas
├── Insere Instance ID da Evolution API
└── Salva Configuração
```

### 6.2 Fluxo: Atendimento via WhatsApp

```
Cliente (WhatsApp)
├── Envia mensagem para número da empresa
├── Evolution API recebe e envia webhook
├── Edge Function processa:
│   ├── Busca config em crm_chat_config
│   ├── Verifica se está em horário comercial
│   ├── Cria/atualiza conversa em crm_chat_conversas
│   ├── Salva mensagem em crm_chat_mensagens
│   └── Se modo URA: aplica regras e responde
├── Operador vê notificação no CRM Chat
├── Operador responde pelo CRM
├── Mensagem enviada via Evolution API
└── Cliente recebe no WhatsApp
```

### 6.3 Fluxo: Conversa no CRM Chat

```
Operador
├── Acessa CRM > Chat
├── Vê lista de conversas
├── Seleciona conversa
├── Visualiza:
│   ├── Histórico de mensagens
│   ├── Informações do cliente
│   └── Canal (cor diferente)
├── Pode:
│   ├── Responder mensagem
│   ├── Toggle Bot/Humano
│   ├── Criar oportunidade
│   ├── Criar atividade
│   ├── Agendar
│   └── Adicionar lead
└── Marca como resolvido quando concluído
```

### 6.4 Fluxo: Respostas Rápidas

```
Operador
├── Está em uma conversa
├── Digita "/" no campo de mensagem
├── Sistema mostra lista de atalhos
├── Operador seleciona atalho
├── Mensagem predefinida é inserida
└── Operador pode editar antes de enviar
```

---

## 7. Integrações

### 7.1 Evolution API

**Configuração:**
- URL Base: `https://api.evolution-api.com/v1`
- Instance ID: Configurado em `crm_chat_config.evolution_instance_id`
- Webhook: `https://<project>.supabase.co/functions/v1/webhook-whatsapp`

**Endpoints Utilizados:**
- POST `/message/sendText` - Enviar mensagem texto
- POST `/message/sendMedia` - Enviar mídia
- GET `/instance/connectionState` - Verificar conexão

**Fluxo de Webhook:**
```
Evolution API
├── Nova mensagem recebida
├── POST para edge function
├── Edge function valida instance_id
├── Busca empresa pelo instance_id
├── Processa e responde se necessário
└── Retorna 200 OK
```

### 7.2 n8n

**Configuração:**
- Webhook URL: `https://webhook.uniqempresas.com/webhook/<uuid>`
- Proxy: Edge function `crm-webhook-proxy`

**Fluxos n8n:**
1. **Recebimento de Mensagem**
   - Webhook do n8n recebe payload
   - Processa com IA (OpenAI/Anthropic)
   - Retorna resposta
   - Edge function envia resposta via Evolution API

2. **Envio de Mensagem**
   - CRM envia mensagem
   - Edge function grava no banco
   - Chama n8n para enviar via Evolution API

### 7.3 Supabase Edge Functions

**Funções Atualizadas:**

1. **`webhook-whatsapp`**
   - Entrada: Webhook da Evolution API
   - Processamento: Salva mensagem, aplica URA
   - Saída: Resposta automática (se aplicável)

2. **`send-whatsapp-message`**
   - Entrada: conversation_id, content, sender_id
   - Processamento: Envia via Evolution API
   - Saída: Confirmação de envio

3. **`crm-webhook-proxy`**
   - Entrada: Payload do CRM
   - Processamento: Forward para n8n
   - Saída: Resposta do n8n

---

## 8. Critérios de Aceitação

### 8.1 Unificação CRM + Atendente

- [ ] Migration `crm_chat_config` criada e executada com sucesso
- [ ] Dados migrados de `atd_config` para `crm_chat_config` sem perda
- [ ] Dados migrados de `atd_respostas_rapidas` para `crm_chat_respostas_rapidas`
- [ ] CRMChat.tsx exibe cores diferentes por canal (WhatsApp=verde, Instagram=rosa, Facebook=azul)
- [ ] Filtros por canal funcionam corretamente na lista de conversas
- [ ] Página `CRMAttendantConfig.tsx` criada e funcional
- [ ] Service `crmChatConfigService.ts` implementado com todos os métodos
- [ ] Menu "Atendente" removido do submenu
- [ ] Rotas `/attendant/*` removidas do App.tsx

### 8.2 Integrações

- [ ] Edge function `webhook-whatsapp` atualizada para usar `crm_chat_*`
- [ ] Edge function `send-whatsapp-message` atualizada para usar `crm_chat_*`
- [ ] Fluxo n8n configurado e funcionando
- [ ] Evolution API conectada e recebendo/enviando mensagens
- [ ] Regras URA aplicadas corretamente em horário comercial
- [ ] Mensagem de ausência enviada fora de horário

### 8.3 Funcionalidades

- [ ] Toggle Bot/Humano funciona e persiste no banco
- [ ] Respostas rápidas acessíveis via "/" no chat
- [ ] Configuração de horário comercial salva e aplicada
- [ ] Regras URA (CRUD) funcionam corretamente
- [ ] Agendamento cria atividade e envia mensagem
- [ ] Criação de oportunidade a partir do chat funciona

### 8.4 Testes

- [ ] Teste end-to-end: Cliente envia WhatsApp → aparece no CRM → Operador responde → Cliente recebe
- [ ] Teste URA automática: Keyword gera resposta automática
- [ ] Teste fora de horário: Mensagem de ausência enviada
- [ ] Teste respostas rápidas: Atalho insere mensagem
- [ ] Teste agendamento: Cria atividade e notificação

### 8.5 Remoções (Pós-Migração)

- [ ] Páginas do módulo Atendente removidas
- [ ] Services do Atendente removidos
- [ ] Tipos do Atendente removidos
- [ ] Código compilando sem erros
- [ ] Navegação funcionando corretamente

---

## 9. Riscos e Mitigações

### 9.1 Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Perda de dados na migração | Baixa | Alto | Backup completo antes da migração; testes em staging |
| Downtime do atendimento | Média | Alto | Executar migração em horário de baixo tráfego; ter rollback pronto |
| Falha na integração Evolution API | Média | Alto | Testar integração antes; ter fallback manual |
| Resistência dos usuários | Baixa | Médio | Comunicação prévia; treinamento; documentação |
| Bugs em produção | Média | Alto | Testes completos; monitoramento; canal de suporte rápido |

### 9.2 Plano de Rollback

**Se algo der errado:**

1. Manter tabelas `atd_*` até confirmação de sucesso (não dropar imediatamente)
2. Manter código do módulo Atendente até confirmação (apenas remover imports)
3. Em caso crítico:
   - Reverter migrations (restaurar `atd_*`)
   - Restaurar código anterior
   - Redeploy imediato

### 9.3 Estratégia de Deploy

**Fase 1: Preparação (Dia 1)**
- Criar backup completo do banco
- Executar migrations de criação (`crm_chat_config`, `crm_chat_respostas_rapidas`)
- Migrar dados em background
- Validar migração

**Fase 2: Deploy Frontend (Dia 2)**
- Deploy das novas páginas e services
- Manter módulo Atendente (fallback)
- Testar em produção com conta de teste

**Fase 3: Atualização Edge Functions (Dia 2)**
- Atualizar edge functions para apontar para novas tabelas
- Testar fluxo completo

**Fase 4: Remoção (Dia 3+)**
- Remover menu Atendente
- Remover rotas
- Monitorar por 24h
- Remover código do módulo Atendente (se tudo ok)

---

## 10. Dependências

### 10.1 Dependências Técnicas

- [x] **Supabase:** Banco de dados e Edge Functions
- [x] **Evolution API:** Conta configurada e funcionando
- [x] **n8n:** Instância configurada e workflows prontos
- [ ] **Migrations Sprint 09:** Devem estar aplicadas (tabelas `atd_*` existentes)

### 10.2 Dependências de Negócio

- [ ] **Empresas Beta:** Disponíveis para teste
  - Gráfica: Cartões, panfletos, materiais gráficos
  - Confecção: Camisetas, moletons, personalizados
- [ ] **Números WhatsApp:** Configurados na Evolution API
- [ ] **Treinamento:** Material preparado para beta testers

### 10.3 Dependências de Equipe

- [ ] **Dev Backend:** Disponível para edge functions
- [ ] **Dev Frontend:** Disponível para React/TypeScript
- [ ] **DevOps:** Suporte para deploy e monitoramento
- [ ] **QA:** Disponível para testes

### 10.4 Dependências Externas

- [ ] **Evolution API:** Serviço online e estável
- [ ] **n8n Webhook:** Endpoint acessível
- [ ] **WhatsApp Business:** Números validados

---

## 11. Empresas Beta

### 11.1 Gráfica

**Dados para Cadastro:**
- **Nome:** Gráfica Rápida Beta
- **Segmento:** Materiais gráficos (cartões, panfletos, banners)
- **CNPJ:** [A definir]
- **Contato:** [A definir]
- **WhatsApp:** [A configurar na Evolution API]

**Fluxos de Teste:**
1. Cliente solicita orçamento de cartões
2. URA responde com opções
3. Atendente humano assume
4. Criação de oportunidade
5. Agendamento de entrega

### 11.2 Confecção

**Dados para Cadastro:**
- **Nome:** Confecção Estilo Beta
- **Segmento:** Vestuário personalizado (camisetas, moletons)
- **CNPJ:** [A definir]
- **Contato:** [A definir]
- **WhatsApp:** [A configurar na Evolution API]

**Fluxos de Teste:**
1. Cliente solicita camisetas personalizadas
2. URA envia catálogo
3. Conversa sobre detalhes
4. Criação de orçamento
5. Pedido via catálogo

### 11.3 Checklist de Ativação Beta

Para cada empresa:
- [ ] Cadastrar empresa no sistema
- [ ] Configurar usuário dono
- [ ] Ativar módulo CRM
- [ ] Configurar Evolution API (instance_id)
- [ ] Configurar regras URA
- [ ] Cadastrar respostas rápidas
- [ ] Testar fluxo completo
- [ ] Treinar usuário
- [ ] Liberar acesso

---

## 12. Métricas de Sucesso

### 12.1 KPIs Técnicos

- **Tempo médio de resposta:** < 5 segundos
- **Taxa de sucesso de envio:** > 95%
- **Uptime do sistema:** > 99%
- **Zero perda de mensagens**

### 12.2 KPIs de Negócio

- **4 empresas beta ativas** até 15/03/2026
- **100% das conversas** aparecendo no CRM
- **Satisfação dos beta testers:** > 4/5
- **Tempo médio de atendimento:** redução de 30%

### 12.3 KPIs de Adoção

- **100% dos operadores** usando CRM Chat
- **80% das conversas** com resolução no primeiro contato
- **Uso de respostas rápidas:** > 50% das mensagens

---

## 13. Anexos

### 13.1 Checklist Técnico Completo

#### Migrations
- [ ] 20260301_create_crm_chat_config.sql
- [ ] 20260301_create_crm_chat_respostas_rapidas.sql
- [ ] 20260301_migrate_atd_to_crm_chat.sql
- [ ] 20260301_add_canal_crm_chat_conversas.sql

#### Frontend
- [ ] CRMAttendantConfig.tsx
- [ ] Componentes de configuração
- [ ] Atualizações no CRMChat.tsx
- [ ] Filtros por canal
- [ ] Cores por canal

#### Backend (Edge Functions)
- [ ] webhook-whatsapp (atualizado)
- [ ] send-whatsapp-message (atualizado)
- [ ] crm-chat-webhook (novo)

#### Clean Up
- [ ] Remover src/pages/Attendant/
- [ ] Remover src/services/attendantService.ts
- [ ] Remover src/services/conversationService.ts
- [ ] Remover src/types/attendant.ts
- [ ] Atualizar src/config/submenus.ts
- [ ] Atualizar src/App.tsx

### 13.2 Estrutura de Dados

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
  created_at: string;
  updated_at: string;
}
```

**crm_chat_respostas_rapidas:**
```typescript
interface QuickReply {
  id: string;
  empresa_id: string;
  shortcut: string;
  content: string;
  category?: string;
  created_at: string;
  updated_at: string;
}
```

### 13.3 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
├─────────────────────────────────────────────────────────┤
│  CRM                                                    │
│  ├── Chat (CRMChat.tsx)                                 │
│  ├── Oportunidades                                      │
│  ├── Clientes                                           │
│  └── Configuração do Agente (CRMAttendantConfig.tsx)   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTP / Realtime
                   ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                             │
├─────────────────────────────────────────────────────────┤
│  Tables:                                                │
│  ├── crm_chat_conversas                                 │
│  ├── crm_chat_mensagens                                 │
│  ├── crm_chat_config              [NEW]                 │
│  ├── crm_chat_respostas_rapidas   [NEW]                 │
│  ├── me_cliente                                         │
│  └── crm_oportunidades                                  │
│                                                         │
│  Edge Functions:                                        │
│  ├── webhook-whatsapp         [UPDATED]                 │
│  ├── send-whatsapp-message    [UPDATED]                 │
│  └── crm-webhook-proxy        [EXISTING]                │
└──────────┬────────────────────┬─────────────────────────┘
           │                    │
           │ Webhook            │ API
           ▼                    ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Evolution API       │  │  n8n                 │
│  (WhatsApp)          │  │  (Automação/IA)      │
└──────────┬───────────┘  └──────────┬───────────┘
           │                         │
           │                         │
           ▼                         ▼
    ┌─────────────┐           ┌─────────────┐
    │   Cliente   │           │   OpenAI    │
    │  (WhatsApp) │           │  (Opcional) │
    └─────────────┘           └─────────────┘
```

---

## 14. Aprovações

**Product Owner:** ___________________ Data: _______

**Tech Lead:** ___________________ Data: _______

**Stakeholder:** ___________________ Data: _______

---

**Documento gerado em:** 01/03/2026  
**Versão:** 1.0  
**Status:** Aguardando aprovação para início da Sprint
