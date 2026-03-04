---
name: debugar
description: Debug issues and perform root cause analysis. Use for troubleshooting bugs, understanding failures, and systematic problem solving.
---

# /debugar Command

## Usage

```
/debugar
[descrição do problema ou erro]
```

## Examples

```
/debugar
O usuário não consegue fazer login. O botão não responde e não aparece erro no console.
```

```
/debugar
API retornando 500 ao tentar criar pedido. Mensagem: "Internal Server Error"
```

## What It Does

This command invokes the `@debugger` agent which follows a systematic debugging process:

### Phase 1: Reproduction
1. Get a reliable reproduction (same steps → same bug)
2. Minimize the reproduction
3. Document the environment
4. Check if it's really a bug

### Phase 2: Information Gathering
1. Read error messages carefully
2. Check logs (app, system, browser)
3. Inspect state at failure point
4. Review recent changes

### Phase 3: Hypothesis Formation
1. Generate possible causes
2. Prioritize by likelihood
3. Identify tests to verify

### Phase 4: Testing Hypotheses
1. Test one hypothesis at a time
2. Log intermediate values
3. Use debugger breakpoints
4. Add temporary logging

### Phase 5: Fix and Verify
1. Implement minimal fix
2. Verify with reproduction
3. Check for regressions
4. Add regression test

## When to Use

- Bugs that are hard to reproduce
- Issues with unclear causes
- Performance problems
- Mysterious failures
- Logic errors

## Information to Provide

Helpful details:
- Error messages (exact text)
- Steps to reproduce
- Environment (OS, browser, versions)
- Recent changes
- What you've already tried

## Output

The agent will:
- Ask clarifying questions if needed
- Investigate systematically
- Identify root cause
- Propose fix
- Verify solution
- Suggest regression test
