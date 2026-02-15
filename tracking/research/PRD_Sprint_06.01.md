# PRD Sprint 06.01 — Gaps Pendentes da Sprint 06

> **Tipo:** Pesquisa & Contexto (Passo 1 do SDD / Vibe Coding)
> **Data:** 15/02/2026
> **Sprint Ref:** Sprint 06 – Storefront 2.0 & Personalização
> **Objetivo:** Documentar o estado atual de cada gap pendente, listar os arquivos afetados, trechos de código relevantes e patterns a serem seguidos para que a SPEC subsequente seja cirúrgica.

---

## 🎯 Escopo desta PRD

Esta PRD cobre **apenas os itens ainda não implementados** (gaps) identificados no TRACKING.md da Sprint 06:

| #  | Gap                                     | Tipo           |
|----|----------------------------------------|----------------|
| G1 | Renderização Dinâmica da Home          | Implementação  |
| G2 | WhatsApp "Pro Max" (Tags Dinâmicas)    | Implementação  |
| G3 | Navegação Hierárquica (Mega Menu)      | Implementação  |
| G4 | Links Funcionais no Hero               | Implementação  |
| G5 | Link "Ver Loja" Dinâmico               | Implementação  |
| T1 | Fallback de Cores (Teste)              | Testes/QA      |
| T2 | Merge Seguro de JSONB (Teste)          | Testes/QA      |

---

## G1 — Renderização Dinâmica da Home

### Problema
O `Storefront.tsx` renderiza os blocos (Hero, Categories, FlashDeals, Products, Newsletter) em **ordem fixa no JSX**. A SPEC define que o parceiro pode ativar/desativar e reordenar blocos via `store_config.appearance.home_layout`, mas essa lógica **nunca foi implementada**.

### Estado Atual do Código

**Arquivo:** [Storefront.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/Storefront.tsx)

A interface `LayoutBlock` já existe em `publicService.ts`:
```typescript
export interface LayoutBlock {
    id: string
    active: boolean
    order: number
}
```

O `store_config` já traz `home_layout` na interface `StoreConfig`:
```typescript
appearance?: {
    home_layout?: LayoutBlock[]
}
```

Porém, no JSX do `Storefront.tsx` (linhas 87-178), os blocos são renderizados diretamente, sem ler `home_layout`:
```tsx
{/* Hero Section */}
{!activeCategory && !searchTerm && (
    <HeroSection ... />
)}
{/* Flash Deals */}
{!activeCategory && !searchTerm && (
    <FlashDeals ... />
)}
// ... tudo estático
```

### Pattern a Seguir
Criar uma função `renderBlock(blockId: string)` que mapeia cada `id` de `LayoutBlock` ao componente React correspondente, e usar:
```tsx
const layout = company?.store_config?.appearance?.home_layout
const activeBlocks = layout
    ?.filter(b => b.active)
    ?.sort((a, b) => a.order - b.order) || DEFAULT_LAYOUT

activeBlocks.map(block => renderBlock(block.id))
```

### Arquivos Afetados
- `src/pages/Public/Storefront.tsx` — refatorar renderização do corpo da home

### Constante Fallback
Definir `DEFAULT_LAYOUT` com a ordem atual hardcoded para manter compatibilidade:
```typescript
const DEFAULT_LAYOUT: LayoutBlock[] = [
    { id: 'hero', active: true, order: 1 },
    { id: 'categories_circle', active: true, order: 2 },
    { id: 'flash_deals', active: true, order: 3 },
    { id: 'featured_products', active: true, order: 4 },
    { id: 'all_products', active: true, order: 5 },
    { id: 'newsletter', active: true, order: 6 },
]
```

---

## G2 — WhatsApp "Pro Max" (Tags Dinâmicas)

### Problema
A SPEC define que o parceiro pode customizar a mensagem do WhatsApp com tags dinâmicas (`[NOME]`, `[PRECO]`, `[LINK]`, `[SAUDACAO]`). Atualmente, as mensagens são **hardcoded** em 3 locais diferentes.

### Estado Atual do Código

