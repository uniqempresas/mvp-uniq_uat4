# PRD - UNIQ Empresas
**Product Requirements Document**

---

## 📋 Informações do Documento

| Item | Detalhe |
|------|---------|
| **Produto** | UNIQ Empresas - Plataforma SaaS para Growth Hacking |
| **Versão** | 1.0 (MVP) |
| **Data** | 29/01/2026 |
| **Autor** | Luiz Silva |
| **Status** | Em Desenvolvimento |

---

## 🎯 Visão do Produto

### O que é UNIQ Empresas?

UNIQ Empresas é uma **plataforma SaaS modular** que combina **consultoria de Growth Hacking + ferramentas de gestão empresarial**, criada especialmente para pequenos empreendedores que precisam crescer rápido, mas não têm tempo ou expertise técnica.

### Proposta de Valor

**"O Norte para Empreendedores - Comece Por Aqui"**

- 🧠 **Conhecimento**: Mentoria e estratégias de Growth Hacking
- 🛠️ **Tecnologia**: Plataforma tudo-em-um para executar as estratégias
- 📊 **Resultados**: Métricas e acompanhamento em tempo real

### Diferencial Competitivo

Enquanto outras consultorias entregam **apenas conhecimento** e outras plataformas entregam **apenas ferramentas**, a UNIQ entrega **AMBOS**, permitindo que o empreendedor:

- Aprenda enquanto faz
- Execute sem precisar de múltiplas ferramentas
- Veja resultados sem precisar ser expert em gestão/marketing

---

## 👥 Público-Alvo

### Perfil Primário: "Empreendedor na Correria"

**Características:**
- Pequeno empresário já em operação (não é startup early-stage)
- Estrutura pequena (solopreneur ou equipe reduzida)
- **Não tem tempo** para estudar (livros, cursos, faculdade)
- **Não é expert** em gestão, marketing ou tecnologia
- **Já está no jogo** - precisa crescer enquanto opera o negócio
- Precisa de **direcionamento prático e imediato**

**Principais Dores:**
1. ❌ Falta de divulgação
2. ❌ Dificuldade em vender/divulgar online
3. ❌ Múltiplas ferramentas caras e complexas
4. ❌ Falta de conhecimento técnico
5. ❌ Falta de tempo para aprender

**Necessidades:**
- ✅ Direcionamento claro ("o que fazer agora?")
- ✅ Ferramentas simples e integradas
- ✅ Suporte e mentoria contínua
- ✅ Resultados mensuráveis rapidamente

---

## 🏗️ Arquitetura do Produto

### Conceito: Esqueleto Comum + Módulos Sob Demanda

**Núcleo (para todos os usuários):**
- Login/Cadastro
- Dashboard
- Perfil da Empresa
- Configurações básicas

**Módulos Ativáveis (conforme necessidade do cliente):**
- CRM (Gestão de Clientes)
- Finance (Contas a Pagar/Receber)
- Catálogo de Produtos
- Catálogo de Serviços
- Loja Virtual
- Chatbot/Atendimento
- Integrações (Redes Sociais, WhatsApp, etc)
- Métricas e Analytics

---

## 📦 Módulos Detalhados

### 1. Autenticação e Onboarding
**Objetivo**: Cadastro e primeiro acesso simplificado

**Funcionalidades:**
- [ ] Cadastro de nova empresa
- [ ] Login com email/senha
- [ ] Recuperação de senha
- [ ] Onboarding guiado (primeira configuração)
- [ ] Definição de módulos ativos

**Prioridade**: 🔴 **CRÍTICA** (MVP 02/02)

---

### 2. Dashboard
**Objetivo**: Visão geral do negócio e métricas principais

**Funcionalidades:**
- [x] Resumo financeiro (receitas/despesas)
- [x] Visão de clientes ativos
- [x] Tarefas e lembretes
- [ ] Métricas de Growth (funil AARRR)
- [ ] Gráficos de evolução

**Prioridade**: 🟡 **ALTA**

---

### 3. CRM (Customer Relationship Management)
**Objetivo**: Gestão completa de clientes e pipeline de vendas

