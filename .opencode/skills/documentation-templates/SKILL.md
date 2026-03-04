---
name: documentation-templates
description: Documentation formats, templates, and standards for technical documentation.
---

# Documentation Templates

> Standard formats for technical documentation.

---

## 1. README Template

```markdown
# Project Name

> One-line description

## Features

- Feature 1
- Feature 2

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Usage

\`\`\`typescript
import { myFunction } from 'project-name';
\`\`\`

## API Reference

### `functionName(param)`

Description

**Parameters:**
- `param` (type): Description

**Returns:**
- Type: Description

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT
```

---

## 2. API Documentation Template

```markdown
## Endpoint: POST /api/resource

### Description
What this endpoint does

### Request

**Headers:**
- Authorization: Bearer token
- Content-Type: application/json

**Body:**
\`\`\`json
{
  "field": "value"
}
\`\`\`

### Response

**Success (200):**
\`\`\`json
{
  "id": 1,
  "field": "value"
}
\`\`\`

**Error (400):**
\`\`\`json
{
  "error": "Invalid input"
}
\`\`\`
```

---

## 3. ADR Template

```markdown
# ADR 001: Decision Title

## Status
Proposed / Accepted / Deprecated

## Context
What is the issue we're deciding?

## Decision
What we decided

## Consequences
Positive and negative impacts
```

---

## 4. Best Practices

- ✅ Clear structure
- ✅ Examples included
- ✅ Up to date
- ✅ Version controlled
- ✅ Accessible

---

> **Remember:** Documentation is a product feature. Write it well.