**1. CartDrawer.tsx** (linhas 16-32) — Checkout do Carrinho:
```typescript
let message = `🛒 *Novo Pedido - ${companyName || 'Loja'}*\n\n`
message += `*Itens:*\n`
// ... monta texto fixo
```
> ❌ Não usa `store_config.whatsapp.custom_message`. Não usa tags dinâmicas.

**2. ProductDetail.tsx** (linhas 50-57) — Botão WhatsApp individual:
```typescript
const text = `Olá! Gostaria de pedir:\n\n*${product.nome_produto}${variacaoText}*\nR$ ${preco.toFixed(2)}`
```
> ❌ Mensagem fixa, sem templates do parceiro.

**3. CartContext.tsx** (linhas 124-141) — `getCartMessage`:
```typescript
let text = `*🛒 Novo Pedido*\n\n`
// ... monta texto fixo com itens do carrinho
```
> ❌ Mesmo padrão fixo.

### Interface Existente (publicService.ts)
```typescript
whatsapp?: {
    custom_message?: string   // Template com tags
    include_link?: boolean    // Se inclui link do produto
    include_price?: boolean   // Se inclui preço
}
```

### Tags a Implementar
| Tag          | Substituição                              | Contexto        |
|-------------|------------------------------------------|-----------------|
| `[NOME]`    | `product.nome_produto`                   | Produto único   |
| `[PRECO]`   | `R$ XX,XX` formatado                     | Produto único   |
| `[LINK]`    | URL completa do produto na loja          | Produto único   |
| `[SAUDACAO]`| "Bom dia" / "Boa tarde" / "Boa noite"   | Qualquer lugar  |

### Pattern a Implementar
Criar uma função utilitária (ex: em `publicService.ts` ou novo `whatsappHelper.ts`):
```typescript
function buildWhatsAppMessage(
    template: string | undefined,
    context: {
        productName?: string
        price?: number
        productUrl?: string
    }
): string {
    if (!template) {
        // Fallback para mensagem padrão
        return `Olá! Gostaria de saber mais sobre ${context.productName}.`
    }

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

    return template
        .replace(/\[NOME\]/g, context.productName || '')
        .replace(/\[PRECO\]/g, context.price ? `R$ ${context.price.toFixed(2).replace('.', ',')}` : '')
        .replace(/\[LINK\]/g, context.productUrl || '')
        .replace(/\[SAUDACAO\]/g, greeting)
}
```

### Arquivos Afetados
- `src/services/publicService.ts` — adicionar `buildWhatsAppMessage`
- `src/components/Storefront/CartDrawer.tsx` — usar template customizado
- `src/pages/Public/ProductDetail.tsx` — usar template customizado
- `src/contexts/CartContext.tsx` — adaptar `getCartMessage` para aceitar template

### Nota de Prioridade
Para o **carrinho** (múltiplos itens), as tags `[NOME]`, `[PRECO]` e `[LINK]` fazem menos sentido. Nesse caso, o template é mais útil para produtos individuais. O carrinho deve continuar com seu formato de lista, mas pode **prefixar** com `[SAUDACAO]`.

---

## G3 — Navegação Hierárquica (Mega Menu)

### Problema
O `StoreHeader.tsx` exibe apenas logo, barra de busca e ícones de ação (carrinho, favoritos, entrar). **Não há menu de categorias** nem mega menu com subcategorias, conforme planejado na SPEC.

### Estado Atual do Código

**Arquivo:** [StoreHeader.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/StoreHeader.tsx)

- O componente é simples (85 linhas), sem props de categorias
- A interface `StoreHeaderProps` não aceita categorias:
  ```typescript
  interface StoreHeaderProps {
      companyName: string
      onCartClick: () => void
      searchTerm?: string
      onSearchChange?: (term: string) => void
  }
  ```

**Método já existente:** O `publicService.getHierarchicalCategories` já retorna categorias com subcategorias aninhadas (linhas 142-183 de `publicService.ts`), mas o `Storefront.tsx` chama apenas `getCategories` (flat).

### Dados da Interface Category
A interface `Category` está simplificada:
```typescript
export interface Category {
    id: string
    nome_categoria: string
}
```

O `getHierarchicalCategories` retorna objetos com `subcategories: []`, mas o tipo `Category` **não reflete isso**. Será necessário enriquecer:
```typescript
export interface HierarchicalCategory extends Category {
    subcategories: Category[]
}
```

