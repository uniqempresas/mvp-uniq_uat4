---
name: docker-expert
description: Docker containerization, multi-stage builds, Docker Compose, and container best practices for production.
---

# Docker Expert

> Containerization for consistent, portable, and scalable applications.

---

## 1. Dockerfile Best Practices

### Multi-Stage Build

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist ./dist

# Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "dist/main.js"]
```

### Size Optimization

```dockerfile
# Use Alpine Linux for smaller images
FROM node:18-alpine

# Install only required packages
RUN apk add --no-cache dumb-init

# Use .dockerignore to exclude unnecessary files
# node_modules
# .git
# .env
# *.log
# tests/
```

---

## 2. Docker Compose

### Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp
    depends_on:
      - db
      - redis
    command: npm run dev

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
```

---

## 3. Commands

### Basic Commands

```bash
# Build image
docker build -t myapp:latest .

# Run container
docker run -d -p 3000:3000 --name myapp myapp:latest

# View logs
docker logs -f myapp

# Execute command in container
docker exec -it myapp sh

# Stop container
docker stop myapp

# Remove container
docker rm myapp

# Remove image
docker rmi myapp:latest
```

### Compose Commands

```bash
# Start services
docker-compose up -d

# Start with specific file
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Scale service
docker-compose up -d --scale app=3

# Restart service
docker-compose restart app

# Down (stop and remove)
docker-compose down

# Down with volumes
docker-compose down -v
```

---

## 4. Networking

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    networks:
      - frontend-network
      - backend-network

  backend:
    build: ./backend
    networks:
      - backend-network
      - database-network

  database:
    image: postgres:15
    networks:
      - database-network

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
  database-network:
    driver: bridge
    internal: true  # No external access
```

---

## 5. Volumes

```yaml
version: '3.8'

services:
  app:
    image: myapp
    volumes:
      # Named volume
      - app_data:/app/data
      
      # Bind mount
      - ./config:/app/config:ro
      
      # Temporary
      - type: tmpfs
        target: /app/tmp

  db:
    image: postgres:15
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro

volumes:
  app_data:
    driver: local
  db_data:
    driver: local
```

---

## 6. Health Checks

```dockerfile
# Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

```yaml
# docker-compose.yml
services:
  app:
    image: myapp
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## 7. Security

### Non-Root User

```dockerfile
FROM node:18-alpine

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

WORKDIR /app

# Copy and install as root, then switch user
COPY --chown=appuser:nodejs . .
RUN npm ci --only=production

USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
```

### Read-Only Root Filesystem

```yaml
services:
  app:
    image: myapp
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache
    volumes:
      - app_data:/app/data
```

### Secrets

```yaml
version: '3.8'

services:
  app:
    image: myapp
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    file: ./secrets/api_key.txt
```

---

## 8. Best Practices

### Do:
✅ Use multi-stage builds
✅ Pin base image versions
✅ Run as non-root user
✅ Use .dockerignore
✅ Minimize layers
✅ Scan images for vulnerabilities
✅ Use health checks
✅ Keep images small

### Don't:
❌ Use latest tag
❌ Store secrets in images
❌ Run as root unnecessarily
❌ Include dev dependencies in production
❌ Ignore image size
❌ Use ADD when COPY works

---

> **Remember:** Containers should be ephemeral and replaceable. Store data in volumes and configuration in environment variables.
