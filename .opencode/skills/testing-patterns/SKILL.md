---
name: testing-patterns
description: Testing strategies, unit tests, integration tests, mocking, and test coverage best practices for Jest and Vitest.
---

# Testing Patterns

> Comprehensive testing strategies for reliable software.

---

## 1. Testing Pyramid

```
    /\
   /  \     E2E Tests (Few, slow, expensive)
  /____\    Test critical user journeys
 /      \
/________\  Integration Tests (Some, medium)
            Test component interactions

Integration
    |
    |
    |
   _|_
  |   |
  |   |
  |___|     Unit Tests (Many, fast, cheap)
            Test individual units
```

**Distribution:**
- 70% Unit tests
- 20% Integration tests
- 10% E2E tests

---

## 2. AAA Pattern (Arrange-Act-Assert)

```typescript
describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    // Arrange
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 }
    ];
    const taxRate = 0.1;
    
    // Act
    const result = calculateTotal(items, taxRate);
    
    // Assert
    expect(result).toBe(275); // (100*2 + 50*1) * 1.1
  });
});
```

---

## 3. Unit Testing

### Testing Pure Functions

```typescript
// Function to test
export function calculateDiscount(price: number, discountRate: number): number {
  if (discountRate < 0 || discountRate > 1) {
    throw new Error('Discount rate must be between 0 and 1');
  }
  return price * (1 - discountRate);
}

// Tests
describe('calculateDiscount', () => {
  it('should calculate 10% discount', () => {
    expect(calculateDiscount(100, 0.1)).toBe(90);
  });
  
  it('should return original price with 0% discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });
  
  it('should throw error for negative discount', () => {
    expect(() => calculateDiscount(100, -0.1)).toThrow('Discount rate must be between 0 and 1');
  });
  
  it('should throw error for discount > 100%', () => {
    expect(() => calculateDiscount(100, 1.5)).toThrow('Discount rate must be between 0 and 1');
  });
});
```

### Testing with Dependencies (Mocking)

```typescript
import { vi } from 'vitest';
import { userService } from './userService';
import { userRepository } from './userRepository';
import { emailService } from './emailService';

// Mock dependencies
vi.mock('./userRepository');
vi.mock('./emailService');

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('createUser', () => {
    it('should create user and send welcome email', async () => {
      // Arrange
      const userData = { email: 'john@example.com', name: 'John' };
      const createdUser = { id: '1', ...userData };
      
      vi.mocked(userRepository.create).mockResolvedValue(createdUser);
      vi.mocked(emailService.sendWelcomeEmail).mockResolvedValue(undefined);
      
      // Act
      const result = await userService.createUser(userData);
      
      // Assert
      expect(result).toEqual(createdUser);
      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(userData.email);
    });
    
    it('should throw error if email already exists', async () => {
      // Arrange
      const userData = { email: 'existing@example.com', name: 'John' };
      vi.mocked(userRepository.findByEmail).mockResolvedValue({ id: '1', ...userData });
      
      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects.toThrow('Email already exists');
    });
  });
});
```

---

## 4. Integration Testing

### Database Integration

```typescript
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from './db';
import { userService } from './userService';

describe('UserService Integration', () => {
  beforeAll(async () => {
    await db.connect(process.env.TEST_DATABASE_URL);
  });
  
  afterAll(async () => {
    await db.disconnect();
  });
  
  beforeEach(async () => {
    await db.clear();
  });
  
  it('should create and retrieve user from database', async () => {
    // Arrange
    const userData = { email: 'test@example.com', name: 'Test User' };
    
    // Act
    const created = await userService.createUser(userData);
    const retrieved = await userService.getUser(created.id);
    
    // Assert
    expect(retrieved).toMatchObject(userData);
    expect(retrieved.id).toBeDefined();
  });
});
```

### API Integration

```typescript
import request from 'supertest';
import { app } from './app';

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test' };
      
      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
      
      // Assert
      expect(response.body).toMatchObject(userData);
      expect(response.body.id).toBeDefined();
    });
    
    it('should return 400 for invalid email', async () => {
      // Arrange
      const invalidData = { email: 'invalid-email', name: 'Test' };
      
      // Act
      const response = await request(app)
        .post('/api/users')
        .send(invalidData)
        .expect(400);
      
      // Assert
      expect(response.body.error).toBeDefined();
    });
  });
});
```

