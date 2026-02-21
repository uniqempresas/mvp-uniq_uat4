# OpenCode Agent System - Guia de Uso

Sistema completo de agentes especializados e skills migrado do Antigravity Kit para o OpenCode.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Instalação e Configuração](#instalação-e-configuração)
3. [Agentes Disponíveis](#agentes-disponíveis)
4. [Skills Disponíveis](#skills-disponíveis)
5. [Comandos Slash](#comandos-slash)
6. [Como Usar](#como-usar)
7. [Gerenciamento](#gerenciamento)
8. [Exemplos Práticos](#exemplos-práticos)

---

## 🎯 Visão Geral

Este sistema fornece **22 agentes especializados** e **40+ skills** para auxiliar no desenvolvimento de software através do OpenCode. Cada agente possui expertise específica em diferentes áreas do desenvolvimento.

### Estrutura

```
~/.config/opencode/
├── agents/          # 22 agentes especializados
├── skills/          # 40+ skills técnicos
├── commands/        # 12 comandos slash
└── opencode.json    # Configuração global
```

---

## ⚙️ Instalação e Configuração

### Pré-requisitos

- OpenCode instalado e configurado
- Acesso ao diretório `~/.config/opencode/`

### Verificação da Instalação

```bash
# Verificar se os agentes estão disponíveis
opencode agent list

# Verificar skills
ls ~/.config/opencode/skills/

# Verificar comandos
ls ~/.config/opencode/commands/
```

### Configuração Global

O arquivo `~/.config/opencode/opencode.json` contém:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "system",
  "model": "anthropic/claude-sonnet-4",
  "skills": {
    "autoLoad": true
  },
  "agent": {
    "default": "orchestrator"
  }
}
```

---

## 🤖 Agentes Disponíveis

### Agentes Principais

| Agente | Descrição | Quando Usar |
|--------|-----------|-------------|
| `vibe-researcher` | Pesquisa comprehensiva no codebase | Entender código existente |
| `vibe-planner` | Criação de planos e especificações | Antes de implementar features |
| `vibe-implementer` | Implementação de código | Quando o plano está claro |
| `orchestrator` | Coordenação multi-agente | Tarefas complexas multi-domínio |

### Agentes Especialistas

| Agente | Domínio | Uso |
|--------|---------|-----|
| `frontend-specialist` | React/Next.js/UI | Componentes, layouts, estilos |
| `backend-specialist` | Node.js/APIs | APIs, lógica de negócio |
| `database-architect` | Banco de dados | Schema, migrações, queries |
| `mobile-developer` | Mobile apps | React Native, Flutter |
| `game-developer` | Desenvolvimento de jogos | Lógica de jogos |
| `devops-engineer` | CI/CD/Docker | Pipelines, deploy |
| `security-auditor` | Segurança | Auditorias, OWASP |
| `penetration-tester` | Testes de penetração | Red team |
| `test-engineer` | Testes | Unitários, integração |
| `debugger` | Debug | Análise de problemas |
| `performance-optimizer` | Performance | Otimização, profiling |
| `seo-specialist` | SEO | Metatags, rankings |
| `documentation-writer` | Documentação | READMEs, guias |
| `product-manager` | Produto | User stories, backlog |
| `product-owner` | Backlog | Priorização, MVP |
| `qa-automation-engineer` | Automação de QA | E2E, pipelines |
| `code-archaeologist` | Código legado | Refactoring, análise |
| `explorer-agent` | Descoberta | Mapear codebase |

---

## 🧩 Skills Disponíveis

### Frontend
- `react-patterns` - Padrões React modernos
- `nextjs-best-practices` - Next.js App Router
- `tailwind-patterns` - Tailwind CSS
- `frontend-design` - Design thinking para UI

### Backend
- `nodejs-best-practices` - Node.js
- `python-patterns` - Python/FastAPI
- `api-patterns` - REST/GraphQL/tRPC
- `nestjs-expert` - NestJS

### Banco de Dados
- `database-design` - Design de schema
- `prisma-expert` - Prisma ORM

### TypeScript
- `typescript-expert` - TypeScript avançado

### DevOps
- `docker-expert` - Containerização
- `deployment-procedures` - Deploy
- `server-management` - Servidores

### Qualidade
- `clean-code` - Código limpo
- `testing-patterns` - Testes
- `webapp-testing` - E2E com Playwright
- `tdd-workflow` - TDD
- `code-review-checklist` - Code review
- `lint-and-validate` - Linting

### Segurança
- `vulnerability-scanner` - Scan de vulnerabilidades
- `red-team-tactics` - Ofensiva
- `systematic-debugging` - Debug sistemático

### Arquitetura
- `architecture` - Padrões arquiteturais
- `app-builder` - Scaffolding
- `plan-writing` - Especificações
- `brainstorming` - Ideação

### Outros
- `mobile-design` - Design mobile
- `game-development` - Jogos
- `seo-fundamentals` - SEO
- `geo-fundamentals` - Generative AI optimization
- `bash-linux` - Linux/Shell
- `powershell-windows` - PowerShell
- `behavioral-modes` - Modos de interação
- `parallel-agents` - Coordenação paralela
- `mcp-builder` - MCP servers
- `documentation-templates` - Templates docs
- `i18n-localization` - Internacionalização
- `performance-profiling` - Performance

---

## ⌨️ Comandos Slash

### Comandos Principais

```
/pesquisar-vibe [pergunta]     # Pesquisa no codebase
/orquestrar [tarefa]           # Coordena múltiplos agentes
/planejar [feature]            # Cria especificação
/criar [feature]               # Implementa código
/debugar [problema]            # Debuga issues
/testar [contexto]             # Testes e cobertura
```

### Comandos Adicionais

```
/brainstorm [tópico]           # Sessão de brainstorming
/deploy [ambiente]             # Deploy para produção
/enhance [melhoria]            # Melhora código existente
/preview [feature]             # Preview de UI
/status                        # Health check do projeto
/ui-ux-pro-max [design]        # Design premium
```

---

## 🚀 Como Usar

### 1. Usar um Agente Diretamente

```bash
# Invoque um agente específico
/agent @vibe-researcher
Como funciona o sistema de autenticação?

# Ou use o comando correspondente
/pesquisar-vibe Como funciona o sistema de autenticação?
```

### 2. Usar Comando Slash

```bash
# Pesquisar no codebase
/pesquisar-vibe "Quais são os principais componentes?"

# Orquestrar múltiplos agentes
/orquestrar
Implementar sistema de autenticação completo:
- Frontend: formulários React
- Backend: API Node.js
- Banco: schema PostgreSQL
- Testes: unitários e E2E

# Criar plano
/planejar
Sistema de notificações em tempo real

# Debugar
/debugar
Erro 500 ao criar usuário
```

### 3. Carregar Skills

```bash
# Carregar skill específico
/skill react-patterns

# Carregar múltiplos
/skill clean-code
/skill typescript-expert
```

### 4. Orquestração Multi-Agente

```bash
/orquestrar
Implementar feature de pagamentos:
1. Frontend (@frontend-specialist): Formulário de pagamento
2. Backend (@backend-specialist): Processamento de pagamentos
3. Testes (@test-engineer): Cobertura de testes
4. Segurança (@security-auditor): Revisão de segurança
```

---

## 🛠️ Gerenciamento

### Gerenciar Agentes

```bash
# Listar todos
opencode agent list

# Editar agente
# Edite diretamente: ~/.config/opencode/agents/[nome].md

# Criar novo agente
opencode agent create

# Excluir agente
rm ~/.config/opencode/agents/[nome].md
```

### Gerenciar Skills

```bash
# Listar todos
ls ~/.config/opencode/skills/

# Editar skill
# Edite diretamente: ~/.config/opencode/skills/[nome]/SKILL.md

# Criar nova skill
mkdir ~/.config/opencode/skills/minha-skill
touch ~/.config/opencode/skills/minha-skill/SKILL.md

# Excluir skill
rm -rf ~/.config/opencode/skills/[nome]
```

### Gerenciar Comandos

```bash
# Listar todos
ls ~/.config/opencode/commands/

# Editar comando
# Edite diretamente: ~/.config/opencode/commands/[nome].md

# Criar novo comando
touch ~/.config/opencode/commands/meu-comando.md

# Excluir comando
rm ~/.config/opencode/commands/[nome].md
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Entender um Código Legado

```bash
/pesquisar-vibe "Explique a arquitetura de autenticação atual"
```

O agente vai:
1. Mapear arquivos relacionados
2. Analisar fluxo de autenticação
3. Documentar dependências
4. Criar relatório em `tracking/research/`

### Exemplo 2: Implementar Nova Feature

```bash
/planejar
Sistema de notificações em tempo real com:
- WebSocket para atualizações
- Persistência no PostgreSQL
- UI React para configurações
- Testes E2E

# Depois que o plano estiver pronto:
/orquestrar
Implementar sistema de notificações conforme plano
```

### Exemplo 3: Refatorar Código

```bash
/enhance
Refatorar o componente UserProfile:
- Extrair lógica para custom hooks
- Melhorar performance com memoização
- Adicionar tratamento de erros
- Melhorar acessibilidade
```

### Exemplo 4: Debugar Problema

```bash
/debugar
Erro "Cannot read property of undefined" ao carregar dashboard
```

### Exemplo 5: Auditoria de Segurança

```bash
/orquestrar
Realizar auditoria de segurança completa:
1. @security-auditor: Revisar autenticação e autorização
2. @code-archaeologist: Analisar código legado
3. @test-engineer: Verificar testes de segurança
4. Synthesis: Relatório consolidado
```

---

## 🔍 Resolução de Problemas

### Agentes Não Encontrados

Se o OpenCode não encontrar os agentes:

1. Verifique se estão no diretório correto:
   ```bash
   ls ~/.config/opencode/agents/
   ```

2. Reinicie o OpenCode

3. Verifique a configuração:
   ```bash
   cat ~/.config/opencode/opencode.json
   ```

### Skills Não Carregam

Se as skills não estiverem disponíveis:

1. Verifique a estrutura:
   ```bash
   ls ~/.config/opencode/skills/[skill-name]/
   # Deve conter: SKILL.md
   ```

2. Use o comando manual:
   ```bash
   /skill nome-da-skill
   ```

### Comandos Não Funcionam

1. Verifique se o arquivo existe:
   ```bash
   ls ~/.config/opencode/commands/
   ```

2. Verifique a sintaxe do frontmatter no arquivo

---

## 📚 Referências

- [OpenCode Documentation](https://opencode.ai/docs)
- [Agent System Architecture](ARCHITECTURE.md)
- [Skills Documentation](../.agent/ARCHITECTURE.md)

---

## 🤝 Contribuição

Para adicionar novos agentes ou skills:

1. Crie o arquivo no diretório apropriado
2. Siga o formato YAML frontmatter
3. Teste antes de usar
4. Documente no guia

---

## 📝 Notas

- Os agentes estão configurados globalmente em `~/.config/opencode/`
- Skills são carregadas automaticamente se `autoLoad: true`
- Comandos slash funcionam em qualquer projeto
- Documentação gerada em: `tracking/research/` e `tracking/plans/`

---

**Versão**: 1.0  
**Última atualização**: 2025-02-17  
**Sistema**: Antigravity Kit para OpenCode
