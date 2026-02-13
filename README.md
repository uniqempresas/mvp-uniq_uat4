# UNIQ Template - Metodologia de Desenvolvimento

Este template consolida a metodologia de desenvolvimento da UNIQ Empresas, integrando agentes especializados, Vibe Coding e um sistema de tracking padronizado.

## 📁 Estrutura

```
.
├── .agent/                          # Infraestrutura de Agentes (Cérebro do Projeto)
│   ├── agents/                      # Agentes especializados e Vibe Agents
│   ├── skills/                      # Habilidades compartilhadas
│   ├── scripts/                     # Scripts de automação e verificação
│   └── workflows/                   # Fluxos de trabalho (/research, /spec, /implement)
├── tracking/                        # Metodologia de Gestão Ágil Simplificada
│   ├── TRACKING.md                  # Dashboard da Sprint Atual
│   ├── TRACKING_Backlog.md          # Backlog Geral do Produto
│   └── TRACKING_GUIDE.md            # Guia de como usar o tracking
├── METODOLOGIA_VIBE_CODING.md       # Referência da metodologia SDD (Spec Driven Development)
└── README.md                        # Este arquivo
```

## 🚀 Como Usar em Novos Projetos

1.  **Copie o conteúdo** desta pasta para a raiz do seu novo projeto.
2.  **Inicialize o Tracking**:
    - Edite `tracking/TRACKING.md` com o nome do projeto.
    - Comece a popular `tracking/TRACKING_Backlog.md`.
3.  **Active os Agentes**:
    - Certifique-se de que sua ferramenta de AI (ex: Cline, Aider, etc.) está configurada para ler a pasta `.agent`.

## 🤖 Vibe Coding Workflow

A metodologia Vibe Coding divide o desenvolvimento em 3 fases para maximizar o contexto e qualidade:

### 1. Pesquisa (`/research`)
Use o chatbot para invocar o agente de pesquisa:
> "Quero fazer a feature X. /research"

Isso gerará relatórios de contexto sem alucinar código.

### 2. Especificação (`/spec`)
Com base na pesquisa, crie um plano técnico:
> "Com base no research, /spec a feature X"

O agente criará um Implementation Plan detalhado em `thoughts/shared/plans/`.

### 3. Implementação (`/implement`)
Execute o plano de forma focada:
> "/implement o plano X"

O agente escreverá o código e testará conforme os critérios definidos.

## 🛠 Manutenção

- **Adicionar Novos Agentes**: Crie novos arquivos `.md` em `.agent/agents/`.
- **Scripts Globais**: Adicione scripts úteis em `.agent/scripts/`.
