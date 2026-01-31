# 📂 Pasta de Tracking - UNIQ Empresas

**Última atualização:** 31/01/2026

---

## 🎯 Propósito desta Pasta

Esta pasta contém **todos os arquivos de tracking e coordenação** do desenvolvimento do UNIQ Empresas.

**Use esta pasta como ponto de partida** ao iniciar trabalho em qualquer máquina (Ultra ou UNIQ) para:
- ✅ Ver status atual de todas as tarefas
- ✅ Sincronizar contexto do projeto
- ✅ Planejar próximos passos
- ✅ Consultar histórico de mudanças

---

## 📁 Arquivos desta Pasta

### 1. 📊 [TRACKING.md](./TRACKING.md)
**Propósito:** Status detalhado de todas as tarefas  
**Atualização:** Diária  
**Quando usar:** Sempre que iniciar/pausar trabalho

**Contém:**
- Status de todas as tarefas (Em Progresso, Aguardando, Concluído, Bloqueado)
- IDs únicos (TRACK-XXX)
- Progresso de cada tarefa
- Sub-tarefas detalhadas
- Observações e dependências

**📌 Comece sempre por aqui!**

---

### 2. 📝 [CHANGELOG.md](./CHANGELOG.md)
**Propósito:** Histórico de entregas  
**Atualização:** Por release  
**Quando usar:** Ao concluir tarefas ou lançar versões

**Contém:**
- Mudanças por versão
- Features adicionadas
- Bugs corrigidos
- Alterações em funcionalidades

---

### 3. 📖 [TRACKING_GUIDE.md](./TRACKING_GUIDE.md)
**Propósito:** Guia completo de uso do sistema de tracking  
**Atualização:** Quando necessário  
**Quando usar:** Para consultar workflows e boas práticas

**Contém:**
- Como usar cada arquivo
- Workflows de sincronização
- Templates de tarefas
- Exemplos práticos
- Regras e boas práticas

---

### 4. 🧠 [CONTEXTO_PROJETO.md](./CONTEXTO_PROJETO.md)
**Propósito:** Contexto consolidado do projeto UNIQ  
**Atualização:** Quando necessário  
**Quando usar:** Onboarding ou sincronização entre máquinas

**Contém:**
- Visão estratégica do produto
- Público-alvo e proposta de valor
- Arquitetura de módulos
- Stack tecnológico
- Roadmap e timeline
- Métricas de sucesso

---

## 🔄 Workflow Recomendado

### Ao Iniciar Trabalho (Qualquer Máquina)

```bash
# 1. Sincronizar com GitHub
git pull origin main

# 2. Abrir pasta de tracking
cd docs/tracking

# 3. Consultar TRACKING.md
# Ver tarefas disponíveis e status atual

# 4. Escolher tarefa e começar trabalho
# Atualizar TRACKING.md com progresso

# 5. Ao final do dia
git add docs/tracking/TRACKING.md
git commit -m "Update TRACK-XXX: descrição"
git push origin main
```

---

### Na Máquina Ultra (Sem MCP)

```bash
# 1. Pull primeiro
git pull origin main

# 2. Ler contexto
cat docs/tracking/CONTEXTO_PROJETO.md
cat docs/tracking/TRACKING.md

# 3. Ver tarefas disponíveis
# Escolher tarefa que não está em progresso na UNIQ

# 4. Se precisar gerar SQL
# Criar em docs/migrations/ ou supabase/migrations/

# 5. Atualizar tracking e push
git push origin main
```

---

## 📊 Estrutura Completa

```
docs/
├── tracking/
│   ├── README.md              (Este arquivo - índice da pasta)
│   ├── TRACKING.md            (Status de tarefas - COMECE AQUI)
│   ├── CHANGELOG.md           (Histórico de entregas)
│   ├── TRACKING_GUIDE.md      (Guia de uso)
│   └── CONTEXTO_PROJETO.md    (Contexto do projeto)
│
├── ROADMAP.md                 (Visão estratégica mensal)
├── PRD.md                     (Product Requirements)
├── database_schema.md         (Esquema do banco)
├── n8n_integration.md         (Integração n8n)
└── ...outros documentos técnicos
```

---

## 🎯 Ordem de Consulta Recomendada

### Primeira Vez / Onboarding
1. **CONTEXTO_PROJETO.md** - Entender o projeto
2. **TRACKING_GUIDE.md** - Aprender o sistema
3. **TRACKING.md** - Ver tarefas atuais

### Trabalho Diário
1. **TRACKING.md** - Ver status e escolher tarefa
2. *(Trabalhar...)*
3. **TRACKING.md** - Atualizar progresso
4. **CHANGELOG.md** - Adicionar entrega (se concluiu tarefa)

---

## 🚀 Dicas Rápidas

### ✅ Fazer
- ✅ Sempre dar `git pull` antes de começar
- ✅ Consultar TRACKING.md ao iniciar o dia
- ✅ Atualizar progresso ao final do dia
- ✅ Fazer commits pequenos e frequentes

### ❌ Evitar
- ❌ Trabalhar na mesma tarefa em duas máquinas
- ❌ Esquecer de fazer `git push`
- ❌ Deixar tracking desatualizado por dias

---

## 📞 Precisa de Ajuda?

Consulte o **[TRACKING_GUIDE.md](./TRACKING_GUIDE.md)** para guia detalhado!

---

**Esta pasta é sua fonte única de verdade para coordenação de desenvolvimento! 🎯**
