---
name: typescript-expert
description: TypeScript advanced patterns, utility types, type safety, generics, and best practices for production code.
---

# TypeScript Expert

> Advanced TypeScript patterns for type-safe, maintainable applications.

---

## 1. Strict Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

---

## 2. Utility Types

### Built-in Utilities

```typescript
// Partial - Make all properties optional
type PartialUser = Partial<User>;

// Required - Make all properties required
type RequiredUser = Required<User>;

// Pick - Select specific properties
type UserBasic = Pick<User, 'id' | 'name'>;

// Omit - Remove specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Record - Object with specific keys and values
type UserMap = Record<string, User>;

// Exclude - Remove types from union
type NonNullableString = Exclude<string | null | undefined, null | undefined>;

// Extract - Keep only specific types
type StringsOnly = Extract<string | number | boolean, string>;

// NonNullable - Remove null and undefined
type SafeUser = NonNullable<User | null | undefined>;

// ReturnType - Extract return type
type ApiResponse = ReturnType<typeof fetchUser>;

// Parameters - Extract parameter types
type FetchParams = Parameters<typeof fetchUser>;

// Awaited - Extract resolved promise type
type UserData = Awaited<ReturnType<typeof fetchUser>>;
```

---

## 3. Generics

### Generic Functions

```typescript
// Generic identity function
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42); // T is number
const str = identity('hello'); // T is inferred as string

// Generic with constraints
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength('hello'); // ✓
getLength([1, 2, 3]); // ✓
getLength(42); // ✗ number doesn't have length
```

### Generic Types

```typescript
// Generic interface
interface Container<T> {
  value: T;
  getValue: () => T;
  setValue: (value: T) => void;
}

// Generic class
class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
}

const numberQueue = new Queue<number>();
const stringQueue = new Queue<string>();
```

### Generic Constraints

```typescript
// Multiple constraints
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

function greetPerson<T extends HasName & HasAge>(person: T): string {
  return `Hello ${person.name}, you are ${person.age} years old`;
}

// Default type parameters
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}
```

---

## 4. Advanced Types

### Conditional Types

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type StringOrNumberArray = ToArray<string | number>; // string[] | number[]

// Infer keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

### Mapped Types

```typescript
// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Transform types
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Key remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }
```

### Template Literal Types

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<'click'>; // 'onClick'
type HoverEvent = EventName<'hover'>; // 'onHover'

// URL paths
type APIEndpoints = '/users' | '/posts' | '/comments';
type APIUrls = `https://api.example.com${APIEndpoints}`;

// CSS property variations
type MarginSide = 'top' | 'right' | 'bottom' | 'left';
type MarginProperty = `margin${Capitalize<MarginSide>}`;
// 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft'
```

---

## 5. Type Guards

### User-Defined Type Guards

```typescript
interface Cat {
  type: 'cat';
  meow(): void;
}

interface Dog {
  type: 'dog';
  bark(): void;
}

type Animal = Cat | Dog;

// Type guard function
function isCat(animal: Animal): animal is Cat {
  return animal.type === 'cat';
}

function makeSound(animal: Animal) {
  if (isCat(animal)) {
    animal.meow(); // TypeScript knows this is Cat
  } else {
    animal.bark(); // TypeScript knows this is Dog
  }
}

// Discriminated unions
interface Square {
  kind: 'square';
  size: number;
}

interface Circle {
  kind: 'circle';
  radius: number;
}

type Shape = Square | Circle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'square':
      return shape.size ** 2;
    case 'circle':
      return Math.PI * shape.radius ** 2;
  }
}
```

---

## 6. Declaration Merging

```typescript
// Interface merging
interface User {
  name: string;
}

interface User {
  age: number;
}

// User now has both name and age
const user: User = { name: 'John', age: 30 };

// Namespace merging
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }
}

namespace Validation {
  export const numberRegexp = /^[0-9]+$/;
  
  export class ZipCodeValidator implements StringValidator {
    isValid(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

---

## 7. Decorators

```typescript
// Method decorator
function measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function (...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${end - start}ms`);
    return result;
  };
  
  return descriptor;
}

class DatabaseService {
  @measure
  async fetchData() {
    // ...
  }
}

// Class decorator
function singleton<T extends new (...args: any[]) => any>(constructor: T) {
  let instance: InstanceType<T>;
  
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) return instance;
      super(...args);
      instance = this;
    }
  };
}

@singleton
class Logger {
  // Singleton instance
}
```

---

## 8. Best Practices

### Do:
✅ Use strict mode
✅ Prefer interfaces for object shapes
✅ Use type for unions/tuples
✅ Leverage type inference
✅ Use generics for reusable code
✅ Prefer unknown over any
✅ Use readonly where appropriate
✅ Document complex types

### Don't:
❌ Use any (use unknown instead)
❌ Disable strict mode
❌ Create circular dependencies
❌ Overuse type assertions
❌ Ignore type errors
❌ Write overly complex types

---

> **Remember:** TypeScript is a tool to catch errors early. Use it to make your code more robust, not more complex.
