# Plano de Implementação - Sprint 02: Encerramento Mobile & Módulos

Este plano detalha a execução da Sprint 02, objetivando a unificação da navegação (Mobile/Web), implementação do sistema de ativação de módulos e garantia de qualidade mobile.

> **Baseado na SPEC:** [SPEC.md](file:///c:/hq/uat4/work/SPEC.md)

## Revisão do Usuário Necessária
> [!IMPORTANT]
> Verifique se os nomes dos ícones utilizados em `src/config/menu.ts` correspondem aos disponíveis na biblioteca de ícones do projeto (Lucide/Phosphor/Material).
> A migration cria a tabela `me_modulo_ativo`. Confirme se o usuário do banco tem permissão para criar tabelas e policies.

## Mudanças Propostas

### Navegação (Core)
Centralização da configuração de menu para garantir consistência entre Sidebar (Desktop) e Drawer (Mobile).

#### [NEW] [menu.ts](file:///c:/hq/uat4/src/config/menu.ts)
- Criar configuração unificada de itens de menu.
- Definir tipos `MenuItem` e `SubMenuItem`.
- Exportar constante `MAIN_NAV_ITEMS`.

#### [MODIFY] [MainSidebar.tsx](file:///c:/hq/uat4/src/components/Sidebar/MainSidebar.tsx)
- Substituir lista hardcoded por `MAIN_NAV_ITEMS`.

#### [MODIFY] [MobileDrawer.tsx](file:///c:/hq/uat4/src/components/Mobile/MobileDrawer.tsx)
- Substituir lista hardcoded por `MAIN_NAV_ITEMS`.
- Implementar filtragem de itens baseada em `moduleCode` e estado do `ModuleContext`.

---

### Backend & Serviços
Persistência da ativação de módulos.

#### [NEW] [20260212_create_modules_table.sql](file:///c:/hq/uat4/supabase/migrations/20260212_create_modules_table.sql)
- Criar tabela `me_modulo_ativo`.
- Configurar RLS (Row Level Security).

#### [MODIFY] [moduleService.ts](file:///c:/hq/uat4/src/services/moduleService.ts)
- Implementar métodos reais de `getActiveModules` e `toggleModule` conectados ao Supabase.

#### [MODIFY] [ModuleContext.tsx](file:///c:/hq/uat4/src/contexts/ModuleContext.tsx)
- Integrar com `moduleService`.
- Gerenciar estado de loading e erro.

---

### Frontend (Gestão de Módulos)
Interface para o usuário ativar/desativar módulos.

#### [NEW] [ModuleCard.tsx](file:///c:/hq/uat4/src/components/Cards/ModuleCard.tsx)
- Componente de card com Toggle Switch.

#### [NEW] [Modules/index.tsx](file:///c:/hq/uat4/src/pages/Modules/index.tsx)
- Página de listagem de módulos.
- Consumir `ModuleContext` para estado atual.

#### [MODIFY] [routes.tsx](file:///c:/hq/uat4/src/routes.tsx)
- Adicionar rota `/modules`.
- Implementar proteção de rotas (se necessário/solicitado na SPEC).

## Plano de Verificação

### Testes Manuais
1.  **Menu Unificado:**
    - Abrir Sidebar (Desktop) e Drawer (Mobile).
    - Verificar se os itens são idênticos.
2.  **Toggle de Módulo:**
    - Acessar `/modules`.
    - Desativar o módulo "CRM".
    - Verificar se o ícone "CRM" desaparece da Sidebar imediatamente.
    - Verificar se o ícone "CRM" desaparece do Drawer (Mobile).
    - Tentar navegar para `/crm` (deve ser bloqueado ou exibir 404/Empty).
3.  **Persistência:**
    - Recarregar a página (F5).
    - Verificar se o módulo "CRM" permanece desativado.
4.  **Ativação:**
    - Ativar "CRM" novamente.
    - Verificar se o ícone reaparece.
