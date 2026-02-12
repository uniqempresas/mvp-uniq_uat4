# PRD - Sprint 02: Encerramento Mobile & Módulos

## 📋 Contexto
Este documento consolida os passos finais para encerrar a Sprint 02.
Foco em:
1.  **Consistência Mobile-Web:** Resolver o desacoplamento do Menu Mobile (`MobileDrawer`).
2.  **Sistema de Módulos (TRACK-017):** Implementar ativação dinâmica de funcionalidades.
3.  **QA Mobile (TRACK-016):** Garantir qualidade em dispositivos reais.

## 🎯 Objetivos
- Unificar configuração de navegação (Arquivo único de menu).
- Implementar lógica de módulos (CRM, Estoque, etc.) com RLS e Contexto.
- Validar usabilidade mobile para encerrar a sprint.

## ⚠️ Problema Crítico Identificado
O menu Mobile (`MobileDrawer.tsx`) está **hardcoded** e não respeita o `ModuleContext`. Isso causa inconsistência com a Web, mostrando módulos não contratados.

---

## 🛠️ Especificação Técnica Detalhada

### 1. Sistema de Navegação Unificado (Core Fix)
**Novo Arquivo:** `src/config/menu.ts`
Deve exportar a configuração mestre de menus, usada tanto por `MainSidebar` quanto `MobileDrawer`.

```typescript
// src/config/menu.ts
export interface MenuItem {
    id: string;
    label: string;
    icon: string;
    route?: string;
    moduleCode?: 'crm' | 'finance' | 'inventory' | ...; // Chave para validar ativo
    submenu?: SubMenuItem[];
}

export const MAIN_NAV_ITEMS: MenuItem[] = [
    { id: 'dashboard', icon: 'fingerprint', label: 'Minha Empresa' },
    { id: 'crm', icon: 'groups', label: 'CRM', route: '/crm', moduleCode: 'crm' },
    // ... todos os outros
]
```

### 2. Refatoração de Componentes
*   **`MobileDrawer.tsx`:** Remover array `navItems` local. Importar `MAIN_NAV_ITEMS` e filtrar usando `useModules()`.
*   **`MainSidebar.tsx`:** Refatorar para usar `MAIN_NAV_ITEMS`.

### 3. Implementação de Módulos (TRACK-017)
Lógica para permitir que o dono ative/desative funcionalidades.

*   **Banco de Dados:**
    *   Tabela `me_modulo_ativo` (empresa_id, modulo_codigo, ativo, data_ativacao).
    *   RLS: Apenas `role='dono'` pode INSERT/UPDATE. Todos da empresa podem SELECT.

*   **Frontend Check:**
    *   `ModuleContext`: Carregar módulos ativos no login.
    *   `ProtectedRoute`: Impedir acesso a rotas de módulos desativados (ex: acessar `/crm` direto na URL).

*   **UI de Gestão:**
    *   Nova página `/modules` (já existente no menu, mas precisa de implementação).
    *   Grid de Cards com Toggle Switch para cada módulo.

### 4. QA Mobile & Device Testing (TRACK-016)
Checklist de validação final:
- [ ] Scroll suave em listas longas (Clientes/Produtos).
- [ ] Keyboard não quebra layout de formulários.
- [ ] Touch targets > 44px (botões fáceis de clicar).
- [ ] Menu fecha ao navegar.

---

## 📂 Plano de Execução (Arquivos a Criar/Editar)

### Fase 1: Core Navigation (Mobile Fix)
- [ ] `src/config/menu.ts` **(NEW)**
- [ ] `src/components/Mobile/MobileDrawer.tsx` **(MODIFY)**
- [ ] `src/components/Sidebar/MainSidebar.tsx` **(MODIFY)**

### Fase 2: Sistema de Módulos (Backend + Context)
- [ ] `supabase/migrations/YYYYMMDD_create_modules_table.sql` **(NEW)**
- [ ] `src/services/moduleService.ts` **(NEW)**
- [ ] `src/contexts/ModuleContext.tsx` **(MODIFY - Integração com DB)**

### Fase 3: UI de Módulos & Proteção
- [ ] `src/pages/Modules/index.tsx` **(NEW/MODIFY)**
- [ ] `src/components/Cards/ModuleCard.tsx` **(NEW)**
- [ ] `src/routes.tsx` **(MODIFY - Add ProtectedModules)**

---

## ✅ Critérios de Aceite Final (Sprint 02 Done)
1.  **Menu Sincronizado:** Alterar algo em `menu.ts` reflete em Web E Mobile.
2.  **Módulos Reais:** Desativar "CRM" no banco/página remove o ícone do menu (Web e Mobile) e bloqueia a rota.
3.  **Mobile Polido:** Navegação fluida, sem itens quebrados no drawer.