---

## 5. React Component Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should render form fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
  
  it('should call onSubmit with form data', async () => {
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Assert
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
  
  it('should show validation errors', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    
    // Submit empty form
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Assert
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });
  
  it('should show loading state while submitting', async () => {
    const slowSubmit = vi.fn(() => new Promise(() => {})); // Never resolves
    render(<LoginForm onSubmit={slowSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

---

## 6. Async Testing

```typescript
describe('async operations', () => {
  it('should handle async operations', async () => {
    const result = await fetchData();
    expect(result).toBeDefined();
  });
  
  it('should handle rejected promises', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Network error'));
    
    await expect(fetchData()).rejects.toThrow('Network error');
  });
  
  it('should handle loading states', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetchData());
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
  
  it('should use fake timers for delays', async () => {
    vi.useFakeTimers();
    
    const promise = fetchWithDelay();
    
    vi.advanceTimersByTime(1000);
    
    const result = await promise;
    expect(result).toBeDefined();
    
    vi.useRealTimers();
  });
});
```

---

## 7. Mocking Patterns

### Mocking Modules

```typescript
// Mock entire module
vi.mock('./api', () => ({
  fetchUser: vi.fn(),
  updateUser: vi.fn(),
}));

// Mock with implementation
vi.mock('./api', async () => {
  const actual = await vi.importActual('./api');
  return {
    ...actual,
    fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'John' }),
  };
});
```

### Mocking Timers

```typescript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should debounce search', () => {
  const mockSearch = vi.fn();
  const debouncedSearch = debounce(mockSearch, 300);
  
  debouncedSearch('test');
  debouncedSearch('test2');
  debouncedSearch('test3');
  
  expect(mockSearch).not.toHaveBeenCalled();
  
  vi.advanceTimersByTime(300);
  
  expect(mockSearch).toHaveBeenCalledTimes(1);
  expect(mockSearch).toHaveBeenCalledWith('test3');
});
```

### Mocking fetch

```typescript
global.fetch = vi.fn();

beforeEach(() => {
  vi.mocked(fetch).mockClear();
});

it('should fetch data', async () => {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'test' }),
  } as Response);
  
  const result = await fetchData();
  
  expect(result).toEqual({ data: 'test' });
  expect(fetch).toHaveBeenCalledWith('/api/data');
});
```

---

## 8. Test Organization

```typescript
// Group related tests
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should throw for duplicate email', () => {});
    it('should validate required fields', () => {});
  });
  
  describe('updateUser', () => {
    it('should update existing user', () => {});
    it('should throw for non-existent user', () => {});
  });
  
  describe('deleteUser', () => {
    it('should soft delete user', () => {});
  });
});
```

---

## 9. Test Coverage

### Minimum Coverage Goals

| Type | Target |
|------|--------|
| Statements | 80% |
| Branches | 75% |
| Functions | 80% |
| Lines | 80% |

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

---

## 10. Best Practices

### Do:
✅ Test behavior, not implementation
✅ One assertion per test (generally)
✅ Use descriptive test names
✅ Keep tests independent
✅ Mock external dependencies
✅ Test edge cases and error paths
✅ Refactor tests like production code

### Don't:
❌ Test implementation details
❌ Share state between tests
❌ Write tests that always pass
❌ Ignore failing tests
❌ Test third-party libraries
❌ Write tests that depend on order

---

## 11. Common Matchers

```typescript
// Equality
expect(value).toBe(expected);           // Strict equality
expect(value).toEqual(expected);        // Deep equality
expect(value).toStrictEqual(expected);  // Deep + type

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeGreaterThanOrEqual(5);
expect(value).toBeLessThan(10);
expect(value).toBeCloseTo(0.3, 5); // 5 decimal places

// Strings
expect(string).toMatch(/regex/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(5);
expect(array).toEqual(expect.arrayContaining([1, 2]));

// Objects
expect(object).toHaveProperty('key');
expect(object).toHaveProperty('key', value);
expect(object).toMatchObject({ key: value });

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenCalledTimes(3);
```

---

> **Remember:** Tests are documentation. Write them as if you're explaining the code to a future developer (which might be you).
