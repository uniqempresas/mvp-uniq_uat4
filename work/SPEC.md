# SPEC - Sprint 02: Encerramento Mobile & Módulos

> **Referência:** [PRD-Sprint02.md](./PRD-Sprint02.md)

## 📂 Arquivos a Criar
- `src/config/menu.ts`
- `supabase/migrations/20260212_create_modules_table.sql` (Nome sugerido para manter ordem)
- `src/pages/Modules/index.tsx`
- `src/components/Cards/ModuleCard.tsx`

## 📂 Arquivos a Modificar
- `src/services/moduleService.ts`
- `src/contexts/ModuleContext.tsx`
- `src/components/Mobile/MobileDrawer.tsx`
- `src/components/Sidebar/MainSidebar.tsx`
- `src/routes.tsx`

---

## 🛠️ Detalhamento da Implementação

### 1. Banco de Dados & Serviços

#### [NEW] `supabase/migrations/20260212_create_modules_table.sql`
Criar tabela para persistência dos módulos ativos por empresa.

```sql
create table if not exists me_modulo_ativo (
  id uuid default uuid_generate_v4() primary key,
  empresa_id uuid not null references me_empresa(id),
  modulo_codigo text not null,
  ativo boolean default true,
  data_ativacao timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(empresa_id, modulo_codigo)
);

-- Policies (RLS)
alter table me_modulo_ativo enable row level security;

create policy "Empresas veem seus proprios modulos"
  on me_modulo_ativo for select
  using (empresa_id in (select empresa_id from me_usuario where email = auth.email()));

create policy "Apenas donos podem alterar modulos"
  on me_modulo_ativo for insert
  with check (
    empresa_id in (select empresa_id from me_usuario where email = auth.email())
    -- Idealmente validar role='dono' se houver campo na me_usuario, 
    -- caso contrário, permitir a usuario autenticado da empresa por enquanto.
  );

create policy "Apenas donos podem atualizar modulos"
  on me_modulo_ativo for update
  using (
    empresa_id in (select empresa_id from me_usuario where email = auth.email())
  );
```

#### [MODIFY] `src/services/moduleService.ts`
Atualizar interfaces e métodos para refletir a estrutura exata do banco e requisitos.

- **Interface `ModuleConfig`**: Adicionar `data_ativacao`.
- **Método `getActiveModules`**: Garantir query correta.
- **Método `toggleModule`**: Manter lógica de upsert.

### 2. Core Navigation (Unificação)

#### [NEW] `src/config/menu.ts`
Centralizar a configuração de itens de menu.

```typescript
export interface SubMenuItem {
    id: string;
    label: string;
    icon: string;
    view?: string; // Para navegação interna no dashboard (ex: tabs)
    route?: string; // Para navegação de rota completa
}

export interface MenuItem {
    id: string;
    label: string;
    icon: string;
    route?: string;
    moduleCode?: string; // Se definido, exibe apenas se o módulo estiver ativo
    submenu?: SubMenuItem[];
}

export const MAIN_NAV_ITEMS: MenuItem[] = [
    { 
        id: 'dashboard', 
        icon: 'fingerprint', 
        label: 'Minha Empresa', 
        route: '/dashboard',
        submenu: [
            { id: 'products', icon: 'package_2', label: 'Produtos', view: 'products' },
            { id: 'services', icon: 'handyman', label: 'Serviços', view: 'services' },
            { id: 'clients', icon: 'group', label: 'Clientes', view: 'clients' },
            { id: 'suppliers', icon: 'warehouse', label: 'Fornecedores', view: 'suppliers' },
            { id: 'collaborators', icon: 'badge', label: 'Colaboradores', view: 'collaborators' }
        ]
    },
    { id: 'crm', icon: 'groups', label: 'CRM', route: '/crm', moduleCode: 'crm' },
    { id: 'storefront', icon: 'storefront', label: 'Loja', moduleCode: 'storefront' },
    { id: 'finance', icon: 'attach_money', label: 'Financeiro', route: '/finance', moduleCode: 'finance' },
    { id: 'inventory', icon: 'inventory_2', label: 'Estoque', moduleCode: 'inventory' }, // Validar se 'inventory' é o código correto
    { id: 'team', icon: 'group', label: 'Equipe', moduleCode: 'team' },
    { id: 'reports', icon: 'bar_chart', label: 'Relatórios', moduleCode: 'reports' }
];
```

#### [MODIFY] `src/components/Sidebar/MainSidebar.tsx`
- Remover array `navItems` local.
- Importar `MAIN_NAV_ITEMS` de `../../config/menu`.
- Manter lógica de filtro usando `useModules`.

#### [MODIFY] `src/components/Mobile/MobileDrawer.tsx`
- Remover array `navItems` local.
- Importar `MAIN_NAV_ITEMS`.
- **Implementar filtragem:** Usar `useModules()` para esconder itens cujo `moduleCode` não esteja ativo. Atualmente ele mostra tudo hardcoded.

### 3. Gestão de Módulos (Frontend)

#### [MODIFY] `src/contexts/ModuleContext.tsx`
- `loadModules()`: Buscar do `moduleService` em vez de mock.
- `toggleModule()`: Chamar `moduleService.toggleModule` e atualizar estado local.
- Adicionar loading state inicial para evitar "flicker" de menus.

#### [NEW] `src/components/Cards/ModuleCard.tsx`
Componente visual para ativar/desativar módulo.
- Props: `title`, `description` (opcional), `icon`, `isActive`, `onToggle`, `isLoading`.
- UI: Card com ícone, texto e um Switch.

#### [NEW] `src/pages/Modules/index.tsx`
Página de listagem de módulos.
- Rota: `/modules`.
- Layout: Grid de `ModuleCard`.
- Lista fixa de módulos do sistema (definição hardcoded na página ou em config, cruzando com o status ativo do contexto).
- Exemplo de módulos disponíveis: CRM, Financeiro, Estoque, Loja, Equipe, Relatórios.

#### [MODIFY] `src/routes.tsx`
- Garantir que a rota `/modules` existe e aponta para o novo componente.
- Opcional: Criar Wrapper `ProtectedModuleRoute` se quisermos bloquear acesso via URL a módulos desativados (ex: user tenta acessar `/finance` mas módulo financeiro está off).

---

## ✅ Checklist de Validação
1.  **Mobile:** Abrir menu hamburger -> Verificar se itens batem com a Web.
2.  **Toggle:** Ir em `/modules`, desativar "CRM".
    - O ícone do CRM deve sumir do Sidebar (Web).
    - O ícone do CRM deve sumir do Drawer (Mobile).
    - Tentar acessar `/crm` deve redirecionar ou mostrar erro (se ProtectedRoute implementado).
3.  **Persistência:** Recarregar página (F5) -> Módulo continua desativado.