**Funcionalidades:**
- [x] Lista de clientes
- [x] Detalhes do cliente (contatos, histórico)
- [x] Pipeline de vendas (Kanban)
- [x] Chat/Mensagens com clientes
- [x] Tags e segmentação
- [ ] Automações (follow-up automático)
- [ ] Relatórios de conversão

**Status Atual**: Funcional, mas precisa ser **separado** do módulo "Minha Empresa"

**Prioridade**: 🟡 **ALTA**

---

### 4. Finance (Financeiro)
**Objetivo**: Controle de contas a pagar, receber e fluxo de caixa

**Funcionalidades:**
- [x] Contas a Pagar
- [x] Contas a Receber
- [x] Categorias de despesas/receitas
- [x] Contas bancárias
- [x] Dashboard financeiro
- [ ] Relatórios de fluxo de caixa
- [ ] Projeções financeiras

**Prioridade**: 🟡 **ALTA**

---

### 5. Catálogo de Produtos
**Objetivo**: Cadastro e gestão de produtos para venda

**Funcionalidades:**
- [x] Cadastro de produtos
- [x] Categorias
- [x] Fotos/Imagens
- [x] Preços e estoque
- [ ] Variações (tamanhos, cores)
- [ ] Importação em massa

**Prioridade**: 🟡 **ALTA** (3 dos 4 clientes MVP precisam)

---

### 6. Catálogo de Serviços
**Objetivo**: Cadastro e gestão de serviços oferecidos

**Funcionalidades:**
- [ ] Cadastro de serviços
- [ ] Categorias
- [ ] Preços e durações
- [ ] Agendamento
- [ ] Pacotes de serviços

**Prioridade**: 🟢 **MÉDIA**

---

### 7. Cadastro de Clientes
**Objetivo**: Base completa de clientes para CRM e vendas

**Funcionalidades:**
- [ ] Cadastro completo de clientes
- [ ] CPF/CNPJ
- [ ] Endereços
- [ ] Histórico de compras
- [ ] Notas e observações
- [ ] Importação de planilha

**Prioridade**: 🟡 **ALTA**

---

### 8. Loja Virtual / Storefront
**Objetivo**: Presença online para vendas diretas

**Funcionalidades:**
- [x] URL personalizada (/c/:slug)
- [ ] Catálogo público de produtos
- [ ] Carrinho de compras
- [ ] Checkout
- [ ] Integração com pagamento
- [ ] Personalização de layout/cores
- [ ] Domínio próprio

**Prioridade**: 🟡 **ALTA** (Solicitado por 3 clientes)

**Status Atual**: Estrutura básica existe, mas não funcional

---

## 🗓️ Roadmap e Timeline

### 📍 Onda 1: Fundação Sólida (29/01 - 02/02)
**Objetivo**: MVP operacional para início dos testes

**Entregas:**
- [/] Login funcionando
- [ ] Cadastro de novos usuários funcionando
- [ ] Documentação (PRD + Sistema de Tracking)

**Critério de Sucesso**: 4 clientes conseguem criar conta e fazer login

---

### 📍 Onda 2: Módulos Essenciais (03/02 - 31/03)
**Objetivo**: Construir módulos críticos baseado no feedback dos testadores

**Entregas Planejadas:**
- [ ] CRM separado de "Minha Empresa"
- [ ] Cadastro de Serviços completo
- [ ] Cadastro de Clientes completo
- [ ] Loja Virtual funcional
  - [ ] Catálogo público
  - [ ] Carrinho de compras
  - [ ] Checkout básico
- [ ] Integrações iniciais (Instagram, WhatsApp)
- [ ] Melhorias de UX baseadas em feedback

**Metodologia**: Desenvolvimento iterativo com feedback contínuo dos 4 testadores

---

### 📍 Onda 3: Polimento e Entrega (01/04 - 30/04)
**Objetivo**: Produto robusto e pronto para clientes pagantes

