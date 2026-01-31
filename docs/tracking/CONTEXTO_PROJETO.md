# Contexto Consolidado - UNIQ Empresas

**Última Atualização:** 31/01/2026  
**Objetivo:** Sincronização de contexto entre máquinas Ultra e UNIQ

---

## 📊 Resumo Executivo

**UNIQ Empresas** é uma **plataforma SaaS modular** que combina:
- 🧠 **Consultoria de Growth Hacking** (conhecimento)
- 🛠️ **Ferramentas de Gestão Empresarial** (tecnologia)
- 📊 **Métricas e Acompanhamento** (resultados)

**Proposta de Valor:** *"O Norte para Empreendedores - Comece Por Aqui"*

---

## 🎯 Visão Estratégica

### Diferencial Competitivo
Enquanto outras consultorias entregam **apenas conhecimento** e outras plataformas entregam **apenas ferramentas**, a UNIQ entrega **AMBOS**, permitindo que o empreendedor:
- Aprenda enquanto faz
- Execute sem precisar de múltiplas ferramentas
- Veja resultados sem precisar ser expert em gestão/marketing

### 3 Pilares Estratégicos
1. **🤖 Consultor Ativo (Diferencial):** Sistema trabalha para o dono - avisa sobre oportunidades perdidas
2. **🚫 Anti-ERP (Fronteira):** Sem Emissão Fiscal no MVP - foco em Vendas/Relacionamento
3. **📈 Viralidade (Growth):** Sistema de indicação + "Powered by UNIQ"

---

## 👥 Público-Alvo: "Empreendedor na Correria"

**Características:**
- Pequeno empresário já em operação (não startup)
- Estrutura pequena (solopreneur ou equipe reduzida)
- **Não tem tempo** para estudar
- **Não é expert** em gestão/marketing
- **Já está no jogo** - precisa crescer enquanto opera o negócio

**Principais Dores:**
1. ❌ Falta de divulgação
2. ❌ Dificuldade em vender/divulgar online
3. ❌ Múltiplas ferramentas caras e complexas
4. ❌ Falta de conhecimento técnico
5. ❌ Falta de tempo para aprender

---

## 👥 Os 4 Beta Testers (Clientes MVP)

| Cliente | Dor Real | Solução UNIQ |
|---------|----------|--------------|
| **Ótica** | Preciso de vendas e organização | CRM + Marketing |
| **Gráfica** | Fluxo de pedidos confuso | CRM + Pipeline |
| **Confecção** | Ninguém conhece minha marca | Ferramentas de Marketing |
| **Estética** | Perco tempo agendando | Chatbot + Agenda (n8n) |

**Conclusão Crítica:** 3 dos 4 clientes priorizam **Marketing/Vendas** sobre gestão burocrática.

---

## 🏗️ Arquitetura do Produto

### Núcleo (para todos)
- Login/Cadastro
- Dashboard
- Perfil da Empresa
- Configurações básicas

### Módulos Ativáveis

| Módulo | Status | Prioridade |
|--------|--------|------------|
| **CRM** (Gestão de Clientes) | ✅ Funcional | 🟡 ALTA |
| **Finance** (Contas a Pagar/Receber) | ✅ Funcional | 🟡 ALTA |
| **Catálogo de Produtos** | ✅ Funcional | 🟡 ALTA |
| **Loja Virtual (Storefront)** | 🔄 Em desenvolvimento | 🟡 ALTA |
| **Cadastro de Serviços** | 🔄 Mockup criado | 🟡 ALTA |
| **Cadastro de Clientes** | 📋 Planejado | 🟡 ALTA |
| **Cadastro de Fornecedores** | 📋 Planejado | 🟢 MÉDIA |
| **Cadastro de Colaboradores** | 📋 Planejado | 🟢 MÉDIA |
| **Chatbot/Atendimento** | 🔄 Estrutura existe | 🟡 ALTA |
| **Métricas e Analytics** | 📋 Planejado | 🟢 MÉDIA |

---

## 🤖 Consultor Ativo - Arquitetura Técnica

### "Cérebro no Código, Voz no n8n"

**Fluxo:**
```
Cron Schedule → Edge Function (Análise) → advisor_insights → n8n → WhatsApp
```

