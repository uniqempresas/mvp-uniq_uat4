---
name: architecture
description: System design patterns, architectural decisions, and software architecture best practices.
---

# Architecture

> System design patterns and architectural best practices.

---

## 1. Architectural Patterns

### Layered Architecture
```
┌─────────────┐
│ Presentation│
├─────────────┤
│   Business  │
├─────────────┤
│    Data     │
└─────────────┘
```

### Microservices
- Independent deployable services
- Service boundaries by business capability
- Inter-service communication

### Event-Driven
- Events as communication
- Loose coupling
- Async processing

---

## 2. Design Principles

### SOLID
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

### Other Principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- YAGNI (You Ain't Gonna Need It)

---

## 3. Decision Framework

### When to Choose

| Pattern | Use When |
|---------|----------|
| Monolith | Small team, simple domain |
| Microservices | Large team, complex domain |
| Serverless | Variable load, event-driven |
| Event-Driven | Async processing needed |

---

## 4. Best Practices

- ✅ Start simple, evolve as needed
- ✅ Define clear boundaries
- ✅ Consider trade-offs
- ✅ Document decisions
- ✅ Review periodically

---

> **Remember:** Architecture is about trade-offs. There's no one-size-fits-all.
