---
name: criar
description: Create new features based on specifications or requirements. Use for implementing features when the approach is clear.
---

# /criar Command

## Usage

```
/criar
[descrição da feature a ser criada]
```

## Examples

```
/criar
Criar um componente de modal reutilizável com:
- Animação de entrada/saída
- Backdrop clicável
- Suporte a diferentes tamanhos
- Acessibilidade (ARIA, foco)
```

## What It Does

This command invokes the `@vibe-implementer` agent which:

1. **Checks for existing plan** - Looks for PLAN.md or specification
2. **Implements incrementally** - Builds feature step by step:
   - Structure and files
   - Core functionality
   - Error handling
   - Edge cases
3. **Quality checks** - Runs linting and type checking
4. **Documents** - Updates relevant documentation

## Implementation Process

### Phase 1: Structure
- Create necessary files
- Set up basic skeleton
- Import dependencies

### Phase 2: Core Logic
- Implement main functionality
- Add error handling
- Handle edge cases

### Phase 3: Refinement
- Improve readability
- Add comments where needed
- Optimize if necessary

### Phase 4: Verification
- Run linting
- Check TypeScript
- Test functionality

## When to Use

- Implementing features from specifications
- Creating new components
- Adding new API endpoints
- Building utility functions
- When the "what" and "how" are clear

## Before Using

Ensure you have:
- Clear requirements or specification
- Understanding of existing patterns
- Approved approach (use `/planejar` first if unsure)

## Output

The agent will:
- Create/modify files as needed
- Run quality checks
- Report what was created
- Mark tasks as complete
- Ask for feedback or clarification if needed
