---
name: testar
description: Run tests, analyze coverage, and improve test quality. Use for testing strategies, writing tests, and ensuring code quality.
---

# /testar Command

## Usage

```
/testar
[contexto ou especificação do que testar]
```

## Examples

```
/testar
Criar testes unitários para o componente UserProfile
```

```
/testar
Rodar todos os testes e verificar cobertura
```

```
/testar
Adicionar testes E2E para o fluxo de checkout
```

## What It Does

This command invokes the `@test-engineer` agent which:

1. **Analyzes test requirements** - Determines what type of tests are needed
2. **Checks existing tests** - Reviews current test coverage
3. **Writes tests** - Creates unit, integration, or E2E tests
4. **Runs tests** - Executes test suites
5. **Reports results** - Shows coverage and failures

## Testing Levels

### Unit Tests
- Test individual functions/components
- Mock dependencies
- Fast and isolated

### Integration Tests
- Test component interactions
- May use real database/test database
- Verify data flow

### E2E Tests
- Test complete user flows
- Use Playwright/Cypress
- Simulate real user actions

## When to Use

- Creating tests for new features
- Improving test coverage
- Debugging test failures
- Setting up testing infrastructure
- Refactoring with confidence

## Output

The agent will:
- Create or modify test files
- Run tests and report results
- Show coverage metrics
- Suggest improvements
- Ensure tests are reliable (not flaky)

## Best Practices Applied

- AAA pattern (Arrange-Act-Assert)
- One concept per test
- Descriptive test names
- Proper mocking
- Edge case coverage
