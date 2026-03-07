# Git Hooks

Este diretório contém hooks do Git para automação e segurança.

## 🔧 Instalação

```bash
# Copiar o hook pre-commit para o .git/hooks/
cp .git-hooks/pre-commit .git/hooks/pre-commit

# Dar permissão de execução
chmod +x .git/hooks/pre-commit
```

## 📝 Hooks Disponíveis

### pre-commit

**Função:** Previne commit acidental de arquivos sensíveis

**Verificações:**
- ❌ Bloqueia commits de arquivos `.env`
- ⚠️ Alerta sobre possíveis secrets hardcoded no código

**Exemplo de saída (bloqueio):**
```
🔒 Running security checks...

❌ ERROR: Attempting to commit .env file(s)!

🚫 Blocked files:
   - .env

⚠️  Environment files contain secrets and should NEVER be committed.

✅ To fix:
   1. Remove from staging: git reset HEAD <file>
   2. Add to .gitignore: echo '<file>' >> .gitignore
   3. Commit only .gitignore
```

## 🚀 Configuração Automática

Para instalar automaticamente em novos clones, adicione ao `package.json`:

```json
{
  "scripts": {
    "prepare": "cp .git-hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit"
  }
}
```

## 🛠️ Desenvolvimento

Para testar um hook manualmente:

```bash
bash .git-hooks/pre-commit
```

Para bypassar o hook em caso de emergência:

```bash
git commit --no-verify -m "mensagem"
```

**⚠️ Atenção:** Só use `--no-verify` se souber exatamente o que está fazendo!

---

**Última atualização:** 2026-03-07
