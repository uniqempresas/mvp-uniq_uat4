# Documentação Sprint 10 - FASE 5 & FASE 6

## FASE 5: Configuração n8n (Manual)

Esta fase requer acesso ao painel do n8n e não pode ser automatizada via código.

### 5.1 Workflow de Recebimento (Evolution → Supabase)

**Trigger:** Webhook do Evolution API

**Fluxo:**
1. **Webhook Node**
   - Method: POST
   - URL: `https://seu-n8n.com/webhook/evolution-receiver`
   - Response Mode: Last Node

2. **Function Node (Transformação)**
```javascript
const event = $input.first().json;

return {
  json: {
    instance_id: event.instance.id,
    message: {
      id: event.data.key.id,
      from: event.data.key.remoteJid.split('@')[0],
      text: event.data.message?.conversation || '',
      timestamp: new Date(event.data.messageTimestamp * 1000).toISOString(),
      type: event.data.messageType || 'text',
      media_url: event.data.message?.imageMessage?.url || 
                 event.data.message?.documentMessage?.url || null
    }
  }
};
```

3. **HTTP Request Node (Supabase Edge Function)**
   - Method: POST
   - URL: `https://seu-projeto.supabase.co/functions/v1/webhook-whatsapp`
   - Headers:
     - Authorization: `Bearer ${$env.SUPABASE_SERVICE_ROLE_KEY}`
     - Content-Type: `application/json`
   - Body: `{{$json}}`

### 5.2 Workflow de Envio (Supabase → Evolution)

**Trigger:** Webhook do Supabase (Database Trigger)

**Fluxo:**
1. **Webhook Node**
   - Method: POST
   - URL: `https://seu-n8n.com/webhook/send-whatsapp`

2. **HTTP Request Node (Evolution API)**
   - Method: POST
   - URL: `https://sua-evolution-api.com/message/sendText/{{$json.instance_id}}`
   - Headers:
     - apikey: `${$env.EVOLUTION_API_KEY}`
   - Body:
```json
{
  "number": "{{$json.phone}}",
  "text": "{{$json.message}}"
}
```

### 5.3 Configuração das Instâncias Evolution

**Para cada empresa (Gráfica e Confecção):**

1. Acesse o painel Evolution API
2. Crie uma nova instância
3. Configure o webhook:
   - URL: `https://seu-n8n.com/webhook/evolution-receiver`
   - Events: `messages.upsert`
4. Anote o `instance_id`
5. Cadastre no Supabase na tabela `crm_chat_config`:
```sql
UPDATE crm_chat_config 
SET evolution_instance_id = 'id-da-instancia'
WHERE empresa_id = 'id-da-empresa';
```

### 5.4 Variáveis de Ambiente no n8n

Configure estas variáveis:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `EVOLUTION_API_KEY`

---

## FASE 6: Cleanup - Arquivos Removidos

### ✅ Removido de App.tsx
- Import de `AttendantLayout`
- Rotas `/attendant` e `/attendant/config`
- Adicionado redirect para `/crm`

### ✅ Removido de submenus.ts
- Item de menu "Atendente" do dashboard
- Submenu completo `attendant`

### 📋 Arquivos a serem REMOVIDOS (após validação):

**Páginas:**
```
src/pages/Attendant/
├── index.tsx
├── AttendantLayout.tsx
├── AttendantConfig.tsx
├── ConversationsPage.tsx
├── ChatPage.tsx
└── components/
    ├── ChatWindow.tsx
    ├── ChatInput.tsx
    ├── MessageBubble.tsx
    ├── ConversationList.tsx
    ├── CustomerInfo.tsx
    ├── ModeSelector.tsx
    ├── PersonalityConfig.tsx
    ├── BusinessHoursConfig.tsx
    └── UraConfig.tsx
```

**Serviços:**
```
src/services/
├── attendantService.ts
└── conversationService.ts
```

