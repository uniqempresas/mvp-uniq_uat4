# Security Policy

## 🔒 Reportando Vulnerabilidades

Se você encontrar uma vulnerabilidade de segurança, por favor:

1. **NÃO** crie uma issue pública
2. Envie um email para: [seu-email@exemplo.com]
3. Inclua detalhes sobre a vulnerabilidade e como reproduzi-la
4. Aguarde nossa resposta antes de divulgar publicamente

## 🛡️ Práticas de Segurança

### Variáveis de Ambiente

- **NUNCA** commite arquivos `.env` no Git
- Use `.env.example` como template
- Mantenha credenciais em variáveis de ambiente do host (Vercel, etc.)

### Credenciais Atuais (manter seguro!)

```bash
# Supabase
VITE_SUPABASE_URL=https://krrkfgvdwhpelxtrdtla.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_DB_PASSWORD=user01@HQ29lh19
```

**⚠️ IMPORTANTE:** Estas credenciais estão no histórico Git. 
**Ação necessária:** Rotacionar quando possível.

### Console Logs

- Remover console.logs antes de deploy em produção
- Usar ferramentas como `vite-plugin-remove-console` para build de produção

### Row Level Security (RLS)

- Sempre habilitar RLS em tabelas do Supabase
- Políticas devem ser específicas e restritivas
- Nunca usar `anon` key para acessos sensíveis

## 🚨 Checklist Pré-Deploy

- [ ] Nenhum arquivo `.env` no repositório
- [ ] Console.logs removidos ou filtrados
- [ ] RLS habilitado em todas as tabelas
- [ ] Credenciais rotacionadas (se expostas)
- [ ] Dependências atualizadas (`npm audit`)
- [ ] HTTPS forçado em produção

## 📋 Incidentes de Segurança

### 2026-03-07 - .env Exposto no Git
**Status:** Parcialmente mitigado  
**Ações tomadas:**
- ✅ Adicionado .env ao .gitignore
- ✅ Criado .env.example
- ✅ Documentado em SECURITY.md
- ⏳ Pendente: Rotacionar credenciais Supabase
- ⏳ Pendente: Limpar histórico Git (filter-branch)

**Próximos passos:**
1. Rotacionar `VITE_SUPABASE_KEY` no dashboard Supabase
2. Rotacionar `SUPABASE_DB_PASSWORD`
3. Executar `git filter-branch` para remover .env do histórico
4. Force push para reescrever história

## 🔧 Ferramentas Recomendadas

```bash
# Verificar vulnerabilidades em dependências
npm audit

# Verificar secrets no código
npx detect-secrets scan

# Verificar secrets no histórico Git
truffleHog git file://.
```

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Git Guardian - Git Security](https://www.gitguardian.com/)

---

**Última atualização:** 2026-03-07  
**Responsável:** Security Team
