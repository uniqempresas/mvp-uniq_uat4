# 🟢 Tracking de Desenvolvimento - UNIQ

**Última atualização:** 13/02/2026
**Sprint Atual:** [Sprint 04](plans/Sprint_04.md) (Configuração da Loja / Vitrine)
**Status:** 🏃 Em Execução

> 📁 **Arquivos de Sprints Anteriores:**
> - [Sprint 03](plans/Sprint_03.md) (Concluído)
>
> 📋 **Backlog Geral:**
> - [Backlog do Projeto](TRACKING_Backlog.md)

---

## 🎯 Sprint 04 - Configuração da Loja (Vitrine)

**Status:** 🏃 Em Execução
**Foco:** Implementação do módulo de Configuração da Loja, permitir ativação de módulos e correção de acesso.

**Objetivo:** Permitir que o usuário configure sua loja virtual (slug, contatos, produtos visíveis) e acesse a vitrine pública.

### ✅ Concluído
- [x] Criação da tabela/coluna `store_config` no banco de dados.
- [x] Implementação do `storeService.ts` (backend).
- [x] Criação das telas de Configuração (`GeneralTab`, `ProductsTab`).
- [x] Integração com Menu Lateral e Rotas (`App.tsx`).
- [x] Correção crítica de Login (Loop Infinito e Timeout).
- [x] Correção de Schema do Banco (`me_modulo_ativo`).

### 🚧 Em Andamento / A Fazer
- [ ] Validar ativação do módulo "Loja Virtual" (usuário relatou problema).
- [ ] Verificar Permissões (RLS) definitivas (atualmente desativadas para MVP).
- [ ] Implementar Upload de Imagens (Logo/Banner) com Supabase Storage.

> [Ver Planejamento Detalhado](plans/Sprint_04.md)

---

## 📝 Próximos Passos (Amanhã)
1.  Investigar por que a ativação do módulo pode estar falhando visualmente (embora backend pareça ok).
2.  Testar fluxo completo de ponta a ponta (Ativar Módulo -> Configurar Loja -> Ver Loja Pública).
3.  Reativar RLS progressivamente se possível, ou manter desativado conforme acordado para MVP.
