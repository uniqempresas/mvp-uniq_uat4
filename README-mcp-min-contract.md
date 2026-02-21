Min contract for MCP migrations (Supabase)

- Endpoints (assumidos pelo contrato mínimo):
  - POST /list_migrations with body { action: 'list_migrations' }
  - POST /apply_migration with body { action: 'apply_migration', name: '<migration.sql>', up_sql: '<sql>' }
- Autenticação: header Authorization: Bearer <token>
- Parâmetros opcionais: project_ref na query, se o MCP exigir; use OPENCODE_MCP_PROJECT_REF para setar via env.
- Resposta esperada de list_migrations: { migrations: [ { name, applied, applied_at } ] }
- Resposta esperada de apply_migration: { success: true, migration_id, applied_at }
- Observação: este é o contrato mínimo; a API real pode ter variações de nomes/toques. Ajuste conforme docs oficiais.
