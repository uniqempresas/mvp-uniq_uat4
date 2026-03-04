---
name: database-design
description: Database design principles, schema design, normalization, indexing strategies, and query optimization. Use for designing schemas, migrations, and database architecture.
---

# Database Design Principles

> **Data is the foundation.** A well-designed schema makes everything else easier.

---

## 1. Normalization

### First Normal Form (1NF)
- Each cell contains a single value
- No repeating groups
- Each row is unique

```sql
-- ❌ BAD: Repeating groups
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_name VARCHAR(255),
  items VARCHAR(1000) -- 'item1,item2,item3'
);

-- ✅ GOOD: Separate table
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT REFERENCES customers(id)
);

CREATE TABLE order_items (
  item_id INT PRIMARY KEY,
  order_id INT REFERENCES orders(order_id),
  product_id INT,
  quantity INT
);
```

### Second Normal Form (2NF)
- Must be in 1NF
- No partial dependencies (non-key attributes depend on full primary key)

### Third Normal Form (3NF)
- Must be in 2NF
- No transitive dependencies (non-key attributes depend only on primary key)

---

## 2. Schema Design Patterns

### One-to-Many Relationship

```sql
-- Parent table
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT
);

-- Child table with foreign key
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  published_date DATE
);

-- Index on foreign key for performance
CREATE INDEX idx_books_author_id ON books(author_id);
```

### Many-to-Many Relationship

```sql
-- Junction table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE enrollments (
  student_id INT REFERENCES students(id),
  course_id INT REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, course_id)
);
```

### One-to-One Relationship

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE user_profiles (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url VARCHAR(500),
  birth_date DATE
);
```

---

## 3. Indexing Strategy

### When to Index

| Scenario | Index Type |
|----------|------------|
| Primary key lookups | B-tree (default) |
| Foreign keys | B-tree |
| Text search | GIN/GiST |
| Geospatial data | GiST/SP-GiST |
| Array operations | GIN |
| JSON operations | GIN |

### Index Examples

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_orders_status_date ON orders(status, created_at);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Expression index
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
```

### Index Guidelines

- **Do index**: Columns in WHERE, JOIN, ORDER BY
- **Don't index**: Columns with low cardinality (boolean, status)
- **Do index**: Foreign keys
- **Be careful**: Indexes slow down writes (INSERT, UPDATE, DELETE)

---

## 4. Constraints

### Data Integrity

```sql
-- NOT NULL
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);

-- UNIQUE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

-- CHECK constraints
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  salary DECIMAL(10, 2),
  age INT CHECK (age >= 18 AND age <= 65),
  CHECK (salary > 0 OR salary IS NULL)
);

-- DEFAULT values
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Query Optimization

### EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5;
```

### Common Optimizations

```sql
-- ❌ BAD: SELECT *
SELECT * FROM users WHERE id = 1;

-- ✅ GOOD: Select only needed columns
SELECT id, name, email FROM users WHERE id = 1;

-- ❌ BAD: Functions on indexed columns (prevents index use)
SELECT * FROM users WHERE LOWER(email) = 'john@example.com';

-- ✅ GOOD: Use expression index or compare properly
SELECT * FROM users WHERE email = 'john@example.com';

-- ❌ BAD: N+1 queries
const users = await db.query('SELECT * FROM users');
for (const user of users) {
  const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [user.id]);
}

-- ✅ GOOD: JOIN to fetch related data
SELECT u.*, o.id as order_id, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.id IN (1, 2, 3);
```

---

## 6. Migrations

### Migration Best Practices

```sql
-- Up migration (apply changes)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Down migration (rollback)
DROP INDEX idx_users_email;
DROP TABLE users;
```

### Safe Migration Patterns

```sql
-- Adding column (safe)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Adding NOT NULL column (requires default or multiple steps)
-- Step 1: Add nullable column
ALTER TABLE users ADD COLUMN age INT;

-- Step 2: Backfill data
UPDATE users SET age = 0 WHERE age IS NULL;

-- Step 3: Add constraint
ALTER TABLE users ALTER COLUMN age SET NOT NULL;

-- Adding index concurrently (PostgreSQL, doesn't lock table)
CREATE INDEX CONCURRENTLY idx_users_created_at ON users(created_at);

-- Adding foreign key (check data first)
-- Step 1: Add without constraint
ALTER TABLE orders ADD COLUMN user_id INT;

-- Step 2: Backfill if needed
UPDATE orders SET user_id = 1 WHERE user_id IS NULL;

-- Step 3: Add constraint
ALTER TABLE orders 
  ADD CONSTRAINT fk_orders_user 
  FOREIGN KEY (user_id) REFERENCES users(id);
```

---

## 7. Soft Deletes

```sql
-- Instead of DELETE, use a deleted_at timestamp
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  deleted_at TIMESTAMP DEFAULT NULL
);

-- Query only active records
SELECT * FROM products WHERE deleted_at IS NULL;

-- "Delete" (soft)
UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = 1;

-- Restore
UPDATE products SET deleted_at = NULL WHERE id = 1;

-- View with deleted records
CREATE VIEW active_products AS
SELECT * FROM products WHERE deleted_at IS NULL;
```

---

## 8. Database Design Checklist

- [ ] Tables normalized (at least 3NF)
- [ ] Primary keys defined
- [ ] Foreign keys with proper ON DELETE
- [ ] Indexes on query columns
- [ ] Constraints for data integrity
- [ ] Default values where appropriate
- [ ] Timestamps (created_at, updated_at)
- [ ] Soft deletes (if needed)
- [ ] Migration scripts written
- [ ] Query performance tested

---

> **Remember:** Design for the queries you'll run, not just the entities you have.