### Pattern a Implementar
No `StoreHeader`:
1. Receber `categories: HierarchicalCategory[]` via props
2. Renderizar uma barra de navegação abaixo do header com as categorias principais
3. Ao hover (desktop) ou click (mobile), expandir subcategorias em dropdown/mega menu
4. Ao clicar em categoria/subcategoria, disparar callback `onSelectCategory(id)`

### Arquivos Afetados
- `src/services/publicService.ts` — criar/exportar `HierarchicalCategory` interface
- `src/pages/Public/components/StoreHeader.tsx` — adicionar mega menu
- `src/pages/Public/Storefront.tsx` — passar categorias hierárquicas para o Header

---

## G4 — Links Funcionais no Hero

### Problema
Os botões dos banners no `HeroSection.tsx` têm TODOs para navegação a produtos e categorias.

### Estado Atual do Código

**Arquivo:** [HeroSection.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/HeroSection.tsx)

Função `handleClick` no `BannerSlide` (linhas 53-65):
```typescript
const handleClick = () => {
    if (!banner.link_value) return

    if (banner.link_type === 'external') {
        window.open(banner.link_value, '_blank')        // ✅ Funcional
    } else if (banner.link_type === 'product') {
        // TODO: Navegar para página do produto
        console.log('Navigate to product:', banner.link_value)  // ❌ TODO
    } else if (banner.link_type === 'category') {
        // TODO: Navegar para categoria
        console.log('Navigate to category:', banner.link_value) // ❌ TODO
    }
}
```

### Pattern a Seguir
O componente precisa de acesso ao `slug` da loja (via `useParams` ou prop) e ao `useNavigate`:
```typescript
// product → /c/{slug}/p/{productId}
navigate(`/c/${slug}/p/${banner.link_value}`)

// category → /c/{slug}/cat/{categoryId} ou setar activeCategory
navigate(`/c/${slug}/cat/${banner.link_value}`)
```

### Arquivos Afetados
- `src/pages/Public/components/HeroSection.tsx` — implementar navegação real
- Opcionalmente: passar `slug` via prop do `Storefront.tsx` ou usar `useParams`

---

## G5 — Link "Ver Loja" Dinâmico

### Problema
No `submenus.ts`, o item "Ver Loja" tem `href: '#'`, quando deveria levar à loja pública do parceiro.

### Estado Atual do Código

**Arquivo:** [submenus.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/config/submenus.ts)

```typescript
storefront: {
    items: [
        { icon: 'visibility', label: 'Ver Loja', view: 'preview', href: '#' },
        // ...
    ],
}
```

### Solução
O `href` deve apontar para `/c/{slug}`. Como o `slug` é dinâmico (depende da empresa logada), há duas abordagens:

**Opção A — Dinâmico no componente:** O `SubSidebar.tsx` (ou quem renderiza o submenu) busca o slug da empresa no contexto/serviço e substitui `#` por `/c/${slug}`.

**Opção B — Template no config:** Usar um placeholder no config:
```typescript
{ href: '/loja/:slug' }
```
E resolver no componente que renderiza.

### Arquivos Afetados
- `src/config/submenus.ts` — atualizar href ou adicionar template
- O componente que renderiza os submenus (SubSidebar ou equivalente) — resolver o slug dinâmico

---

## T1 — Teste: Fallback de Cores

### O que Testar
Quando `store_config.appearance.theme` está **vazio ou ausente**, a loja deve carregar o verde padrão (`#10b77f`).

### Estado Atual
- O `tailwind.config.js` já tem fallback inline:
  ```javascript
  "primary": "var(--primary-color, #10b77f)"
  ```
- O `index.css` **NÃO** define `--primary-color` no `:root`. Isso significa que o fallback funciona **somente** via a sintaxe do Tailwind `var(..., fallback)`.
- O `Storefront.tsx` (linhas 64-82) só define variáveis se `theme.primary_color` existir. Se `appearance.theme` for `undefined`, o `themeStyles` será um objeto vazio `{}`, e nenhuma CSS var será injetada — **o que faz o fallback do Tailwind funcionar corretamente**.

