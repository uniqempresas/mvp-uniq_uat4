# Estratégia: O Consultor Ativo (AI-First)

**Data:** 26/01/2026
**Contexto:** Definição da arquitetura para transformar o UNIQ de uma ferramenta passiva em um agente ativo de vendas.

---

## 1. Os 3 Pilares da Estratégia
Conforme discutido, focaremos em diferenciar o produto através de inteligência ativa e viralidade, evitando a complexidade burocrática inicial.

1.  **Consultor Ativo (O Diferencial):** O sistema trabalha pro dono. Ele avisa sobre oportunidades perdidas em vez de esperar o dono abrir o dashboard.
2.  **Anti-ERP (A Fronteira):** Não faremos Emissão Fiscal agora. Se o cliente precisar, integramos com ferramentas externas (Bling/Asaas). Foco total em Vendas/Relacionamento.
3.  **Viralidade (Growth):** Implementaremos um sistema de indicação (Referral) e "Powered by UNIQ" nas vitrines públicas.

---

## 2. Arquitetura Técnica: "Cérebro no Código, Voz no n8n"

Para garantir robustez e segurança, separamos a lógica de decisão da entrega da mensagem.

*   🧠 **CÉREBRO (Supabase Edge Function):** Roda todo dia às 06:00. Analisa o banco, detecta padrões (Churn, Stagnation) e gera o texto da mensagem. Grava na tabela `advisor_insights`.
*   🗣️ **VOZ (n8n):** Lê a tabela `advisor_insights` (polline ou webhook), formata a mensagem para o WhatsApp e envia para o cliente final.

### Fluxo de Dados:
`Cron Schedule` -> `Daily Advisor Function` -> `Table: advisor_insights` -> `n8n Workflow` -> `WhatsApp`

---

## 3. Os 3 Cenários do MVP (Lógica Implementada)

O código da função (`supabase/functions/daily-advisor/index.ts`) já contempla:

1.  **Risco de Churn (Resgate):**
    *   *Regra:* Cliente sem interação há > 45 dias.
    *   *Ação:* Sugerir mensagem de "Checkup Gratuito" ou "Manutenção".
2.  **Negociação Travada (Follow-up):**
    *   *Regra:* Oportunidade aberta e sem movimento há > 7 dias.
    *   *Ação:* Sugerir mensagem de "Oi sumido" / Retomada de contato.
3.  **Aniversário de Casa (Relacionamento):**
    *   *Regra:* Cliente criado há exatos 365 dias.
    *   *Ação:* Sugerir cupom de presente.

---

## 4. Guia de Deploy (Para a Máquina com Node.js)

Como a máquina atual não tinha as ferramentas, siga estes passos na nova máquina para colocar tudo no ar.

**Pré-requisitos:**
*   Node.js instalado (`node -v` funciona).
*   Login no Supabase (`npx supabase login`).

### Passo A: Subir o Banco de Dados
Isso cria a tabela `advisor_insights` na nuvem.
```bash
npx supabase db push
# Se pedir senha, é a senha do banco do projeto.
```

### Passo B: Configurar Variáveis de Ambiente
Isso permite que a função acesse seu banco sem restrições de RLS (Service Role).
```bash
# Pegue a chave 'secret_role' no Dashboard do Supabase > Project Settings > API
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sua_chave_secreta_aqui
npx supabase secrets set SUPABASE_URL=sua_url_do_projeto_aqui
```

### Passo C: Subir a Função
Isso envia o código TypeScript para a borda (Edge).
```bash
npx supabase functions deploy daily-advisor --no-verify-jwt
```

---

## 5. Próximos Passos (Pós-Deploy)

1.  **Configurar Cron:** No Dashboard do Supabase, configurar a função para rodar sozinha todo dia (ou via pg_cron).
2.  **Criar Workflow no n8n:**
    *   Nó Postgres: `SELECT content FROM advisor_insights WHERE status = 'PENDING'`
    *   Nó WhatsApp: Enviar `content`.
    *   Nó Postgres: `UPDATE advisor_insights SET status = 'SENT' WHERE id = ...`
