---
name: app-builder
description: Full-stack application scaffolding, project setup, and boilerplate generation.
---

# App Builder

> Scaffolding full-stack applications with best practices.

---

## 1. Project Structure

### Monorepo
```
my-app/
├── apps/
│   ├── web/           # Next.js frontend
│   └── api/           # Node.js backend
├── packages/
│   ├── ui/            # Shared UI components
│   ├── config/        # Shared configs
│   └── types/         # Shared types
└── turbo.json
```

### Full-Stack
```
my-app/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React components
│   ├── lib/          # Utilities
│   └── server/       # API routes
├── tests/
├── prisma/           # Database schema
└── docker-compose.yml
```

---

## 2. Technology Stack

### Frontend
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express/Fastify/Hono
- TypeScript
- Prisma/Drizzle

### Database
- PostgreSQL
- Redis (caching)

### DevOps
- Docker
- GitHub Actions
- Vercel/Railway/AWS

---

## 3. Setup Commands

```bash
# Create Next.js app
npx create-next-app@latest my-app --typescript --tailwind --eslint --app

# Setup Prisma
npm install prisma @prisma/client
npx prisma init

# Setup testing
npm install -D vitest @testing-library/react

# Setup formatting
npm install -D prettier eslint-config-prettier
```

---

## 4. Best Practices

- ✅ Use TypeScript
- ✅ Set up linting and formatting
- ✅ Configure CI/CD early
- ✅ Add testing from start
- ✅ Use environment variables
- ✅ Dockerize from beginning

---

> **Remember:** Good architecture from the start saves time later.
