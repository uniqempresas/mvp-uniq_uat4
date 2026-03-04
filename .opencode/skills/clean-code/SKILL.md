---
name: clean-code
description: Clean code principles and coding standards. Use for writing readable, maintainable, and professional code. Triggers on refactoring, code quality, naming, functions.
---

# Clean Code Principles

> **Code is read more than it's written.** Write code for humans first, computers second.

---

## 1. Naming Conventions

### Variables

| Type | Convention | Example |
|------|------------|---------|
| **Variables** | camelCase | `userName`, `totalPrice` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| **Classes/Types** | PascalCase | `UserService`, `ProductType` |
| **Functions** | camelCase + verb | `getUser()`, `calculateTotal()` |
| **Booleans** | is/has/can prefix | `isActive`, `hasPermission` |
| **Arrays** | Plural nouns | `users`, `products` |

### Good Naming

```typescript
// ❌ BAD: Unclear names
const d = new Date();
const x = 10;
function calc(a, b) { return a + b; }

// ✅ GOOD: Clear, descriptive names
const currentDate = new Date();
const maxRetries = 10;
function calculateTotalPrice(basePrice: number, tax: number): number {
  return basePrice + tax;
}
```

---

## 2. Functions

### The Single Responsibility Principle

```typescript
// ❌ BAD: Does too many things
function processUser(user) {
  validateUser(user);
  saveToDatabase(user);
  sendWelcomeEmail(user);
  logActivity(user);
}

// ✅ GOOD: One responsibility each
function validateUser(user: User): ValidationResult {
  // Validation logic only
}

function saveUser(user: User): Promise<User> {
  // Database logic only
}

function notifyUser(user: User): void {
  // Notification logic only
}
```

### Function Size

- **Aim for**: 4-20 lines
- **Maximum**: 50 lines (if more, refactor)
- **Parameters**: 0-2 ideal, 3+ consider object

### Early Returns

```typescript
// ❌ BAD: Deep nesting
function processOrder(order) {
  if (order.isValid) {
    if (order.hasItems) {
      if (order.paymentConfirmed) {
        // Process order
      }
    }
  }
}

// ✅ GOOD: Early returns
function processOrder(order: Order): Result {
  if (!order.isValid) return { error: 'Invalid order' };
  if (!order.hasItems) return { error: 'Empty order' };
  if (!order.paymentConfirmed) return { error: 'Payment pending' };
  
  // Process order
  return { success: true };
}
```

---

## 3. Comments

### When to Comment

```typescript
// ✅ GOOD: Explains WHY, not WHAT
// We use setTimeout to ensure DOM is fully rendered
setTimeout(initChart, 0);

// ✅ GOOD: Documents complex business logic
// Tax calculation follows IRS Publication 17, Section 3
function calculateTax(income: number): number {
  // Implementation
}

// ❌ BAD: States the obvious
// Increment counter by 1
counter++;

// ❌ BAD: Outdated comment
// This function returns user name (actually returns full profile)
function getUser() { }
```

### Self-Documenting Code

```typescript
// ❌ BAD: Needs comment to explain
// Check if user can access admin
if (u.r === 'admin' && u.a && u.v) { }

// ✅ GOOD: Self-explanatory
if (user.role === 'admin' && user.isActive && user.isVerified) { }
```

---

## 4. Error Handling

### Use Exceptions, Not Return Codes

```typescript
// ❌ BAD: Return codes
function divide(a: number, b: number): number | null {
  if (b === 0) return null; // Caller must check
  return a / b;
}

// ✅ GOOD: Exceptions
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// Even better: Custom error types
class DivisionByZeroError extends Error {
  constructor() {
    super('Cannot divide by zero');
    this.name = 'DivisionByZeroError';
  }
}
```

### Don't Ignore Exceptions

