---
name: plan-writing
description: Technical planning, task breakdown, and specification writing for software projects.
---

# Plan Writing

> Creating clear, actionable technical plans and specifications.

---

## 1. Plan Structure

```markdown
# Feature: [Name]

## Problem Statement
[What problem we're solving]

## Goals
- Goal 1
- Goal 2

## Requirements
### Functional
- Requirement 1
- Requirement 2

### Non-Functional
- Performance target
- Security requirements

## Technical Approach
[How we'll implement]

## Tasks
- [ ] Task 1
- [ ] Task 2

## Timeline
- Design: [Date]
- Development: [Date range]
- Testing: [Date range]
- Deployment: [Date]

## Risks
- Risk 1 and mitigation
```

---

## 2. Task Breakdown

### Good Task Examples
```
✅ "Create User model with email validation"
✅ "Implement POST /api/users endpoint"
✅ "Add unit tests for user registration"
```

### Bad Task Examples
```
❌ "Build user system"
❌ "Make it work"
❌ "Fix bugs"
```

---

## 3. Acceptance Criteria

```
Given [context]
When [action]
Then [expected result]
```

Example:
```
Given a user is on the registration page
When they submit valid email and password
Then they receive confirmation email
And they are redirected to dashboard
```

---

## 4. Best Practices

- ✅ Clear and specific
- ✅ Measurable outcomes
- ✅ Realistic timelines
- ✅ Dependencies identified
- ✅ Risks considered

---

> **Remember:** A good plan prevents miscommunication and sets clear expectations.
