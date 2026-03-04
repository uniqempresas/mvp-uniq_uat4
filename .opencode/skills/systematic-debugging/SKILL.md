---
name: systematic-debugging
description: Systematic debugging methodology, root cause analysis, and troubleshooting techniques for complex issues.
---

# Systematic Debugging

> Methodical approach to finding and fixing bugs.

---

## 1. The Debugging Process

### Phase 1: Reproduction
1. **Get a reliable reproduction** - Same steps → same bug
2. **Minimize the reproduction** - Remove unnecessary steps
3. **Document the environment** - OS, versions, config
4. **Check if it's really a bug** - Or expected behavior?

### Phase 2: Information Gathering
1. Read error messages carefully
2. Check logs (application, system, browser)
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

---

## 2. Tools

### Console/DEBUG Logging
```typescript
console.log('DEBUG: Value at this point:', value);
console.log('DEBUG: Function called with:', args);
console.trace('DEBUG: Stack trace');
```

### Debugger (VS Code)
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Program",
  "program": "${workspaceFolder}/src/index.ts"
}
```

### Browser DevTools
- Console for logs and errors
- Network tab for API calls
- Sources for breakpoints
- Performance for profiling

---

## 3. Common Bug Patterns

### Off-by-One Errors
```typescript
// ❌ WRONG
for (let i = 0; i <= array.length; i++)

// ✅ CORRECT
for (let i = 0; i < array.length; i++)
```

### Async/Await Issues
```typescript
// ❌ WRONG
const data = fetchData(); // Returns Promise

// ✅ CORRECT
const data = await fetchData();
```

### Race Conditions
```typescript
// ❌ WRONG
let counter = 0;
async function increment() {
  const current = counter;
  await delay(100);
  counter = current + 1;
}

// ✅ CORRECT
let counter = 0;
async function increment() {
  counter++; // Atomic
}
```

---

## 4. Binary Search Debugging

When you don't know where the bug is:

1. Find a working version (git bisect)
2. Find a broken version (current)
3. Test the middle commit
4. Narrow down to the exact change

```bash
# Git bisect
git bisect start
git bisect bad
git bisect good v1.0
# Test each commit
```

---

> **Remember:** Debugging is detective work. Systematic investigation beats random guessing.