**Entregas:**
- [ ] Refinamento de UX/UI
- [ ] Correção de bugs reportados
- [ ] Documentação de ajuda
- [ ] Onboarding aprimorado
- [ ] Testes de carga e performance
- [ ] Preparação para lançamento comercial

**Critério de Sucesso**: 4 testadores satisfeitos e disposto a recomendar

---

## 🎯 Objetivos de Negócio

### Fase MVP (Fevereiro - Abril 2026)

**Objetivos Primários:**
1. ✅ Validar proposta de valor com 4 clientes reais
2. ✅ Coletar feedback contínuo durante desenvolvimento
3. ✅ Construir produto market-fit antes do lançamento

**Métricas de Sucesso:**
- 4/4 clientes ativos e engajados
- Taxa de uso semanal > 70%
- NPS (Net Promoter Score) > 8
- Pelo menos 2 indicações orgânicas

### Pós-MVP (Maio 2026+)

**Objetivos:**
1. Lançamento comercial
2. Aquisição de 20 clientes pagantes (primeiro trimestre)
3. Identificação de nicho mais promissor
4. Expansão de módulos baseado em demanda

---

## 🔧 Stack Tecnológico

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Frontend** | React 19 + TypeScript | Moderno, tipado, componentizado |
| **Build Tool** | Vite | Rápido, HMR eficiente |
| **Styling** | Tailwind CSS | Produtividade e consistência |
| **Backend** | Supabase | BaaS completo (auth, DB, storage) |
| **Database** | PostgreSQL (via Supabase) | Relacional, robusto, escalável |
| **Hosting** | Vercel | Deploy automático, CDN global |
| **Routing** | React Router v7 | Navegação client-side |

---

## 📊 Critérios de Sucesso (MVP)

### Para 02/02 (Fase 1)
- [x] Usuários conseguem acessar a plataforma
- [ ] Cadastro de novos usuários funciona sem erros
- [ ] Experiência mobile responsiva

### Para 31/03 (Fase 2)
- [ ] 3 clientes com Loja Virtual publicada e ativa
- [ ] CRM sendo usado para gestão de pipeline
- [ ] Pelo menos 1 venda realizada através da plataforma
- [ ] Feedback positivo sobre usabilidade

### Para 30/04 (Entrega Final)
- [ ] Zero bugs críticos
- [ ] Todos os módulos prometidos funcionais
- [ ] Documentação de ajuda completa
- [ ] Clientes aptos a usar sozinhos (autonomia)
- [ ] Pelo menos 3 dos 4 clientes dispostos a pagar

---

## 🚨 Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Escopo cresce demais | 🔴 Alto | 🟡 Média | Módulos sob demanda, não criar tudo de uma vez |
| Feedback conflitante de clientes | 🟡 Médio | 🟢 Alta | Priorizar features com maior overlap |
| Atraso no desenvolvimento | 🔴 Alto | 🟡 Média | Buffer de 30 dias (meta 31/03, promessa 30/04) |
| Clientes desistem durante testes | 🔴 Alto | 🟢 Baixa | Comunicação frequente, valor entregue rápido |
| Bugs em produção | 🟡 Médio | 🟡 Média | Testes iterativos, correções rápidas |

---

## 📝 Notas e Decisões Importantes

### Filosofia de Desenvolvimento
> **"Simples primeiro, complexo depois"**
> 
> Criar a estrutura mais simples possível e evoluir baseado em necessidade real dos empreendedores, não em suposições.

### Modelo de Co-criação
O MVP será desenvolvido **COM** os clientes, não **PARA** os clientes. Eles testam, dão feedback, e o produto evolui em tempo real.

### Modularidade
Cada cliente terá apenas os módulos que precisa ativados, evitando complexidade desnecessária.

---

## 🔄 Próximas Ações Imediatas

1. [ ] Consertar cadastro de usuários
2. [ ] Criar sistema de tracking de desenvolvimento
3. [ ] Separar CRM de "Minha Empresa"
4. [ ] Desenvolver Catálogo público (Storefront funcional)
5. [ ] Implementar Cadastro de Serviços
6. [ ] Implementar Cadastro de Clientes

---

**Última Atualização**: 29/01/2026
