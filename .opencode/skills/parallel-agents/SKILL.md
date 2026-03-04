---
name: parallel-agents
description: Multi-agent coordination, parallel task execution, and agent orchestration patterns.
---

# Parallel Agents

> Coordinating multiple agents for parallel execution.

---

## 1. When to Use Parallel Agents

### Appropriate Use Cases
- Independent subtasks
- Multiple domain expertise needed
- Time-sensitive tasks
- Comprehensive analysis

### Example
```
Research Task:
├─ Agent A: Explore codebase structure
├─ Agent B: Analyze security
├─ Agent C: Review performance
└─ Synthesize findings
```

---

## 2. Coordination Patterns

### Fan-Out
```
Main Agent
    ├─ Task A → Agent 1
    ├─ Task B → Agent 2
    └─ Task C → Agent 3
```

### Fan-In
```
Agent 1 ─┐
Agent 2 ─┼→ Synthesis → Result
Agent 3 ─┘
```

### Pipeline
```
Agent 1 → Agent 2 → Agent 3 → Result
```

---

## 3. Best Practices

- ✅ Clear task definitions
- ✅ Independent subtasks
- ✅ Synthesis of results
- ✅ Error handling
- ✅ Resource management

---

> **Remember:** Parallel execution saves time but requires careful coordination.
