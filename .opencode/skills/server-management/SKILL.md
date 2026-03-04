---
name: server-management
description: Server administration, monitoring, logging, and infrastructure management.
---

# Server Management

> Managing production servers and infrastructure.

---

## 1. Monitoring

### Key Metrics
- CPU usage
- Memory usage
- Disk space
- Network I/O
- Application metrics (requests, errors, latency)

### Tools
- Prometheus + Grafana
- DataDog
- New Relic
- CloudWatch (AWS)

---

## 2. Logging

### Structured Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Log Levels
- ERROR: Actual errors
- WARN: Warning conditions
- INFO: Normal operations
- DEBUG: Detailed debugging

---

## 3. Health Checks

```typescript
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
    version: process.env.npm_package_version
  };
  res.json(health);
});
```

---

## 4. Best Practices

- ✅ Monitor everything
- ✅ Set up alerts
- ✅ Log structured data
- ✅ Use centralized logging
- ✅ Implement health checks
- ✅ Regular backups
- ✅ Security patches
- ✅ Documentation

---

> **Remember:** You can't manage what you don't measure. Monitoring is essential.
