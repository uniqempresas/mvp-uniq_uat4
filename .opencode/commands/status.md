---
name: status
description: Check project status, code health, test coverage, and overall project metrics.
---

# /status Command

## Usage

```
/status
```

## What It Does

This command invokes the `@explorer-agent` to analyze the project and provide:

1. **Code Health**
   - Linting status
   - Type checking results
   - Security vulnerabilities
   - Dependency status

2. **Test Status**
   - Test suite results
   - Coverage percentage
   - Failing tests
   - Test duration

3. **Git Status**
   - Branch information
   - Uncommitted changes
   - Recent commits
   - Merge conflicts

4. **Project Metrics**
   - Lines of code
   - File count
   - Dependency count
   - Build status

## Health Indicators

🟢 **Healthy**: All checks passing
🟡 **Warning**: Minor issues detected
🔴 **Critical**: Problems requiring attention

## When to Use

- Daily standups
- Before commits
- Pre-deployment checks
- Health monitoring
- Team updates

## Output

The agent will:
- Run all checks
- Display status dashboard
- Highlight issues
- Provide recommendations
- Suggest next steps
