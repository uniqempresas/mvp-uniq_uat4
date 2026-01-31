# 📖 Guia de Uso - Sistema de Tracking UNIQ

**Versão:** 1.0  
**Data:** 31/01/2026

---

## 🎯 Visão Geral

O Sistema de Tracking do UNIQ Empresas é baseado em **3 arquivos Markdown** sincronizados via Git, projetado para coordenar desenvolvimento entre múltiplas máquinas (Ultra e UNIQ).

### Arquivos do Sistema

```
docs/
├── ROADMAP.md         → Visão estratégica mensal
├── TRACKING.md        → Status detalhado diário
└── CHANGELOG.md       → Histórico de entregas
```

---

## 📋 TRACKING.md - Status Detalhado

### Quando Usar
- **Diariamente** ao iniciar/pausar trabalho
- Ao trocar de máquina
- Ao concluir sub-tarefas

### Estrutura

**Seções:**
1. **🔴 EM PROGRESSO** - Tarefas sendo trabalhadas agora
2. **📋 AGUARDANDO INÍCIO** - Tarefas planejadas
3. **✅ CONCLUÍDO** - Tarefas finalizadas
4. **🚫 BLOQUEADO** - Tarefas com impedimentos

### Como Atualizar

#### 1. Iniciar Nova Tarefa
```markdown
1. Mover tarefa de "AGUARDANDO" para "EM PROGRESSO"
2. Atualizar campos:
   - Responsável: Seu nome
   - Máquina: Ultra/UNIQ
   - Status: 🔧 Em Progresso
   - Início: Data atual
   - Progresso: 0%
3. Salvar e fazer commit
```

#### 2. Durante Desenvolvimento
```markdown
- Marcar sub-tarefas concluídas com [x]
- Atualizar "Progresso: XX%"
- Adicionar observações importantes
- Atualizar "Último commit" com hash/mensagem
```

#### 3. Pausar/Trocar de Máquina
```markdown
- Atualizar "Progresso: XX%"
- Adicionar nota em "Observações"
- Atualizar "Último commit"
- git commit + git push
```

#### 4. Concluir Tarefa
```markdown
1. Marcar todas sub-tarefas [x]
2. Atualizar Progresso: 100%
3. Mover para seção "✅ CONCLUÍDO"
4. Adicionar entrada no CHANGELOG.md
5. git commit + git push
```

---

## 📝 CHANGELOG.md - Histórico de Entregas

### Quando Usar
- Ao concluir uma tarefa
- Ao corrigir um bug relevante
- Ao lançar uma nova versão

### Formato

Seguimos o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/):

```markdown
## [Unreleased]

### Adicionado
- Nova funcionalidade X

### Corrigido
- Bug Y

### Alterado
- Melhoria Z

---

## [0.2.0] - 2026-02-15

### Adicionado
- Feature concluída
```

### Categorias

- **Adicionado**: Novas funcionalidades
- **Corrigido**: Correções de bugs
- **Alterado**: Mudanças em features existentes
- **Removido**: Funcionalidades removidas
- **Descontinuado**: Marcado para remoção futura
- **Segurança**: Correções de vulnerabilidades

---

## 🗺️ ROADMAP.md - Visão Estratégica

### Quando Usar
- **Semanalmente** para atualizar status macro
- Ao mudar prioridades
- Ao adicionar novas entregas planejadas

### Não Editar
- ❌ Não usar para status diário (use TRACKING.md)
- ❌ Não duplicar informações do TRACKING.md

---

## 🔄 Workflow de Sincronização

### Cenário 1: Começar Trabalho

**Máquina UNIQ:**
```bash
# 1. Sincronizar
git pull origin main

# 2. Abrir TRACKING.md
# 3. Escolher tarefa e atualizar status
# 4. Trabalhar...

# 5. Ao final do dia
git add docs/TRACKING.md
git commit -m "Update TRACK-XXX: descrição"
git push origin main
```

**Máquina Ultra:**
```bash
# 1. Sincronizar
git pull origin main

# 2. Ver tarefas disponíveis em TRACKING.md
# 3. Escolher tarefa diferente da que está em UNIQ
# 4. Trabalhar...

# 5. Se precisar gerar .sql
# Criar arquivo docs/migrations/YYYY-MM-DD_nome.sql

# 6. Atualizar tracking
git add docs/TRACKING.md docs/migrations/
git commit -m "Update TRACK-XXX: descrição"
git push origin main
```

