Migrations via MCP (Supabase)

- This project uses the MCP (Migration Control Protocol) to apply migrations against the Supabase Postgres database through a remote MCP endpoint.
- MCP config is declared in opencode.json under the mcp.supabase section.
- Before running migrations, ensure your credentials are provided via environment variables and secrets managers, not hard-coded in files.

How it works (high level)
- SQL migrations live in the migrations/ directory and are applied in lexical order.
- A migration runner (scripts/mcp-migrate.js) reads the migrations and pushes them to the MCP endpoint using an HTTP POST payload containing the migration name and SQL.
- The MCP endpoint executes the SQL on the target database and returns status.

What you probably want to do next
- Replace the hard-coded Authorization header with an environment variable and configure it in your CI/secrets store:
  OPENCODE_MCP_SUPABASE_AUTH
- Add an example migration (001-*.sql) and test locally against a staging database.
- Integrate the runner into CI (e.g., GitHub Actions) to apply migrations on push to main or on deployment to staging/production.

Notes
- This is a starter scaffold. Depending on your MCP API contract, you may need to adjust payload format, endpoints, or authentication flow.
- If you want, I can tailor the runner to the exact MCP API and add a small workflow file.
