---
name: api-patterns
description: REST API design, GraphQL, tRPC patterns, authentication, versioning, and best practices for building APIs.
---

# API Patterns

> Designing robust, scalable, and maintainable APIs.

---

## 1. REST API Design

### Resource Naming

```
✅ GOOD:
GET    /users           # List users
GET    /users/123       # Get specific user
POST   /users           # Create user
PUT    /users/123       # Update user (full)
PATCH  /users/123       # Update user (partial)
DELETE /users/123       # Delete user

❌ BAD:
GET    /getUsers
POST   /createUser
GET    /user/123/delete
```

### HTTP Status Codes

| Code | Meaning | Use When |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE (no body) |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Valid auth, but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Semantic errors |
| 500 | Server Error | Unexpected server error |

### Response Format

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## 2. Pagination

### Offset-Based

```http
GET /users?page=1&limit=20

{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "links": {
    "self": "/users?page=1&limit=20",
    "next": "/users?page=2&limit=20",
    "prev": null
  }
}
```

### Cursor-Based (Better for real-time)

```http
GET /users?limit=20&cursor=eyJpZCI6MTIzfQ

{
  "data": [...],
  "meta": {
    "limit": 20,
    "nextCursor": "eyJpZCI6MTQzfQ",
    "hasMore": true
  }
}
```

---

## 3. Filtering, Sorting, Searching

```http
# Filtering
GET /users?status=active&role=admin

# Sorting
GET /users?sort=-created_at,name
# (- for descending, + or nothing for ascending)

# Searching
GET /users?q=john

# Combined
GET /users?status=active&sort=-created_at&page=1&limit=20
```

---

## 4. Authentication

### JWT (JSON Web Tokens)

```typescript
// Login endpoint
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}

// Using token
GET /protected/resource
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### API Keys

```http
GET /api/resource
X-API-Key: your-api-key-here
```

### OAuth 2.0

```
1. User authenticates with OAuth provider
2. Provider redirects with authorization code
3. Exchange code for access token
4. Use access token to call API
```

---

## 5. Rate Limiting

### Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200

# When limit exceeded
429 Too Many Requests
Retry-After: 60
```

### Implementation

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP
  message: {
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

---

## 6. Versioning

### URL Path (Recommended)

```
/api/v1/users
/api/v2/users
```

### Header

```http
GET /users
API-Version: 2
```

### Content Negotiation

```http
GET /users
Accept: application/vnd.api.v2+json
```

---

## 7. GraphQL

### Schema Definition

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

type Query {
  users(limit: Int = 10, offset: Int = 0): [User!]!
  user(id: ID!): User
  posts: [Post!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

input CreateUserInput {
  name: String!
  email: String!
}
```

### Query Example

```graphql
query GetUserWithPosts($id: ID!) {
  user(id: $id) {
    id
    name
    email
    posts(limit: 5) {
      id
      title
    }
  }
}
```

### Resolver

```typescript
const resolvers = {
  Query: {
    user: async (_, { id }, { db }) => {
      return db.users.findById(id);
    },
  },
  User: {
    posts: async (user, { limit = 10 }, { db }) => {
      return db.posts.findByUserId(user.id, { limit });
    },
  },
};
```

---

## 8. tRPC (TypeScript RPC)

### Router Definition

```typescript
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

const appRouter = t.router({
  user: t.router({
    // Query (GET equivalent)
    getById: t.procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.user.findById(input.id);
      }),
    
    // Mutation (POST/PUT/PATCH equivalent)
    create: t.procedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        return await db.user.create(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
```

### Client Usage

```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './server';

const trpc = createTRPCReact<AppRouter>();

// In component
function UserProfile({ userId }: { userId: string }) {
  const { data } = trpc.user.getById.useQuery({ id: userId });
  
  const mutation = trpc.user.create.useMutation();
  
  return (
    <div>
      <h1>{data?.name}</h1>
      <button onClick={() => mutation.mutate({ name: 'John', email: 'john@example.com' })}>
        Create User
      </button>
    </div>
  );
}
```

---

## 9. Validation

### Using Zod

```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().min(18).optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

// Type inference
type CreateUserInput = z.infer<typeof createUserSchema>;

// Validation
app.post('/users', (req, res) => {
  const result = createUserSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues,
    });
  }
  
  // result.data is typed as CreateUserInput
  const user = await createUser(result.data);
});
```

---

## 10. Error Handling

### Structured Errors

```typescript
class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}

// Usage
if (!user) {
  throw new APIError(404, 'USER_NOT_FOUND', 'User not found');
}

if (!isValidPassword(password, user.password)) {
  throw new APIError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
}

// Error handler
app.use((err: Error, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }
  
  // Log unexpected errors
  console.error(err);
  
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
});
```

---

## 11. Documentation

### OpenAPI/Swagger

```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
  },
  apis: ['./routes/*.ts'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---

## 12. Security Best Practices

- ✅ Use HTTPS everywhere
- ✅ Validate all inputs
- ✅ Use parameterized queries (prevent SQL injection)
- ✅ Implement rate limiting
- ✅ Use CORS properly
- ✅ Sanitize output (prevent XSS)
- ✅ Set security headers (Helmet)
- ✅ Use strong authentication
- ✅ Implement proper authorization
- ✅ Log security events
- ✅ Keep dependencies updated

---

> **Remember:** APIs are contracts. Design them carefully, version them properly, and never break backward compatibility without a major version bump.