### Cenários de Teste
1. Empresa sem `store_config` → Deve renderizar com verde `#10b77f`
2. Empresa com `store_config: {}` → Deve renderizar com verde `#10b77f`
3. Empresa com `store_config.appearance.theme.primary_color: '#FF0000'` → Vermelho
4. Empresa com `store_config.appearance.theme: {}` → Verde fallback

### Risco Identificado
⚠️ Se alguém adicionar `--primary-color` vazio no `index.css` (ex: `--primary-color: ;`), o fallback do Tailwind **quebraria**. É recomendável definir explicitamente no `:root`:
```css
:root {
    --primary-color: #10b77f;
    --primary-hover-color: #0a8a5f;
    --secondary-color: #244E5F;
}
```

---

## T2 — Teste: Merge Seguro de JSONB

### O que Testar
Salvar configurações de aparência **não deve deletar** configurações de WhatsApp ou mensagens que vivem no mesmo campo `store_config`.

### Estado Atual
O `storeService.ts` (linhas 62-94) faz merge correto no **primeiro nível**:
```typescript
if (store_config) {
    const currentConfig = currentData?.store_config || {}
    updates.store_config = { ...currentConfig, ...store_config }
}
```

### Risco: Merge Raso (Shallow Merge)
O merge é **shallow** (nível 1 apenas). Se alguém salvar:
```typescript
await storeService.updateStoreConfig({
    store_config: {
        appearance: { theme: { primary_color: '#FF0000' } }
    }
})
```
Isso vai **sobrescrever** todo o objeto `appearance`, potencialmente apagando `appearance.hero` e `appearance.home_layout`.

### Cenários de Teste
1. Empresa com `store_config = { whatsapp: {...}, appearance: {...} }` → Salvar apenas `{ appearance: { theme: {...} } }` → WhatsApp deve permanecer intacto ✅ (funciona pois é merge no nível 1)
2. Empresa com `appearance = { theme: {...}, hero: {...}, home_layout: [...] }` → Salvar apenas `{ appearance: { theme: {...} } }` → `hero` e `home_layout` **serão apagados** ❌ (problema no merge shallow)

### Solução Recomendada
Implementar **deep merge** para pelo menos os objetos de segundo nível:
```typescript
if (store_config) {
    const currentConfig = currentData?.store_config || {}

    // Deep merge para sub-objetos conhecidos
    if (store_config.appearance && currentConfig.appearance) {
        store_config.appearance = {
            ...currentConfig.appearance,
            ...store_config.appearance
        }
    }

    updates.store_config = { ...currentConfig, ...store_config }
}
```

### Arquivos Afetados
- `src/services/storeService.ts` — melhorar lógica de merge

---

## 📂 Resumo de Arquivos Afetados

| Arquivo | Gaps |
|---------|------|
| `src/pages/Public/Storefront.tsx` | G1, G3 |
| `src/pages/Public/components/HeroSection.tsx` | G4 |
| `src/pages/Public/components/StoreHeader.tsx` | G3 |
| `src/pages/Public/ProductDetail.tsx` | G2 |
| `src/components/Storefront/CartDrawer.tsx` | G2 |
| `src/contexts/CartContext.tsx` | G2 |
| `src/services/publicService.ts` | G2, G3 |
| `src/services/storeService.ts` | T2 |
| `src/config/submenus.ts` | G5 |
| `src/index.css` | T1 |

---

## 📚 Referências

- [SPEC_Sprint_06.md](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tracking/specs/SPEC_Sprint_06.md) — Especificação original
- [PRD_Sprint_06.md](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tracking/research/PRD_Sprint_06.md) — PRD original
- [Brainstorm_Sprint_06.md](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tracking/research/Brainstorm_Sprint_06.md) — Ideas consolidadas
- [TRACKING.md](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tracking/TRACKING.md) — Status de progresso

---

## 🚀 Próximos Passos (Para a SPEC 06.01)

> 🧹 **NÃO** contém código final. Esta PRD é material de apoio para gerar a SPEC de implementação cirúrgica.

1. Gerar `SPEC_Sprint_06.01.md` com base nesta pesquisa
2. Priorizar: G4 e G5 (quick wins) > G1 e G2 (médio) > G3 (complexo)
3. T1 e T2 devem ser validados após implementação dos gaps
