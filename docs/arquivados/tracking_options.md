# Sistema de Tracking - Opções para UNIQ Empresas

## 🎯 Objetivo
Ter um acompanhamento visual do desenvolvimento que:
- Mostre o que está **pronto**, **em desenvolvimento** e **planejado**
- Seja acessível tanto para a **equipe** quanto para os **usuários/clientes**
- Seja fácil de atualizar durante o desenvolvimento

---

## 📋 OPÇÃO 1: Roadmap em Arquivo Markdown (Simples)

### ✅ Vantagens
- ✅ **Implementação IMEDIATA** (5 minutos)
- ✅ Sem necessidade de código adicional
- ✅ Versionado no Git (histórico de mudanças)
- ✅ Fácil de editar
- ✅ Pode ser expor em página pública depois

### ❌ Desvantagens
- ❌ Não é dinâmico (usuários não vêem em tempo real)
- ❌ Precisa ser atualizado manualmente
- ❌ Sem interação (apenas leitura)

### 📁 Estrutura Proposta

**Arquivo**: `docs/ROADMAP.md`

```markdown
# Roadmap UNIQ Empresas

Última atualização: 29/01/2026

## 🚀 Em Desenvolvimento (Sprint Atual)

### Login e Cadastro
- [x] Login funcionando
- [ ] Cadastro de novos usuários (EM PROGRESSO)
- [ ] Recuperação de senha

---

## ✅ Concluído (Release Notes)

### v0.1.0 - Janeiro 2026
- [x] Sistema de autenticação básico
- [x] Dashboard inicial
- [x] CRM funcional
- [x] Finance (contas a pagar/receber)
- [x] Cadastro de produtos

---

## 📅 Próximas Entregas

### Fevereiro 2026
- [ ] CRM separado de "Minha Empresa"
- [ ] Cadastro de Serviços
- [ ] Cadastro completo de Clientes
- [ ] Loja Virtual (Storefront público)

### Março 2026
- [ ] Integrações (Instagram, WhatsApp)
- [ ] Chatbot/Atendimento
- [ ] Métricas de Growth Hacking

### Abril 2026
- [ ] Refinamentos de UX/UI
- [ ] Onboarding aprimorado
- [ ] Documentação completa
```

**Atualização**: Você atualiza manualmente após cada entrega
**Usuários vêem**: Pode ser exposto em `/roadmap` depois

---

## 📋 OPÇÃO 2: Roadmap Dinâmico no Supabase (Completo)

### ✅ Vantagens
- ✅ **Dinâmico e em tempo real**
- ✅ Usuários vêem dentro da plataforma
- ✅ Pode ter votação de features
- ✅ Transparência total
- ✅ Integrado ao produto

### ❌ Desvantagens
- ❌ Precisa desenvolver (1-2 dias)
- ❌ Mais complexo
- ❌ Precisa de manutenção

### 🗄️ Estrutura de Dados (Supabase)

**Tabela `roadmap_items`**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID único |
| `title` | text | Nome da feature |
| `description` | text | Descrição detalhada |
| `module` | text | Módulo (CRM, Finance, Loja, etc) |
| `status` | enum | `planned`, `in_progress`, `completed`, `canceled` |
| `priority` | enum | `critical`, `high`, `medium`, `low` |
| `target_date` | date | Data prevista |
| `votes` | integer | Votos de usuários |
| `created_at` | timestamp | Data de criação |
| `completed_at` | timestamp | Data de conclusão |

**Tabela `roadmap_votes`** (opcional):

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID único |
| `item_id` | uuid | FK para roadmap_items |
| `user_id` | uuid | FK para auth.users |
| `created_at` | timestamp | Data do voto |

### 🎨 Interface Proposta

**Página `/roadmap` dentro da plataforma:**

```
┌──────────────────────────────────────┐
│        ROADMAP UNIQ EMPRESAS         │
├──────────────────────────────────────┤
│                                      │
│  🔴 EM DESENVOLVIMENTO               │
│  ┌─────────────────────────────┐    │
│  │ Cadastro de Usuários         │    │
│  │ Prioridade: CRÍTICA          │    │
│  │ Previsão: 02/02/2026         │    │
│  └─────────────────────────────┘    │
│                                      │
│  ✅ CONCLUÍDO                        │
│  ┌─────────────────────────────┐    │
│  │ Dashboard Inicial            │    │
│  │ Concluído em: 15/01/2026     │    │
│  └─────────────────────────────┘    │
│                                      │
│  📅 PLANEJADO                        │
│  ┌─────────────────────────────┐    │
│  │ Loja Virtual                 │    │
│  │ Previsão: Março/2026         │    │
│  │ 👍 12 votos                  │    │
│  │ [VOTAR]                      │    │
│  └─────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

### 📝 Código de Exemplo (Service)

```typescript
// roadmapService.ts

export interface RoadmapItem {
  id: string
  title: string
  description: string
  module: string
  status: 'planned' | 'in_progress' | 'completed' | 'canceled'
  priority: 'critical' | 'high' | 'medium' | 'low'
  target_date: string
  votes: number
  created_at: string
  completed_at?: string
}

export async function getRoadmapItems(): Promise<RoadmapItem[]> {
  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*')
    .order('priority', { ascending: false })
    .order('target_date', { ascending: true })

  if (error) throw error
  return data
}

export async function voteForFeature(itemId: string, userId: string) {
  const { error } = await supabase
    .from('roadmap_votes')
    .insert({ item_id: itemId, user_id: userId })

  if (error) throw error
  
  // Incrementa contador
  await supabase.rpc('increment_votes', { item_id: itemId })
}
```

---

## 📋 OPÇÃO 3: Híbrida (Recomendada para MVP)

### 🎯 Melhor custo-benefício

**Fase 1 (Agora - Fev)**: Use arquivo Markdown (`ROADMAP.md`)
- Rápido, funcional
- Foco total no desenvolvimento
- Atualizações manuais

**Fase 2 (Mar - Abr)**: Migre para Supabase
- Quando tiver mais tempo
- Feature "Roadmap Público" vira um módulo
- Já com dados históricos do markdown

---

## 🤔 Qual escolher?

| Cenário | Recomendação |
|---------|--------------|
| Precisa de **rapidez** | ✅ Opção 1 (Markdown) |
| Quer **transparência total** | Opção 2 (Supabase) |
| **Melhor para MVP** | ✅ Opção 3 (Híbrida) |
| Quer **engajamento** dos usuários | Opção 2 (Supabase) |

---

## 💬 Minha Recomendação

**Para o momento atual (até 02/02):**

👉 **OPÇÃO 1** (arquivo Markdown no Git)

**Motivos:**
1. Implementação **imediata** (já posso criar agora)
2. Não desvia foco do desenvolvimento crítico
3. Você consegue atualizar facilmente
4. Pode expor em página pública depois (15 minutos de dev)
5. Depois migra para Supabase quando tiver tempo

**Depois (Março em diante):**

👉 Migrar para **OPÇÃO 2** como um **módulo de produto**
- Vira feature da plataforma
- Transparência com clientes
- Engajamento (votação de features)

---

## 🚀 Decisão

**Qual opção você prefere?**

1️⃣ Markdown simples (implemento agora)
2️⃣ Supabase completo (desenvolvo nos próximos dias)
3️⃣ Híbrida (Markdown agora, Supabase depois)

**Ou tem outra ideia?**
