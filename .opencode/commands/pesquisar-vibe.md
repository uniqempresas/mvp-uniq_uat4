---
name: pesquisar-vibe
description: Research the codebase to answer questions or gather context by orchestrating multiple specialized agents. Performs comprehensive analysis and generates research documents.
---

# /pesquisar-vibe Command

## Usage

```
/pesquisar-vibe [pergunta ou tópico de pesquisa]
```

## Examples

```
/pesquisar-vibe "Como funciona o sistema de autenticação?"
/pesquisar-vibe "Quais são os principais componentes do frontend?"
/pesquisar-vibe "Explique a arquitetura de banco de dados"
/pesquisar-vibe "Como é feita a integração com a API externa?"
```

## What It Does

This command invokes the `@vibe-researcher` agent which:

1. **Reads mentioned files first** - If you reference specific files, they are read completely before analysis
2. **Spawns parallel sub-agents** - Multiple specialized agents work simultaneously:
   - `@explorer-agent` - Maps codebase structure and finds files
   - `@code-archaeologist` - Analyzes how code works (without critiquing)
   - `@test-engineer` - Finds usage patterns in tests
   - `@documentation-writer` - Discovers existing documentation
3. **Synthesizes findings** - Combines all research into a coherent report
4. **Generates research document** - Creates a detailed markdown file in `tracking/research/`

## Output

The agent will:
- Ask for your research question (if not provided)
- Conduct parallel investigation
- Present a summary of findings
- Create a detailed research document with:
  - Research question
  - Summary
  - Detailed findings by component
  - Code references with line numbers
  - Architecture documentation
  - Historical context

## When to Use

- Understanding a new codebase
- Investigating how a feature works
- Finding all usages of a pattern
- Documenting existing systems
- Preparing for refactoring
- Onboarding new team members

## Notes

- Research is read-only - no code changes
- Focuses on documenting what exists, not suggesting improvements
- Creates permanent research documents for future reference
- All file references include line numbers for easy navigation
