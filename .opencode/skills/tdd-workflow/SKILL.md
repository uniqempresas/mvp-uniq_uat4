---
name: tdd-workflow
description: Test-Driven Development workflow, red-green-refactor cycle, and TDD best practices.
---

# TDD Workflow

> Test-Driven Development: Red, Green, Refactor.

---

## 1. The TDD Cycle

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│  RED    │ →  │ GREEN   │ →  │ REFACTOR│
│Write    │    │Write    │    │Improve  │
│failing  │    │minimal  │    │code     │
│test     │    │code     │    │         │
└────┬────┘    └────┬────┘    └────┬────┘
     ↑              │              │
     └──────────────┴──────────────┘
              Repeat cycle
```

---

## 2. The Three Laws of TDD

1. **Don't write production code until you have a failing test**
2. **Don't write more of a test than is sufficient to fail**
3. **Don't write more production code than is sufficient to pass**

---

## 3. Example

### Step 1: Write Failing Test (RED)
```typescript
describe('calculateTotal', () => {
  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
// Error: calculateTotal is not defined
```

### Step 2: Write Minimal Code (GREEN)
```typescript
function calculateTotal(items: number[]): number {
  return 0;
}
```

### Step 3: Add More Tests
```typescript
describe('calculateTotal', () => {
  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
  
  it('should sum items', () => {
    expect(calculateTotal([10, 20, 30])).toBe(60);
  });
});
```

### Step 4: Update Code
```typescript
function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}
```

### Step 5: Refactor
```typescript
// Make it more robust
function calculateTotal(items: number[]): number {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }
  return items.reduce((sum, item) => {
    if (typeof item !== 'number') {
      throw new Error('All items must be numbers');
    }
    return sum + item;
  }, 0);
}
```

---

## 4. Benefits

- ✅ Better design
- ✅ Confidence to refactor
- ✅ Living documentation
- ✅ Fewer bugs
- ✅ Faster debugging

---

## 5. When to Use

- ✅ New features
- ✅ Bug fixes (write test first)
- ✅ Refactoring
- ✅ Algorithm development

### When NOT to Use
- ❌ Spikes/prototypes
- ❌ UI exploration
- ❌ Learning new technology

---

> **Remember:** TDD is not about testing, it's about design. Tests are a side effect.
