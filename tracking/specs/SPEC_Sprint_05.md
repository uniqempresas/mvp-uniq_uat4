# SPEC - Sprint 05: Loja de Módulos & Configurações

> Baseado em: `tracking/research/Sprint_05_Research.md`
> Metodologia: Vibe Coding (SDD)

---

## 🎯 Objetivo
Habilitar a seleção contextual de módulos (Meus Módulos / Novos / Em Desenvolvimento) e permitir a configuração completa da Loja Virtual (Slug, Bio, Produtos). Garantir que o Onboarding flua corretamente até o Dashboard.

---

## 📂 Arquivos a Criar
*Nenhum arquivo novo identificado nesta sprint. Foco em refatoração e ajustes.*

---

## 📂 Arquivos a Modificar

### 1. `src/pages/Dashboard/components/ModuleStore.tsx`
**Objetivo:** Alterar a visualização de abas por **Categoria** para abas por **Contexto**.

**Alterações Detalhadas:**
1.  **Remover** a lógica atual de filtro por categorias (`Sales`, `Finance`, etc.).
2.  **Implementar** 3 novas abas fixas:
    *   **"Meus Módulos"**: Exibe apenas módulos onde `is_active === true` (ou equivalente na lógica atual de `myModules`).
    *   **"Disponíveis"**: Exibe todos os módulos onde `is_active === false` (excluindo os que já tenho).
    *   **"Em Breve"**: Exibe módulos mockados ou com flag `status === 'dev'` (se houver suporte no backend), ou por enquanto deixar hardcoded/vazio com mensagem de "Novidades em breve".
3.  **Manter** o card do módulo com botão de "Ativar" / "Configurar".

**Pseudocódigo / Lógica:**
```typescript
const tabs = [
  { id: 'my_modules', label: 'Meus Módulos' },
  { id: 'available', label: 'Disponíveis' },
  { id: 'coming_soon', label: 'Em Breve' }
];

const filteredModules = useMemo(() => {
  switch (activeTab) {
    case 'my_modules': return modules.filter(m => m.isActive);
    case 'available': return modules.filter(m => !m.isActive && m.status !== 'dev');
    case 'coming_soon': return modules.filter(m => m.status === 'dev');
    default: return [];
  }
}, [activeTab, modules]);
```

---

### 2. `src/services/modulesService.ts`
**Objetivo:** Garantir que o retorno dos módulos inclua o status correto para a categorização.

**Alterações Detalhadas:**
1.  Verificar na função `fetchModules` (ou equivalente) se o objeto retornado possui propriedade `status` ou `flags`.
2.  Se não possuir, adicionar um mock ou mapeamento no frontend para identificar módulos "Em Breve" (ex: ID específico ou flag manual temporária).

---

### 3. `src/pages/Dashboard/StoreConfig/GeneralTab.tsx`
**Objetivo:** Persistência robusta das configurações da loja.

**Alterações Detalhadas:**
1.  **Validação de Slug:** Adicionar validação no `react-hook-form` (com zod) para garantir que o slug:
    *   Não tenha espaços (apenas hífens).
    *   Seja único (validar com check assíncrono no `storeService` se possível, ou tratar erro de constraint do banco).
2.  **Mapeamento de Dados:** Garantir que `whatsapp`, `bio`, `name` e `slug` estejam sendo enviados corretamente para a tabela `unq_lojas` (ou `store_config`).

---

### 4. `src/pages/Dashboard/StoreConfig/ProductsTab.tsx`
**Objetivo:** Seleção de produtos visíveis na loja.

**Alterações Detalhadas:**
1.  Garantir que a lista de produtos (`StoreProductList`) permita selecionar quais produtos aparecem no catálogo público.
2.  Salvar essa preferência (provavelmente uma tabela associativa `unq_loja_produtos` ou flag `is_public` no produto).
3.  *Nota:* Se a funcionalidade já existe, apenas validar se o switch "Mostrar na Loja" está persistindo o estado.

---

### 5. `src/pages/Public/Storefront.tsx` (Verificação)
**Objetivo:** Refletir as configurações salvas.

**Alterações Detalhadas:**
1.  Buscar dados da loja pelo `slug` da URL.
2.  Exibir `nome`, `bio`, `whatsapp` configurados em `GeneralTab`.
3.  Listar apenas produtos marcados como visíveis.

---

## 🧪 Plano de Testes (Checklist)

### 1. Onboarding
- [ ] Criar nova conta (fluxo completo: Step 1 -> 2 -> 3).
- [ ] Ao finalizar, garantir redirecionamento para `/dashboard`.
- [ ] Verificar se `empresa_id` foi criado e vinculado ao usuário.

### 2. Module Store
- [ ] Acessar "Loja de Aplicativos".
- [ ] Aba **Meus Módulos**: Deve mostrar apenas módulos já ativos.
- [ ] Aba **Disponíveis**: Deve mostrar módulos não ativos.
- [ ] Aba **Em Breve**: Deve mostrar mensagem ou módulos de teste.
- [ ] Ativar um módulo em "Disponíveis" -> Ele deve mover para "Meus Módulos".

### 3. Configuração da Loja
- [ ] Alterar Slug da loja -> Salvar -> Tentar acessar URL antiga (deve falhar) e nova (deve funcionar).
- [ ] Alterar Bio/WhatsApp -> Salvar -> Verificar no Storefront público.
- [ ] Desmarcar produto na aba Produtos -> Verificar se sumiu do Storefront.
