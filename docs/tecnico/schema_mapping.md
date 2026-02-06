# Schema Real vs Código - Mapeamento de Correções

**Data**: 29/01/2026  
**Status**: Em correção

---

## 📊 Estrutura Real do Banco (Supabase)

### Tabela `me_empresa`

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | uuid_generate_v4() |
| `nome_fantasia` | text | YES | null |
| `cnpj` | text | YES | null |
| `telefone` | text | YES | null |
| **`email`** | text | YES | null |
| `created_at` | timestamp with time zone | YES | now() |
| `slug` | text | YES | null |

**❌ Colunas que NÃO existem:**
- `email_contato` (existe `email`)
- `ativo`
- `razao_social`
- `updated_at`

---

### Tabela `me_usuario`

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | null |
| `empresa_id` | uuid | YES | null |
| `email` | text | YES | null |
| `cargo` | integer | YES | null |
| **`nome_usuario`** | text | YES | null |
| `created_at` | timestamp with time zone | YES | now() |

**❌ Colunas que NÃO existem:**
- `nome` (existe `nome_usuario`)
- `ativo`

---

### Tabela `me_empresa_endereco`

| Coluna | Tipo | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | gen_random_uuid() |
| `empresa_id` | uuid | NO | null |
| `cep` | text | NO | null |
| `logradouro` | text | NO | null |
| `numero` | text | NO | null |
| `complemento` | text | YES | null |
| `bairro` | text | NO | null |
| `cidade` | text | NO | null |
| `uf` | text | NO | null |
| `ibge` | text | YES | null |
| `created_at` | timestamp with time zone | NO | timezone('utc'::text, now()) |

✅ **Esta tabela está OK!**

---

## 🔧 Correções Realizadas

### ✅ 1. Onboarding.tsx (Linha 101)

**Antes:**
```typescript
p_email_contato: formData.email,
```

**Depois:**
```typescript
p_email: formData.email, // Ajustado para schema real
```

---

## ⏳ Correções Pendentes

### 2. Verificar Função RPC

**Ação necessária**: Executar `query_ver_rpc.sql` para ver código da função

**O que verificar:**
- Parâmetro deve ser `p_email` (não `p_email_contato`)
- INSERT em `me_empresa` deve usar `email` (não `email_contato`)
- INSERT em `me_usuario` deve usar `nome_usuario` (não `nome`)
- Não deve tentar inserir em colunas inexistentes (`ativo`, `razao_social`)

---

### 3. Possíveis Ajustes no Frontend

Se a função RPC estiver usando `nome` ao invés de `nome_usuario`, precisaremos ajustar mais código.

**Arquivos potencialmente afetados:**
- `src/services/authService.ts` (se usar `me_usuario`)
- `src/pages/Dashboard/*` (se ler dados do usuário)
- Qualquer componente que leia `me_empresa` ou `me_usuario`

---

## 🎯 Próximos Passos

1. [ ] Ver código da função RPC (`query_ver_rpc.sql`)
2. [ ] Ajustar função RPC se necessário
3. [ ] Testar cadastro de novo usuário
4. [ ] Verificar se outros códigos usam nomes incorretos

---

## 📝 Opção: Adicionar Colunas Faltantes

Se você quiser adicionar as colunas que estão no código mas não no banco:

```sql
-- Adicionar colunas opcionais em me_empresa
ALTER TABLE me_empresa 
ADD COLUMN IF NOT EXISTS razao_social text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default now();

-- Adicionar coluna ativo em me_usuario
ALTER TABLE me_usuario 
ADD COLUMN IF NOT EXISTS ativo boolean default true;
```

**⚠️ Mas NÃO é obrigatório!** O código funciona sem essas colunas.

---

**Status Atual**: Aguardando código da função RPC para continuar