```typescript
// ❌ BAD: Empty catch
try {
  riskyOperation();
} catch (e) {
  // TODO: handle error (but never does)
}

// ✅ GOOD: Handle or propagate
try {
  riskyOperation();
} catch (error) {
  logger.error('Operation failed', error);
  throw new OperationFailedError('Unable to complete operation', { cause: error });
}
```

---

## 5. Code Organization

### Vertical Formatting

```typescript
// Group related concepts
class Order {
  // Properties
  private items: Item[];
  private total: number;
  
  // Constructor
  constructor(items: Item[]) {
    this.items = items;
    this.total = this.calculateTotal();
  }
  
  // Public methods
  public addItem(item: Item): void { }
  public removeItem(itemId: string): void { }
  
  // Private methods
  private calculateTotal(): number { }
  private validateItem(item: Item): boolean { }
}
```

### Import Organization

```typescript
// 1. External libraries
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal absolute imports
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

// 3. Internal relative imports
import { utils } from './utils';
import { styles } from './styles.module.css';
```

---

## 6. DRY Principle (Don't Repeat Yourself)

```typescript
// ❌ BAD: Duplicated logic
function getUserName(user) {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.email;
}

function getDisplayName(user) {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.email;
}

// ✅ GOOD: Extract common logic
function getFullName(user: User): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.email;
}

// Use everywhere
const userName = getFullName(user);
const displayName = getFullName(user);
```

---

## 7. Testing

### Test Structure (AAA Pattern)

```typescript
describe('calculateDiscount', () => {
  it('should apply 10% discount for premium users', () => {
    // Arrange
    const user = { type: 'premium', purchaseAmount: 100 };
    
    // Act
    const discount = calculateDiscount(user);
    
    // Assert
    expect(discount).toBe(10);
  });
});
```

### One Concept Per Test

```typescript
// ❌ BAD: Multiple concepts
test('user operations', () => {
  const user = createUser('John');
  expect(user.name).toBe('John');
  
  user.updateEmail('john@example.com');
  expect(user.email).toBe('john@example.com');
  
  user.delete();
  expect(user.isDeleted).toBe(true);
});

// ✅ GOOD: Separate tests
describe('User', () => {
  it('should create user with name', () => { });
  it('should update email', () => { });
  it('should mark as deleted', () => { });
});
```

---

## 8. Code Review Checklist

- [ ] Names are descriptive and consistent
- [ ] Functions do one thing
- [ ] No duplication (DRY)
- [ ] Error handling is comprehensive
- [ ] Comments explain why, not what
- [ ] Code is self-documenting
- [ ] Tests are present and meaningful
- [ ] No obvious bugs or edge cases missed
- [ ] Follows project conventions
- [ ] No hardcoded magic numbers/strings

---

## 9. Anti-Patterns

### ❌ Magic Numbers

```typescript
// BAD
if (status === 5) { } // What is 5?

// GOOD
const STATUS_COMPLETED = 5;
if (status === STATUS_COMPLETED) { }
```

### ❌ Deep Nesting

```typescript
// BAD: Pyramid of doom
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      // Do something
    }
  }
}

// GOOD: Guard clauses
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;
// Do something
```

### ❌ Side Effects

```typescript
// BAD: Unexpected side effect
function getTotal(items) {
  items.sort(); // Modifies input!
  return items.reduce((a, b) => a + b, 0);
}

// GOOD: Pure function
function getTotal(items) {
  return [...items].sort().reduce((a, b) => a + b, 0);
}
```

---

## 10. Language-Specific Tips

### TypeScript

```typescript
// Use strict mode
// Prefer interfaces for object types
// Use type for unions/tuples
// Avoid 'any', use 'unknown' if needed
// Use readonly where appropriate
// Leverage type inference when obvious
```

### JavaScript

```typescript
// Use === not ==
// Use const by default, let when needed
// Prefer async/await over callbacks
// Use destructuring
// Use template literals
// Use optional chaining (?.)
```

---

> **Remember:** The goal is not perfection, but continuous improvement. Leave the code better than you found it.
