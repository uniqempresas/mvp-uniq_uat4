---
name: nodejs-best-practices
description: Node.js best practices, async patterns, module organization, and production tips. Use for Node.js applications, Express/Fastify APIs, and backend development.
---

# Node.js Best Practices

> Building robust, scalable, and maintainable Node.js applications.

---

## 1. Project Structure

### Recommended Layout

```
project/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Data models
│   ├── middleware/      # Express/Fastify middleware
│   ├── utils/           # Utility functions
│   ├── routes/          # Route definitions
│   └── app.ts           # Application entry
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── scripts/
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

### Separation of Concerns

```typescript
// ❌ BAD: Everything in one file
app.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  const processed = users.map(u => ({ ...u, name: u.name.toUpperCase() }));
  await logger.log('Users fetched');
  res.json(processed);
});

// ✅ GOOD: Layered architecture
// controller.ts
export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAll();
  res.json(users);
}

// service.ts
export async function getAll() {
  const users = await userRepository.findAll();
  return users.map(userMapper.toDTO);
}

// repository.ts
export async function findAll() {
  return db.query('SELECT * FROM users');
}
```

---

## 2. Async/Await Patterns

### Error Handling

```typescript
// ❌ BAD: Unhandled rejection
app.get('/data', async (req, res) => {
  const data = await fetchData(); // May throw
  res.json(data);
});

// ✅ GOOD: Try-catch with proper error handling
app.get('/data', async (req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Even better: Express async handler wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/data', asyncHandler(async (req, res) => {
  const data = await fetchData();
  res.json(data);
}));
```

### Parallel Execution

```typescript
// ❌ BAD: Sequential when parallel is possible
const users = await getUsers();
const orders = await getOrders();
const products = await getProducts();

// ✅ GOOD: Promise.all for independent operations
const [users, orders, products] = await Promise.all([
  getUsers(),
  getOrders(),
  getProducts()
]);

// With error handling per promise
const results = await Promise.allSettled([
  getUsers(),
  getOrders()
]);

results.forEach((result, index) => {
  if (result.status === 'rejected') {
    logger.error(`Operation ${index} failed:`, result.reason);
  }
});
```

---

## 3. Environment Configuration

### Environment Variables

```typescript
// config/env.ts
import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  REDIS_URL: z.string().optional()
});

export const env = envSchema.parse(process.env);
```

### Configuration by Environment

```typescript
// config/index.ts
const configs = {
  development: {
    logLevel: 'debug',
    dbLogging: true
  },
  production: {
    logLevel: 'warn',
    dbLogging: false
  },
  test: {
    logLevel: 'silent',
    dbLogging: false
  }
};

export const config = configs[env.NODE_ENV];
```

---

## 4. Error Handling

### Centralized Error Handler

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Log unexpected errors
  logger.error('Unexpected error:', err);
  
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}

// Usage
if (!user) {
  throw new AppError(404, 'User not found');
}
```

---

## 5. Logging

### Structured Logging

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('Server started', { port: 3000 });
logger.error('Database connection failed', { error: err.message });
logger.warn('Rate limit approached', { userId, remaining: 10 });
```

---

## 6. Security

### Helmet for Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));
```

### Input Validation

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().int().positive().optional()
});

app.post('/users', (req, res, next) => {
  const result = userSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      errors: result.error.issues
    });
  }
  
  // Process valid data
  next();
});
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);
```

---

## 7. Database Best Practices

### Connection Management

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Always release connections
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
```

### Query Building

```typescript
// ❌ BAD: String concatenation (SQL injection risk)
const query = `SELECT * FROM users WHERE name = '${name}'`;

// ✅ GOOD: Parameterized queries
const query = 'SELECT * FROM users WHERE name = $1';
const result = await db.query(query, [name]);
```

---

## 8. Testing

### Unit Tests with Vitest

```typescript
import { describe, it, expect, vi } from 'vitest';
import { userService } from './userService';

describe('userService', () => {
  it('should create user', async () => {
    const mockUser = { id: 1, name: 'John' };
    vi.spyOn(userRepository, 'create').mockResolvedValue(mockUser);
    
    const result = await userService.create({ name: 'John' });
    
    expect(result).toEqual(mockUser);
  });
});
```

### Integration Tests

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { app } from '../src/app';

const request = supertest(app);

describe('User API', () => {
  it('POST /users should create user', async () => {
    const response = await request
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

---

## 9. Performance

### Cluster Mode

```typescript
import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  require('./server');
  console.log(`Worker ${process.pid} started`);
}
```

### Stream Processing

```typescript
import { createReadStream } from 'fs';
import { createGunzip } from 'zlib';

// Process large files efficiently
const stream = createReadStream('large-file.csv.gz')
  .pipe(createGunzip())
  .pipe(parseCSV())
  .pipe(processData());

stream.on('data', (chunk) => {
  // Process chunk
});
```

---

## 10. Production Checklist

- [ ] Environment variables configured
- [ ] Logging implemented
- [ ] Error handling centralized
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Input validation in place
- [ ] Database connections pooled
- [ ] Health check endpoint
- [ ] Graceful shutdown handling
- [ ] Monitoring/APM configured

---

> **Remember:** Node.js is single-threaded. Never block the event loop with synchronous operations.