---

### Cenário 2: Concluir Tarefa

```bash
# 1. Marcar todas sub-tarefas [x] em TRACKING.md
# 2. Mover tarefa para seção CONCLUÍDO
# 3. Adicionar entrada em CHANGELOG.md (seção Unreleased)

# 4. Commit
git add docs/TRACKING.md docs/CHANGELOG.md
git commit -m "Finish TRACK-XXX: Nome da tarefa"
git push origin main
```

---

### Cenário 3: Criar Nova Tarefa

```bash
# 1. Abrir TRACKING.md
# 2. Copiar template no final do arquivo
# 3. Preencher com dados da nova tarefa
# 4. Incrementar ID (ex: TRACK-009)
# 5. Adicionar na seção "AGUARDANDO INÍCIO"

# 6. Commit
git add docs/TRACKING.md
git commit -m "Add TRACK-XXX: Nova tarefa"
git push origin main
```

---

## 🚨 Regras Importantes

### ✅ Fazer
- ✅ Sempre fazer `git pull` antes de editar
- ✅ Atualizar TRACKING.md ao final do dia
- ✅ Usar IDs únicos (TRACK-XXX)
- ✅ Identificar em qual máquina está trabalhando
- ✅ Adicionar observações relevantes
- ✅ Fazer commits pequenos e frequentes

### ❌ Evitar
- ❌ Editar mesma tarefa em duas máquinas simultaneamente
- ❌ Esquecer de fazer `git push` ao final do dia
- ❌ Não atualizar progresso por vários dias
- ❌ Usar formato diferente do template

---

## 🔍 Consulta Rápida

### Ver Status de Todas as Tarefas
```bash
cat docs/TRACKING.md | grep "### \[TRACK"
```

### Ver Tarefas Em Progresso
```bash
cat docs/TRACKING.md | grep -A 10 "EM PROGRESSO"
```

### Ver Últimas Mudanças
```bash
git log --oneline docs/TRACKING.md | head -10
```

---

## 📊 Template de Nova Tarefa

```markdown
### [TRACK-XXX] Nome da Tarefa
- **Responsável:** [Nome]
- **Máquina:** [Ultra/UNIQ/Ambas]
- **Status:** ⏸️ Aguardando
- **Início:** DD/MM/YYYY
- **Previsão:** DD/MM/YYYY
- **Progresso:** 0%
- **Prioridade:** [🔴 CRÍTICA / 🟡 ALTA / 🟢 MÉDIA / ⚪ BAIXA]

**Descrição:**
[Descrição breve]

**Sub-tarefas:**
- [ ] Sub-tarefa 1
- [ ] Sub-tarefa 2

**Dependências:**
[TRACK-XXX ou "Nenhuma"]

**Observações:**
[Notas importantes]

**Último commit:** [hash/mensagem]
```

---

## 🎯 Exemplo Prático

### Dia 1 - Máquina UNIQ

```bash
git pull origin main
# Abrir TRACKING.md
# Atualizar TRACK-002 para "Em Progresso"
# Trabalhar no cadastro de usuários
# Marcar 2 sub-tarefas como concluídas
# Progresso: 40%

git add docs/TRACKING.md
git commit -m "Update TRACK-002: Iniciado correção de cadastro (40%)"
git push origin main
```

### Dia 2 - Máquina Ultra

```bash
git pull origin main
# Ver TRACKING.md → TRACK-002 está em progresso na UNIQ
# Escolher TRACK-004 (Storefront)
# Atualizar para "Em Progresso"
# Trabalhar no planejamento
# Progresso: 20%

git add docs/TRACKING.md
git commit -m "Update TRACK-004: Iniciado planejamento storefront (20%)"
git push origin main
```

---

## 🚀 Próximos Passos

Após usar o sistema por 1-2 semanas:
1. Avaliar pontos de melhoria
2. Considerar automação (scripts)
3. Planejar migração para UI (Março/Abril)

---

**Dúvidas?** Consulte este guia ou os próprios arquivos MD que são auto-explicativos! 📖
