---
name: planejar
description: Create comprehensive plans and specifications for features. Use before implementing new features or when requirements are vague.
---

# /planejar Command

## Usage

```
/planejar
[descrição da feature ou problema a ser resolvido]
```

## Examples

```
/planejar
Criar um sistema de notificações em tempo real com:
- WebSocket para atualizações instantâneas
- Persistência no banco de dados
- UI de configuração de preferências
- Suporte a múltiplos canais (email, push, in-app)
```

## What It Does

This command invokes the `@vibe-planner` agent which:

1. **Explores existing codebase** - Uses `@explorer-agent` to understand current structure
2. **Analyzes requirements** - Breaks down your description into clear requirements
3. **Asks clarifying questions** - If anything is unclear (scope, priority, tech preferences)
4. **Researches patterns** - Looks for existing implementations of similar features
5. **Creates specification** - Generates a detailed PLAN.md with:
   - Problem statement
   - User stories
   - Acceptance criteria
   - Technical approach
   - Task breakdown
   - Timeline

## Output Format

Creates `tracking/plans/YYYY-MM-DD-feature-name.md`:

```markdown
# Feature: [Name]

## Problem Statement
[What problem we're solving]

## User Stories
- As a [user], I want [goal], so that [benefit]

## Acceptance Criteria
1. [Specific, testable criteria]

## Technical Approach
[Architecture and implementation details]

## Tasks
- [ ] Task 1
- [ ] Task 2

## Timeline
- Design: [Date]
- Development: [Date range]
- Testing: [Date range]
```

## When to Use

- Before implementing new features
- When requirements are vague
- For complex tasks needing breakdown
- To align team on approach
- To create technical specifications

## Integration

After planning is complete:
- Use `@vibe-implementer` to execute the plan
- Use `/orquestrar` for complex multi-domain implementation
- Plan can be referenced by `@orchestrator` for coordinated work
