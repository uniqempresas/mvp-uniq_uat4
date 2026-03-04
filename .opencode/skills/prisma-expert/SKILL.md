---
name: prisma-expert
description: Prisma ORM best practices, schema design, migrations, relations, and query optimization.
---

# Prisma Expert

> Modern database toolkit for TypeScript and Node.js.

---

## 1. Schema Design

### Basic Model

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  posts     Post[]
  profile   Profile?
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}

model Profile {
  id     String @id @default(cuid())
  bio    String?
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

---

## 2. Relations

### One-to-Many

```prisma
model User {
  id    String @id @default(cuid())
  posts Post[] // One user has many posts
}

model Post {
  id       String @id @default(cuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

### Many-to-Many

```prisma
model Post {
  id    String @id @default(cuid())
  tags  Tag[]
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

// Prisma creates implicit join table
```

### Many-to-Many with Join Table

```prisma
model Post {
  id          String       @id @default(cuid())
  categories  CategoriesOnPosts[]
}

model Category {
  id    String              @id @default(cuid())
  name  String              @unique
  posts CategoriesOnPosts[]
}

model CategoriesOnPosts {
  post       Post     @relation(fields: [postId], references: [id])
  postId     String
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId String
  assignedAt DateTime @default(now())
  
  @@id([postId, categoryId])
}
```

---

## 3. Client Usage

### Basic CRUD

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
  },
});

// Read
const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
});

const users = await prisma.user.findMany({
  where: { email: { endsWith: '@example.com' } },
});

// Update
const updated = await prisma.user.update({
  where: { id: 'user-id' },
  data: { name: 'Jane Doe' },
});

// Delete
await prisma.user.delete({
  where: { id: 'user-id' },
});
```

### Include Relations

```typescript
const userWithPosts = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
    profile: true,
  },
});
```

### Select Specific Fields

```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    posts: {
      select: {
        title: true,
      },
    },
  },
});
```

---

## 4. Transactions

### Interactive Transactions

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Create order
  const order = await tx.order.create({
    data: { userId, total: 100 },
  });
  
  // Update inventory
  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: 1 } },
  });
  
  // Create payment
  const payment = await tx.payment.create({
    data: { orderId: order.id, amount: 100 },
  });
  
  return { order, payment };
});
```

### Batch Transactions

```typescript
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'test@example.com' } }),
  prisma.post.create({ data: { title: 'Hello' } }),
]);
```

---

## 5. Advanced Queries

### Pagination

```typescript
// Cursor-based (recommended)
const posts = await prisma.post.findMany({
  take: 10,
  skip: 1, // Skip the cursor
  cursor: { id: 'last-post-id' },
  orderBy: { createdAt: 'desc' },
});

// Offset-based
const posts = await prisma.post.findMany({
  skip: 20,
  take: 10,
});
```

### Filtering

```typescript
const posts = await prisma.post.findMany({
  where: {
    AND: [
      { published: true },
      { createdAt: { gte: new Date('2024-01-01') } },
    ],
    OR: [
      { title: { contains: 'prisma' } },
      { content: { contains: 'prisma' } },
    ],
    NOT: {
      authorId: 'blocked-user-id',
    },
  },
});
```

### Aggregations

```typescript
const aggregations = await prisma.post.aggregate({
  where: { published: true },
  _count: { _all: true },
  _avg: { viewCount: true },
  _sum: { viewCount: true },
  _min: { createdAt: true },
  _max: { createdAt: true },
});

// Group by
const groupByAuthor = await prisma.post.groupBy({
  by: ['authorId'],
  _count: { _all: true },
  _sum: { viewCount: true },
});
```

---

## 6. Migrations

### Creating Migrations

```bash
# Create migration
npx prisma migrate dev --name add_user_profile

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Status
npx prisma migrate status
```

### Migration Safety

```sql
-- Safe: Adding nullable column
ALTER TABLE "User" ADD COLUMN "bio" TEXT;

-- Requires care: Adding NOT NULL column
-- Step 1: Add as nullable
ALTER TABLE "User" ADD COLUMN "status" TEXT;

-- Step 2: Backfill data
UPDATE "User" SET "status" = 'active' WHERE "status" IS NULL;

-- Step 3: Add constraint
ALTER TABLE "User" ALTER COLUMN "status" SET NOT NULL;
```

---

## 7. Connection Pooling

```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Connection string with pooling
// postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10
```

---

## 8. Soft Deletes

```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  content   String?
  deletedAt DateTime?
  
  @@index([deletedAt])
}
```

```typescript
// Middleware for soft delete
prisma.$use(async (params, next) => {
  if (params.model === 'Post') {
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      params.args.data = { deletedAt: new Date() };
    }
  }
  return next(params);
});

// Always filter deleted
const posts = await prisma.post.findMany({
  where: { deletedAt: null },
});
```

---

## 9. Best Practices

- ✅ Use transactions for multi-table operations
- ✅ Index frequently queried fields
- ✅ Use select to limit returned data
- ✅ Handle connection errors
- ✅ Use connection pooling in production
- ✅ Keep migrations reversible

---

> **Remember:** Prisma handles the SQL, but understanding your queries helps optimize performance.
