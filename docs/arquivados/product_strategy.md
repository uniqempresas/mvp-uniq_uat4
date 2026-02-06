# UNIQ - Estratégia de Produto & Viabilidade do MVP

## 1. Visão do Produto (The "Why")
**O que é:** Uma plataforma de "Aceleração Digital" para pequenos empreendedores (MEI/Pequeno Porte).
**A Diferença:** Não é apenas um software (ERP) passivo. É um **Consultor Digital Ativo**.
**Promessa:** "Nós te ajudamos a vender mais e organizar a bagunça que essas vendas geram."

---

## 2. Diagnóstico dos Beta Testers (Os 4 Primeiros Clientes)

| Cliente | O que pediu | A Dor Real (Diagnóstico) | Solução UNIQ (MVP) |
| :--- | :--- | :--- | :--- |
| **Ótica** | ERP, Fiscal, Mkt | "Preciso de venda e organização." | **CRM + Mkt** (Fiscal = Integração ou Manual) |
| **Gráfica** | ERP, Fiscal, Mkt | "Fluxo de pedidos confuso." | **CRM + Pipeline** (Gerenciar status do pedido) |
| **Confecção** | Mkt nas Redes | "Ninguém conhece minha marca." | **Ferramentas de Mkt** (Postagens/Leads) |
| **Estética** | Robô Agenda | "Perco tempo agendando." | **Chatbot + Agenda** (Via n8n) |

**Conclusão Crítica:** 3 dos 4 clientes pedem "Marketing/Vendas" como prioridade ou paridade. O ERP/Fiscal é uma necessidade burocrática posterior.

> **DECISÃO ESTRATÉGICA:** O UNIQ será primeiro uma ferramenta de **VENDAS & RELACIONAMENTO (CRM/Chat)**. Gestão (ERP) virá apenas o básico para sustentar a venda (Estoque simples/Financeiro simples). **Emissor Fiscal está CORTADO do MVP.**

---

## 3. O Escopo do MVP (Fase 1 - O "Gerador de Caixa")

Foco: Transformar o interessado em cliente e organizar o pedido.

### A. Módulo de Aquisição (Marketing)
*   **O que construir:** Gerador de Links para WhatsApp, Landing Page simples (o UNIQ cria uma vitrine para eles), ou integração simples com Meta Ads (se possível no futuro).
*   **Para quem:** Ótica, Gráfica, Confecção.

### B. Módulo de Conversão (CRM & Chat - O seus pontos fortes atuais)
*   **O que construir:**
    *   **Unified Inbox:** Você já tem o início (`crmChatService`). Centralizar WhatsApp ali.
    *   **Pipeline Kanban:** Para a Gráfica/Ótica saberem onde está o pedido (Aberto, Em Produção, Entregue). Já existe (`OpportunityModal`).
    *   **Agendamento Bot:** Para a Estética. (Via n8n injetando na agenda do UNIQ).

### C. Módulo de Gestão Leve (O "Anti-ERP")
*   **O que construir:**
    *   **Financeiro Simples:** Entrou X, Saiu Y. Sem complexidade contábil.
    *   **Estoque Simples:** Tenho 10, vendi 1, sobraram 9.

---

## 4. Roteiro de Viabilização (Roadmap)

### Passo 1: Consolidação do Chat & CRM (O "Core")
*   **Meta:** Garantir que o Cliente de Estética automotiva consiga usar o Chatbot para agendar e que isso caia num Kanban.
*   **Ação Tácita:** Polir o `crmChatService` e a visualização no Dashboard.

### Passo 2: A "Vitrine" (Marketing)
*   **Meta:** Permitir que a Confecção cadastre produtos e gere um link de "Catálogo" para enviar no WhatsApp.
*   **Ação Tácita:** Melhorar o cadastro de produtos (`ProductService`) para gerar uma visualização pública simples (Vitrine).

### Passo 3: O Financeiro "De Padaria" (Gestão)
*   **Meta:** Mostrar para a Ótica quanto ela vendeu no fim do mês.
*   **Ação Tácita:** Dashboard financeiro simplificado (já iniciou, precisa conectar com as vendas do CRM).

---

## 5. Próximos Passos Imediatos (Para você, Dev)

1.  **Refinar o Chat:** É o diferencial que atrai a Estética e retém os outros.
2.  **Simplificar o Onboarding:** O MEI não tem paciência. O login direto no Dashboard foi um ótimo primeiro passo.
3.  **Esquecer NF-e:** Se o cliente exigir, diga que "está no roadmap" e sugira usar um emissor gratuito do governo ou Bling por fora por enquanto. Não mate seu produtos tentando fazer regra fiscal brasileira agora.
