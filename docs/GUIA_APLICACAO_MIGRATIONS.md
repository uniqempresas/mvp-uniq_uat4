# 🚀 Guia de Aplicação - Fix do Cadastro

## ✅ O que foi criado

Foram criadas **2 migrations SQL** para corrigir o cadastro de usuários:

1. **`20260129_create_empresa_schema.sql`**
   - Tabelas: `me_empresa`, `me_usuario`, `me_empresa_endereco`
   - Índices para performance
   - Políticas RLS (segurança)
   - Triggers automáticos
   - Permissões públicas para storefront

2. **`20260129_create_empresa_rpc.sql`**
   - Função `criar_empresa_e_configuracoes_iniciais()`
   - Funções auxiliares
   - Validações de negócio

---

## 📋 Como Aplicar no Supabase

### Opção 1: Via Dashboard do Supabase (RECOMENDADO)

#### Passo 1: Acessar o SQL Editor

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto **UNIQ Empresas**
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**

#### Passo 2: Aplicar Schema

1. Abra o arquivo `supabase/migrations/20260129_create_empresa_schema.sql`
2. **Copie TODO o conteúdo**
3. Cole no SQL Editor
4. Clique em **Run** (ou pressione Ctrl+Enter)

**⏱️ Tempo estimado**: 2-5 segundos

**✅ Sucesso**: Você verá mensagens confirmando a criação das tabelas

**❌ Erro comum**: Se tabelas já existirem, não tem problema! O SQL usa `create table if not exists`

#### Passo 3: Aplicar RPC

1. Crie uma **nova query** no SQL Editor
2. Abra o arquivo `supabase/migrations/20260129_create_empresa_rpc.sql`
3. **Copie TODO o conteúdo**
4. Cole no SQL Editor
5. Clique em **Run**

**⏱️ Tempo estimado**: 1-2 segundos

**✅ Sucesso**: Função `criar_empresa_e_configuracoes_iniciais` criada

---

### Opção 2: Via Supabase CLI (Se tiver CLI instalado)

```bash
# Navegar até a pasta do projeto
cd c:\hq\uniq_uat4

# Aplicar migrations
supabase db push
```

---

## 🧪 Como Testar

### Teste 1: Verificar se as tabelas existem

No SQL Editor, execute:

```sql
select table_name 
from information_schema.tables 
where table_schema = 'public' 
and table_name like 'me_%';
```

**Resultado esperado**:
```
me_empresa
me_usuario
me_empresa_endereco
```

---

### Teste 2: Verificar se a função RPC existe

No SQL Editor, execute:

```sql
select routine_name 
from information_schema.routines 
where routine_schema = 'public' 
and routine_name = 'criar_empresa_e_configuracoes_iniciais';
```

**Resultado esperado**: 1 linha com o nome da função

---

### Teste 3: Testar cadastro de usuário

1. Abra a aplicação em: `http://localhost:5173` (ou sua URL)
2. Clique em **"Criar agora"**
3. Preencha o formulário de cadastro:
   - **Passo 1**: Dados pessoais e senha
   - **Passo 2**: Dados da empresa
   - **Passo 3**: Módulos e confirmação
4. Clique em **"Criar conta"**

**✅ Sucesso esperado**:
- Mensagem "Conta criada com sucesso!"
- Redirecionamento para `/dashboard`
- Dados da empresa aparecem no dashboard

**❌ Se der erro**:
- Abra o console do navegador (F12)
- Copie a mensagem de erro
- Me envie para investigar

---

### Teste 4: Verificar dados no banco

Após criar conta, verifique no SQL Editor:

```sql
-- Ver empresas criadas
select * from me_empresa order by created_at desc limit 5;

-- Ver usuários criados
select * from me_usuario order by created_at desc limit 5;

-- Ver endereços
select * from me_empresa_endereco order by created_at desc limit 5;
```

---

## 🔍 Troubleshooting

### Erro: "relation me_empresa already exists"

**Causa**: Tabela já existe no banco

**Solução**: Não é um problema! O SQL usa `if not exists`, pode ignorar

---

### Erro: "permission denied for schema public"

**Causa**: Usuário sem permissões adequadas

**Solução**: Você está logado como owner do projeto? Verifique se está usando a conta correta

---

### Erro: "function criar_empresa_e_configuracoes_iniciais already exists"

**Causa**: Função já foi criada antes

**Solução**: O SQL já tem `drop function if exists`, então é só rodar de novo que ele recria

---

### Erro ao criar conta: "Slug já está em uso"

**Causa**: Nome da empresa gera slug duplicado

**Solução**: 
- O sistema adiciona número aleatório ao slug
- Se persistir, tente outro nome de empresa
- OU ajuste a função de geração de slug no `Onboarding.tsx`

---

## 📊 O que cada migration faz?

### Schema Migration (`20260129_create_empresa_schema.sql`)

| Feature | O que faz |
|---------|-----------|
| **Tabelas** | Cria `me_empresa`, `me_usuario`, `me_empresa_endereco` |
| **Índices** | Acelera buscas por slug, CNPJ, email |
| **RLS** | Garante que usuários só vejam dados das suas empresas |
| **Triggers** | Atualiza `updated_at` automaticamente |
| **Permissões** | Permite leitura pública para storefront |

### RPC Migration (`20260129_create_empresa_rpc.sql`)

| Feature | O que faz |
|---------|-----------|
| **RPC Principal** | Cria empresa + usuário em transação atômica |
| **Validações** | Verifica dados obrigatórios e unicidade |
| **Segurança** | Executa com `security definer` (bypass RLS temporário) |
| **Helpers** | Funções auxiliares para slug e empresa_id |

---

## ✅ Checklist de Validação

Após aplicar as migrations:

- [ ] Tabelas criadas no Supabase
- [ ] Função RPC existe e está ativa
- [ ] Políticas RLS configuradas
- [ ] Cadastro de novo usuário funciona
- [ ] Dados aparecem no banco após cadastro
- [ ] Login com conta nova funciona
- [ ] Dashboard carrega dados da empresa

---

## 🆘 Precisa de ajuda?

Se algo der errado:

1. **Tire um print** da mensagem de erro
2. **Copie o erro** do console (F12)
3. **Me envie** que vou te ajudar a resolver

---

## 🎯 Próximos Passos

Depois que o cadastro estiver funcionando:

1. ✅ Testar com os 4 clientes
2. ✅ Coletar feedback inicial
3. ✅ Partir para próximas features (CRM, Loja Virtual)

---

**Data de criação**: 29/01/2026  
**Última atualização**: 29/01/2026