**Types:**
```
src/types/attendant.ts
```

### 📋 Tabelas SQL preservadas (histórico):

NÃO delete estas tabelas, apenas renomeie se desejar:
```sql
-- Renomear para histórico (opcional)
ALTER TABLE atd_conversas RENAME TO _old_atd_conversas;
ALTER TABLE atd_mensagens RENAME TO _old_atd_mensagens;
ALTER TABLE atd_config RENAME TO _old_atd_config;
ALTER TABLE atd_respostas_rapidas RENAME TO _old_atd_respostas_rapidas;
```

### ✅ Verificação de Cleanup

Após remover os arquivos, verifique:
1. `npm run build` passa sem erros
2. `npm run typecheck` sem erros
3. Navegação para `/attendant` redireciona para `/crm`
4. Menu não mostra mais "Atendente"

---

## FASE 7: Cadastro Empresas Beta (SQL)

Execute estes scripts SQL para cadastrar as empresas beta:

### Gráfica
```sql
-- 1. Criar empresa
INSERT INTO empresas (nome, slug, cnpj, email, telefone)
VALUES ('Gráfica Rápida', 'grafica-rapida', '00.000.000/0001-00', 'contato@graficarapida.com', '5511999999999')
RETURNING id;

-- 2. Ativar módulos (substitua :empresa_id pelo ID retornado)
INSERT INTO unq_empresa_modulos (empresa_id, modulo_id, ativo)
SELECT :empresa_id, id, true FROM unq_modulos_sistema WHERE codigo IN ('crm', 'financeiro', 'vendas', 'catalogo');

-- 3. Configurar chat
INSERT INTO crm_chat_config (empresa_id, agente_nome, mensagem_boas_vindas, mensagem_ausencia)
VALUES (:empresa_id, 'Assistente Gráfica', 'Olá! Bem-vindo à Gráfica Rápida. Como posso ajudar?', 'Nosso horário é de seg a sex, 8h às 18h');
```

### Confecção
```sql
-- 1. Criar empresa
INSERT INTO empresas (nome, slug, cnpj, email, telefone)
VALUES ('Confecção Estilo', 'confeccao-estilo', '00.000.000/0002-00', 'contato@confeccaoestilo.com', '5511888888888')
RETURNING id;

-- 2. Ativar módulos
INSERT INTO unq_empresa_modulos (empresa_id, modulo_id, ativo)
SELECT :empresa_id, id, true FROM unq_modulos_sistema WHERE codigo IN ('crm', 'financeiro', 'vendas', 'catalogo');

-- 3. Configurar chat
INSERT INTO crm_chat_config (empresa_id, agente_nome, mensagem_boas_vindas, mensagem_ausencia)
VALUES (:empresa_id, 'Assistente Confecção', 'Olá! Bem-vindo à Confecção Estilo. Como posso ajudar?', 'Nosso horário é de seg a sex, 8h às 18h');
```

---

## FASE 8: Checklist de Testes

### Testes de Unificação
- [ ] Acessar `/crm/chat` - interface unificada carrega
- [ ] Visualizar cores diferentes por canal
- [ ] Filtro por canal funciona
- [ ] Configuração do agente acessível em CRM > Configurações
- [ ] Menu "Atendente" não existe mais
- [ ] Redirect `/attendant` → `/crm` funciona

### Testes WhatsApp
- [ ] Mensagem recebida do WhatsApp aparece no UNIQ
- [ ] Resposta pelo UNIQ chega no WhatsApp
- [ ] URA responde fora de horário
- [ ] Associar conversa a cliente existente

### Testes Funcionais
- [ ] Login e navegação
- [ ] Cadastro de produto
- [ ] Venda no PDV
- [ ] Registro no Financeiro
- [ ] Loja virtual acessível

---

**Data:** 01/03/2026  
**Status:** FASES 1-4 COMPLETAS | FASES 5-8 PENDENTES/Documentação
