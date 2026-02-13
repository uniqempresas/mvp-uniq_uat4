# Planejamento da Sprint 03: Onboarding e Recuperação de Senha

**Período:** 13/02/2026 - 13/02/2026
**Status:** ✅ Concluído

---

## 🎯 Objetivos
1. **Recuperação de Senha:** Permitir que usuários redefinam suas senhas via email.
2. **Correção do Onboarding:** Garantir que os módulos selecionados durante o cadastro sejam ativados corretamente.

## 📚 Documentos de Referência
- [PRD - Sprint 03](../../work/PRD-Sprint_03.md)
- [SPEC - Sprint 03](../../work/SPEC-Sprint_03.md)

---

## 📋 Backlog da Sprint

### 1. Autenticação (Recuperação de Senha)
- [x] Criar página `ForgotPassword.tsx`
- [x] Criar página `UpdatePassword.tsx`
- [x] Configurar rotas no `App.tsx`
- [x] Adicionar link "Esqueci minha senha" no Login

### 2. Onboarding
- [x] Implementar persistência de módulos selecionados no `Onboarding.tsx`

---

## 🛠️ Detalhes Técnicos
- **Stack:** React, Supabase Auth.
- **Segurança:** Uso de RLS e validação de email.
- **Serviços:** Atualizar `moduleService.ts` se necessário.
