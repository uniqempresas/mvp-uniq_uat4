---
name: mcp-builder
description: Model Context Protocol (MCP) server building, tools, and integration patterns.
---

# MCP Builder

> Building Model Context Protocol servers and tools.

---

## 1. What is MCP?

Model Context Protocol (MCP) is a protocol for extending AI capabilities with custom tools and resources.

---

## 2. MCP Server Structure

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: 'my-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'calculate',
        description: 'Perform calculations',
        inputSchema: {
          type: 'object',
          properties: {
            expression: { type: 'string' },
          },
          required: ['expression'],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'calculate') {
    const result = eval(request.params.arguments.expression);
    return {
      content: [{ type: 'text', text: String(result) }],
    };
  }
  throw new Error('Unknown tool');
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## 3. Best Practices

- ✅ Clear tool descriptions
- ✅ Validate inputs
- ✅ Handle errors gracefully
- ✅ Document schemas
- ✅ Test thoroughly

---

> **Remember:** MCP extends AI capabilities. Build useful, reliable tools.
