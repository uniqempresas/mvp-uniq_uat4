---
name: deployment-procedures
description: CI/CD pipelines, deployment strategies (blue-green, canary), and production deployment best practices.
---

# Deployment Procedures

> Reliable, automated deployment strategies for production systems.

---

## 1. CI/CD Pipeline

### GitHub Actions Example
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deployment script
```

---

## 2. Deployment Strategies

### Blue-Green Deployment
- Two identical environments
- Switch traffic instantly
- Easy rollback

### Canary Deployment
- Deploy to small subset first
- Monitor metrics
- Gradually increase traffic

### Rolling Deployment
- Replace instances gradually
- No downtime
- Resource efficient

---

## 3. Best Practices

- ✅ Automated deployments
- ✅ Health checks before switching traffic
- ✅ Database migrations in separate step
- ✅ Feature flags for risky changes
- ✅ Monitoring and alerting
- ✅ Easy rollback plan

---

> **Remember:** Deployments should be boring. If they're exciting, something is wrong.
