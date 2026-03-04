---
name: deploy
description: Deploy application to production with proper checks, safety measures, and rollback capabilities.
---

# /deploy Command

## Usage

```
/deploy [environment]
```

## Examples

```
/deploy staging
/deploy production
```

## What It Does

This command invokes the `@devops-engineer` agent to:

1. **Pre-deployment Checks**
   - Verify all tests pass
   - Check security scans
   - Validate configuration
   - Confirm database migrations

2. **Deployment**
   - Execute deployment strategy (blue-green, canary, rolling)
   - Monitor health checks
   - Verify application status

3. **Post-deployment**
   - Smoke tests
   - Monitor metrics
   - Verify functionality
   - Document deployment

## Deployment Strategies

- **Blue-Green**: Instant switch with easy rollback
- **Canary**: Gradual rollout to subset of users
- **Rolling**: Replace instances gradually

## Safety Measures

- Database backups before migrations
- Feature flags for risky changes
- Automated rollback triggers
- Monitoring and alerts

## When to Use

- Releasing to staging/production
- Emergency hotfixes
- Scheduled releases
- Infrastructure changes

## Prerequisites

- All tests passing
- Code reviewed and approved
- Database migrations prepared
- Rollback plan ready

## Output

The agent will:
- Execute deployment steps
- Monitor deployment health
- Report status
- Provide rollback instructions if needed