**3 Cenários Implementados:**
1. **Risco de Churn:** Cliente sem interação há >45 dias → Sugerir "Checkup Gratuito"
2. **Negociação Travada:** Oportunidade sem movimento há >7 dias → Mensagem de "Follow-up"
3. **Aniversário de Casa:** Cliente há exatos 365 dias → Cupom de presente

**Arquivos:**
- Edge Function: `supabase/functions/daily-advisor/index.ts`
- Tabela: `advisor_insights`

---

## 📅 Timeline & Roadmap

### 🔴 Onda 1: Fundação Sólida (29/01 - 02/02)
**Meta:** 4 clientes conseguem criar conta e fazer login

- [x] Login funcionando
- [ ] Cadastro de novos usuários
- [ ] Documentação (PRD + Sistema de Tracking)

### 🟡 Onda 2: Módulos Essenciais (03/02 - 31/03)
**Meta:** Construir módulos críticos baseado em feedback

- [ ] CRM separado de "Minha Empresa"
- [ ] Cadastro de Serviços completo
- [ ] Cadastro de Clientes completo
- [ ] Loja Virtual funcional (catálogo público + carrinho + checkout)
- [ ] Integrações (Instagram, WhatsApp)

### 🟢 Onda 3: Polimento e Entrega (01/04 - 30/04)
**Meta:** Produto robusto e pronto para clientes pagantes

- [ ] Refinamento UX/UI
- [ ] Documentação de ajuda
- [ ] Testes de performance
- [ ] Preparação para lançamento comercial

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Frontend** | React 19 + TypeScript | Moderno, tipado, componentizado |
| **Build Tool** | Vite | Rápido, HMR eficiente |
| **Styling** | Tailwind CSS | Produtividade e consistência |
| **Backend** | Supabase | BaaS completo (auth, DB, storage) |
| **Database** | PostgreSQL (via Supabase) | Relacional, robusto, escalável |
| **Hosting** | Vercel | Deploy automático, CDN global |
| **Routing** | React Router v7 | Navegação client-side |
| **Automação** | n8n | Workflows e integrações |

---

## 🎯 Filosofia de Desenvolvimento

> **"Simples primeiro, complexo depois"**
> 
> Criar a estrutura mais simples possível e evoluir baseado em necessidade real dos empreendedores, não em suposições.

### Modelo de Co-criação
O MVP será desenvolvido **COM** os clientes, não **PARA** os clientes. Eles testam, dão feedback, e o produto evolui em tempo real.

---

## 📝 Notas Importantes para Desenvolvimento

### Máquina Ultra
- **Limitações:** Sem privilégios de admin, sem acesso ao MCP do Supabase
- **Solução:** Gerar arquivos `.sql` para execução manual no Supabase

### Máquina UNIQ
- **Acesso:** Completo ao MCP do Supabase
- **Vantagem:** Deploy direto de migrations e edge functions

---

## 🔗 Documentos Relacionados

- [PRD.md](./PRD.md) - Product Requirements Document
- [ROADMAP.md](./ROADMAP.md) - Roadmap detalhado
- [product_strategy.md](./product_strategy.md) - Estratégia de produto
- [active_consultant_strategy.md](./active_consultant_strategy.md) - Estratégia do Consultor Ativo
- [database_schema.md](./database_schema.md) - Esquema de banco de dados
- [n8n_integration.md](./n8n_integration.md) - Integração com n8n

---

## 📊 Métricas de Sucesso (MVP)

### Fase 1 (02/02)
- [x] Usuários conseguem acessar a plataforma
- [ ] Cadastro de novos usuários funciona sem erros
- [ ] Experiência mobile responsiva

### Fase 2 (31/03)
- [ ] 3 clientes com Loja Virtual publicada e ativa
- [ ] CRM sendo usado para gestão de pipeline
- [ ] Pelo menos 1 venda realizada através da plataforma
- [ ] Feedback positivo sobre usabilidade

### Fase 3 (30/04)
- [ ] Zero bugs críticos
- [ ] Todos os módulos prometidos funcionais
- [ ] Documentação de ajuda completa
- [ ] Clientes aptos a usar sozinhos (autonomia)
- [ ] Pelo menos 3 dos 4 clientes dispostos a pagar

---

**Este documento serve como fonte única de verdade para contextualização do projeto UNIQ Empresas entre diferentes ambientes de desenvolvimento.**
