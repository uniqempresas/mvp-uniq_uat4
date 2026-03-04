---
name: orquestrar
description: Coordinate multiple specialized agents for complex tasks. Use when a task requires frontend, backend, testing, and security expertise combined.
---

# /orquestrar Command

## Usage

```
/orquestrar
[descrição da tarefa complexa]
```

## Examples

```
/orquestrar
Implement a complete user authentication system with:
- Login/logout frontend components
- Backend API endpoints
- Database schema
- Unit and integration tests
- Security audit
```

## What It Does

This command invokes the `@orchestrator` agent which:

1. **Verifies prerequisites** - Checks for existing plans (PLAN.md)
2. **Decomposes the task** - Breaks down into domain-specific subtasks
3. **Selects appropriate agents** - Chooses 2-5 specialists based on requirements
4. **Invokes agents in sequence** - Coordinates execution:
   - `@explorer-agent` - Maps affected areas first
   - Domain specialists - Analyze/implement
   - `@test-engineer` - Verify changes
   - `@security-auditor` - Security check
5. **Synthesizes results** - Combines findings into unified report

## Available Specialists

| Agent | Domain |
|-------|--------|
| `@frontend-specialist` | React, Next.js, UI/UX |
| `@backend-specialist` | Node.js, APIs, databases |
| `@database-architect` | Schema, migrations, SQL |
| `@mobile-developer` | React Native, mobile |
| `@devops-engineer` | CI/CD, Docker, deploy |
| `@security-auditor` | Security, auth, OWASP |
| `@test-engineer` | Testing, QA, coverage |
| `@debugger` | Debugging, root cause |
| `@performance-optimizer` | Profiling, optimization |
| `@seo-specialist` | SEO, meta tags |

## When to Use

- Complex features spanning multiple domains
- Tasks requiring security + functionality
- Major refactors affecting multiple layers
- Performance optimization across stack
- Security audits before release

## Output

The agent provides:
- Orchestration report with all agents invoked
- Key findings from each specialist
- Recommendations with priorities
- Next steps and action items

## Important

- Requires clear task description
- May ask clarifying questions before starting
- Respects agent boundaries (frontend doesn't write tests, etc.)
- Always includes test verification for code changes
