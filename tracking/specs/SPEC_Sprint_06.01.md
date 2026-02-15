# SPEC Técnica — Sprint 06.01: Gaps Pendentes do Storefront 2.0

> **Tipo:** Especificação Tática (Passo 2 do SDD / Vibe Coding)
> **Data:** 15/02/2026
> **Sprint Ref:** Sprint 06 – Storefront 2.0 & Personalização
> **PRD Origem:** [PRD_Sprint_06.01.md](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tracking/research/PRD_Sprint_06.01.md)
> **SPEC Pai:** [SPEC_Sprint_06.md](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tracking/specs/SPEC_Sprint_06.md)

---

## Visão Geral

Esta SPEC cobre **exclusivamente** os gaps (G1–G5) e testes pendentes (T1–T2) identificados no TRACKING da Sprint 06 que **não foram implementados**. A prioridade de implementação sugerida é:

| Prioridade | Item | Complexidade | Estimativa |
|------------|------|-------------|------------|
| 🟢 Alta    | G4 — Links Funcionais no Hero | Baixa | ~15 min |
| 🟢 Alta    | G5 — Link "Ver Loja" Dinâmico | Baixa | ~15 min |
| 🟡 Média   | G1 — Renderização Dinâmica da Home | Média | ~45 min |
| 🟡 Média   | G2 — WhatsApp "Pro Max" (Tags) | Média | ~45 min |
| 🟡 Média   | T2 — Deep Merge de JSONB | Baixa | ~20 min |
| 🔵 Baixa   | T1 — Validação Fallback de Cores | Baixa | ~10 min |
| 🔴 Alta    | G3 — Navegação Hierárquica (Mega Menu) | Alta | ~2h |

---

## Fora de Escopo (O que NÃO faremos)

- Criação de novas tabelas no banco de dados.
- Drag-and-drop de reordenação de blocos na UI de administração.
- UI de configuração do template WhatsApp no Dashboard (será um gap futuro).
- Criação de novas rotas.

---

## Fase 1 — Quick Wins (G4 + G5)

### G4 — Links Funcionais no Hero

**Objetivo:** Substituir os `console.log` TODO do `BannerSlide` por navegação real.

#### **[MODIFY]** [HeroSection.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/HeroSection.tsx)

**Estado atual (linhas 53–65):**
```typescript
const handleClick = () => {
    if (!banner.link_value) return

    if (banner.link_type === 'external') {
        window.open(banner.link_value, '_blank')
    } else if (banner.link_type === 'product') {
        // TODO: Navegar para página do produto
        console.log('Navigate to product:', banner.link_value)
    } else if (banner.link_type === 'category') {
        // TODO: Navegar para categoria
        console.log('Navigate to category:', banner.link_value)
    }
}
```

**O que fazer:**

1. **Adicionar 2 novas props ao `BannerSlide`:**
   - `slug: string` — slug da loja (repassado do `Storefront`)
   - `onSelectCategory?: (categoryId: string) => void` — callback para filtrar por categoria

2. **Implementar `handleClick` com `useNavigate`:**
   ```typescript
   import { useNavigate } from 'react-router-dom'

   // Dentro de BannerSlide:
   const navigate = useNavigate()

   const handleClick = () => {
       if (!banner.link_value) return

       if (banner.link_type === 'external') {
           window.open(banner.link_value, '_blank')
       } else if (banner.link_type === 'product') {
           navigate(`/c/${slug}/p/${banner.link_value}`)
       } else if (banner.link_type === 'category') {
           // Opção 1: Navegar via URL
           navigate(`/c/${slug}/cat/${banner.link_value}`)
           // Opção 2: Se preferir scroll na home, usar callback
           // onSelectCategory?.(banner.link_value)
       }
   }
   ```

3. **Atualizar a assinatura da interface `HeroSectionProps`:**
   ```typescript
   interface HeroSectionProps {
       banners?: Banner[]
       heroType?: 'carousel' | 'static'
       autoplay?: boolean
       interval?: number
       slug?: string                           // NOVO
       onSelectCategory?: (id: string) => void // NOVO
   }
   ```

4. **Repassar `slug` para `BannerSlide`** em ambos os usos:
   - Linha 25: `<BannerSlide banner={banners[0]} slug={slug} />`
   - Linha 43: `<BannerSlide banner={banner} slug={slug} />`

#### **[MODIFY]** [Storefront.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/Storefront.tsx)

**O que fazer (linhas 108–113):**

Adicionar prop `slug` na chamada do `HeroSection`:
```tsx
<HeroSection
    banners={company?.store_config?.appearance?.hero?.banners}
    heroType={company?.store_config?.appearance?.hero?.type}
    autoplay={company?.store_config?.appearance?.hero?.autoplay}
    interval={company?.store_config?.appearance?.hero?.interval}
    slug={slug}                              // NOVO
    onSelectCategory={setActiveCategory}     // NOVO
/>
```

---

### G5 — Link "Ver Loja" Dinâmico

**Objetivo:** O item "Ver Loja" no submenu do Storefront deve abrir a loja pública em nova aba.

#### **[MODIFY]** [submenus.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/config/submenus.ts)

**Estado atual (linha 48):**
```typescript
{ icon: 'visibility', label: 'Ver Loja', view: 'preview', href: '#' },
```

**O que fazer:**

Substituir `href: '#'` por um **placeholder de template** que será resolvido em runtime:
```typescript
{ icon: 'visibility', label: 'Ver Loja', view: 'preview', href: '/c/:slug', target: '_blank' },
```

> **Nota:** Adicionar `target?: string` à interface `MenuItem` para suportar abertura em nova aba.

**Atualizar `MenuItem` interface (linhas 8–19):**
```typescript
export interface MenuItem {
    icon?: string;
    label?: string;
    active?: boolean;
    href?: string;
    type?: 'divider';
    badge?: string;
    children?: MenuItem[];
    id?: string;
    view?: string;
    disabled?: boolean;
    target?: string;    // NOVO: '_blank' para abrir em nova aba
}
```

#### **[MODIFY]** [SubSidebar.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/components/Sidebar/SubSidebar.tsx)

**O que fazer:**

1. **Obter o slug da empresa logada.** Importar e usar o serviço adequado (ex: `storeService.getStoreConfig()` ou buscar do contexto/hook existente). O mais simples é usar `useEffect` para buscar o slug uma vez:

   ```typescript
   import { storeService } from '../../services/storeService'
   // ...
   const [companySlug, setCompanySlug] = useState<string>('')

   useEffect(() => {
       storeService.getStoreConfig().then(config => {
           if (config?.slug) setCompanySlug(config.slug)
       })
   }, [])
   ```

2. **Resolver o template `/c/:slug`** antes de renderizar:
   ```typescript
   const resolveHref = (href: string | undefined) => {
       if (!href) return '#'
       return href.replace(':slug', companySlug || '')
   }
   ```

3. **Na função `handleClick`**, verificar se o item tem `target: '_blank'`:
   ```typescript
   const handleClick = (e: React.MouseEvent, item: MenuItem) => {
       if (item.disabled) {
           e.preventDefault()
           e.stopPropagation()
           return
       }
       // NOVO: Se tem href com template e target _blank, abrir em nova aba
       if (item.target === '_blank' && item.href) {
           e.preventDefault()
           const resolved = resolveHref(item.href)
           if (resolved !== '#') window.open(resolved, '_blank')
           return
       }
       // ... restante da lógica existente
   }
   ```

---

## Fase 2 — Renderização Dinâmica e WhatsApp (G1 + G2)

### G1 — Renderização Dinâmica da Home

**Objetivo:** A home do Storefront deve renderizar blocos (Hero, Categories, FlashDeals, Products, Newsletter) com base no array `store_config.appearance.home_layout`, respeitando `active` e `order`.

#### **[MODIFY]** [Storefront.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/Storefront.tsx)

**Estado atual:**
Todos os blocos são renderizados estaticamente no JSX (linhas 96–168), sem leitura de `home_layout`.

**O que fazer:**

1. **Definir a constante `DEFAULT_LAYOUT`** (fora do componente, antes de `export default`):
   ```typescript
   import type { LayoutBlock } from '../../services/publicService'

   const DEFAULT_LAYOUT: LayoutBlock[] = [
       { id: 'hero', active: true, order: 1 },
       { id: 'categories_circle', active: true, order: 2 },
       { id: 'flash_deals', active: true, order: 3 },
       { id: 'featured_products', active: true, order: 4 },
       { id: 'all_products', active: true, order: 5 },
       { id: 'newsletter', active: true, order: 6 },
   ]
   ```

2. **Criar a função `renderBlock`** dentro do componente `Storefront`:
   ```typescript
   const renderBlock = (blockId: string): React.ReactNode => {
       // Blocos que só aparecem na home (sem filtro ativo e sem busca)
       const isHome = !activeCategory && !searchTerm

       switch (blockId) {
           case 'hero':
               return isHome ? (
                   <HeroSection
                       key="hero"
                       banners={company?.store_config?.appearance?.hero?.banners}
                       heroType={company?.store_config?.appearance?.hero?.type}
                       autoplay={company?.store_config?.appearance?.hero?.autoplay}
                       interval={company?.store_config?.appearance?.hero?.interval}
                       slug={slug}
                       onSelectCategory={setActiveCategory}
                   />
               ) : null

           case 'categories_circle':
               return categories.length > 0 ? (
                   <div key="categories" className="px-4 md:px-0 mb-6">
                       <CategoryChips
                           categories={categories}
                           activeCategory={activeCategory}
                           onSelectCategory={setActiveCategory}
                       />
                   </div>
               ) : null

           case 'flash_deals':
               return isHome ? (
                   <FlashDeals
                       key="flash_deals"
                       products={products}
                       companyPhone={company!.telefone}
                   />
               ) : null

           case 'featured_products':
               return (
                   <div key="featured_products">
                       {/* Section Header */}
                       <div className="px-4 md:px-0 flex items-center justify-between mb-8 mt-8">
                           <div>
                               <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                   {activeCategory
                                       ? categories.find(c => c.id === activeCategory)?.nome_categoria
                                       : 'Ofertas em Destaque'
                                   }
                               </h3>
                               {!activeCategory && (
                                   <p className="text-gray-500 dark:text-gray-400 font-medium">
                                       Preços imbatíveis por tempo limitado
                                   </p>
                               )}
                           </div>
                           {!activeCategory && (
                               <button className="text-primary font-bold flex items-center gap-1 hover:underline">
                                   Ver todas <span className="material-symbols-outlined text-sm">arrow_forward</span>
                               </button>
                           )}
                       </div>
                   </div>
               )

           case 'all_products':
               return (
                   <div key="all_products" className="px-4 md:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                       {filteredProducts.map(product => (
                           <ProductCard
                               key={product.id}
                               product={product}
                               companyPhone={company!.telefone}
                           />
                       ))}
                       {filteredProducts.length === 0 && (
                           <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-20">
                               <span className="material-symbols-outlined text-6xl text-gray-300 block mb-4">search_off</span>
                               <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum produto encontrado.</p>
                           </div>
                       )}
                   </div>
               )

           case 'newsletter':
               return isHome ? (
                   <React.Fragment key="newsletter">
                       <PromoBanner />
                       <NewsletterSection />
                   </React.Fragment>
               ) : null

           default:
               return null
       }
   }
   ```

3. **Substituir todo o JSX estático** (linhas 95–168) pelo render dinâmico:
   ```tsx
   {/* === RENDER DINÂMICO BASEADO EM home_layout === */}
   {(() => {
       const layout = company?.store_config?.appearance?.home_layout
       const activeBlocks = layout
           ?.filter(b => b.active)
           ?.sort((a, b) => a.order - b.order) || DEFAULT_LAYOUT

       return activeBlocks.map(block => renderBlock(block.id))
   })()}
   ```

4. **Adicionar import do React** (se não existir):
   ```typescript
   import React, { useState, useEffect } from 'react'
   ```

#### Observações Importantes

- O `CategoryChips` pode ser tratado tanto como bloco no layout (`categories_circle`) quanto como elemento fixo sempre visível. A decisão padrão sugerida é como bloco.
- O bloco `featured_products` contém o section header + título. O bloco `all_products` contém o grid de produtos. Podem ser tratados como blocos independentes ou fundidos em um só (decisão de implementação).
- Se `home_layout` for `undefined` (empresa não configurou), o `DEFAULT_LAYOUT` garante exatamente o comportamento atual.

---

### G2 — WhatsApp "Pro Max" (Tags Dinâmicas)

**Objetivo:** Permitir ao parceiro customizar a mensagem do WhatsApp usando tags dinâmicas (`[NOME]`, `[PRECO]`, `[LINK]`, `[SAUDACAO]`).

#### **[MODIFY]** [publicService.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/services/publicService.ts)

**O que fazer:** Adicionar a função utilitária `buildWhatsAppMessage` **após** o objeto `publicService`:

```typescript
/**
 * Constrói mensagem de WhatsApp a partir do template customizado do parceiro.
 * Se não houver template, retorna mensagem padrão.
 */
export function buildWhatsAppMessage(
    template: string | undefined,
    context: {
        productName?: string
        price?: number
        productUrl?: string
        variation?: string
    }
): string {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

    if (!template) {
        // Fallback: mensagem padrão
        const varText = context.variation ? ` - ${context.variation}` : ''
        const priceText = context.price
            ? `\nR$ ${context.price.toFixed(2).replace('.', ',')}`
            : ''
        return `${greeting}! Gostaria de pedir:\n\n*${context.productName || 'produto'}${varText}*${priceText}`
    }

    // Substituir tags dinâmicas
    return template
        .replace(/\[NOME\]/g, context.productName || '')
        .replace(/\[PRECO\]/g, context.price
            ? `R$ ${context.price.toFixed(2).replace('.', ',')}`
            : '')
        .replace(/\[LINK\]/g, context.productUrl || '')
        .replace(/\[SAUDACAO\]/g, greeting)
}
```

> **Decisão:** A função é exportada como standalone (não como método do `publicService`) para evitar dependência circular e facilitar testes.

---

#### **[MODIFY]** [ProductDetail.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/ProductDetail.tsx)

**Estado atual (linhas 50–57):**
```typescript
const handleWhatsApp = () => {
    if (!product || !company?.telefone) return

    const variacaoText = selectedVariation ? ` - ${selectedVariation.nome_variacao}` : ''
    const preco = selectedVariation?.preco_varejo || selectedVariation?.preco || product.preco_varejo || product.preco
    const text = `Olá! Gostaria de pedir:\n\n*${product.nome_produto}${variacaoText}*\nR$ ${preco.toFixed(2).replace('.', ',')}`

    window.open(publicService.getWhatsAppLink(company.telefone, text), '_blank')
}
```

**O que fazer:**

1. **Importar** `buildWhatsAppMessage` no topo:
   ```typescript
   import { publicService, type PublicProduct, type PublicCompany, buildWhatsAppMessage } from '../../services/publicService'
   ```

2. **Substituir** a função `handleWhatsApp`:
   ```typescript
   const handleWhatsApp = () => {
       if (!product || !company?.telefone) return

       const preco = selectedVariation?.preco_varejo || selectedVariation?.preco || product.preco_varejo || product.preco
       const whatsappConfig = company.store_config?.whatsapp
       const productUrl = `${window.location.origin}/c/${slug}/p/${product.id}`

       const text = buildWhatsAppMessage(
           whatsappConfig?.custom_message,
           {
               productName: product.nome_produto,
               price: whatsappConfig?.include_price !== false ? preco : undefined,
               productUrl: whatsappConfig?.include_link !== false ? productUrl : undefined,
               variation: selectedVariation?.nome_variacao,
           }
       )

       window.open(publicService.getWhatsAppLink(company.telefone, text), '_blank')
   }
   ```

> **Lógica:** Se `include_price` é `false`, omitimos o preço. Se `include_link` é `false`, omitimos o link. O default é incluir ambos (`!== false` permite `undefined` como "incluir").

---

#### **[MODIFY]** [CartDrawer.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/components/Storefront/CartDrawer.tsx)

**Estado atual (linhas 16–32):** Mensagem completamente hardcoded.

**O que fazer:**

1. **Adicionar prop `storeConfig`** à interface:
   ```typescript
   import type { StoreConfig } from '../../services/publicService'

   interface CartDrawerProps {
       isOpen: boolean
       onClose: () => void
       companyPhone?: string
       companyName?: string
       storeConfig?: StoreConfig  // NOVO
   }
   ```

2. **Refatorar `handleCheckout`** para usar `[SAUDACAO]` como prefixo do carrinho:
   ```typescript
   const handleCheckout = () => {
       if (!companyPhone || items.length === 0) return

       const hour = new Date().getHours()
       const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

       let message = `${greeting}! 🛒 *Novo Pedido - ${companyName || 'Loja'}*\n\n`
       message += `*Itens:*\n`

       items.forEach((item, index) => {
           const variacaoTexto = item.variacao ? ` - ${item.variacao.nome_variacao}` : ''
           const preco = item.variacao?.preco_varejo || item.variacao?.preco || item.produto.preco_varejo || item.produto.preco
           message += `${index + 1}. ${item.quantidade}x ${item.produto.nome_produto}${variacaoTexto} (R$ ${preco.toFixed(2).replace('.', ',')})\n`
       })

       message += `\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}`

       window.open(publicService.getWhatsAppLink(companyPhone, message), '_blank')

       setIsCheckingOut(true)
       setTimeout(() => {
           clearCart()
           setIsCheckingOut(false)
           onClose()
       }, 500)
   }
   ```

   > **Nota:** Para o carrinho (múltiplos itens), o template `custom_message` com tags `[NOME]`/`[PRECO]` não se aplica bem. A melhoria aqui é apenas adicionar o `[SAUDACAO]` dinâmico como prefixo. O template completo é para produto individual.

3. **No `Storefront.tsx`**, passar a nova prop ao `CartDrawer`:
   ```tsx
   <CartDrawer
       isOpen={isCartOpen}
       onClose={() => setIsCartOpen(false)}
       companyPhone={company.telefone}
       companyName={company.nome_fantasia}
       storeConfig={company.store_config}   // NOVO
   />
   ```

---

#### **[MODIFY]** [CartContext.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/contexts/CartContext.tsx)

**Estado atual (linhas 124–141):** `getCartMessage` gera texto fixo.

**O que fazer:**

Adaptar `getCartMessage` para incluir saudação dinâmica:
```typescript
const getCartMessage = useCallback(() => {
    if (items.length === 0) return ''

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

    let text = `${greeting}! *🛒 Novo Pedido*\n\n`

    items.forEach((item) => {
        const variacaoDecl = item.variacao ? ` [${item.variacao.nome_variacao}]` : ''
        const precoUnitario = item.variacao?.preco_varejo || item.variacao?.preco || item.produto.preco_varejo || item.produto.preco
        const totalItem = precoUnitario * item.quantidade

        text += `${item.quantidade}x *${item.produto.nome_produto}*${variacaoDecl}\n`
        text += `   R$ ${totalItem.toFixed(2).replace('.', ',')}\n`
    })

    text += `\n*💰 Total: R$ ${total.toFixed(2).replace('.', ',')}*`

    return text
}, [items, total])
```

---

## Fase 3 — Navegação Hierárquica (G3)

### G3 — Mega Menu com Categorias e Subcategorias

**Objetivo:** Adicionar uma barra de navegação com categorias no `StoreHeader`, exibindo subcategorias em dropdown ao hover (desktop) ou click (mobile).

> ⚠️ **Complexidade Alta.** Este é o gap mais complexo e pode ser dividido em sub-tarefas.

#### **[MODIFY]** [publicService.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/services/publicService.ts)

**O que fazer:**

1. **Criar e exportar a interface `HierarchicalCategory`** (após a interface `Category`, linha 61):
   ```typescript
   export interface HierarchicalCategory extends Category {
       subcategories: Category[]
   }
   ```

2. **Atualizar o tipo de retorno** de `getHierarchicalCategories`:
   ```typescript
   async getHierarchicalCategories(empresaId: string): Promise<HierarchicalCategory[]> {
   ```

3. **Ajustar o corpo** para que `rootCategories` use o tipo correto:
   ```typescript
   const rootCategories: HierarchicalCategory[] = []
   ```

---

#### **[MODIFY]** [Storefront.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/Storefront.tsx)

**O que fazer:**

1. **Importar** `HierarchicalCategory`:
   ```typescript
   import { publicService, type PublicCompany, type PublicProduct, type Category, type HierarchicalCategory } from '../../services/publicService'
   ```

2. **Adicionar novo estado** para categorias hierárquicas:
   ```typescript
   const [hierarchicalCategories, setHierarchicalCategories] = useState<HierarchicalCategory[]>([])
   ```

3. **No `loadData`**, chamar `getHierarchicalCategories` em paralelo:
   ```typescript
   const [productsData, categoriesData, hierarchicalData] = await Promise.all([
       publicService.getPublicProducts(companyData.id),
       publicService.getCategories(companyData.id),
       publicService.getHierarchicalCategories(companyData.id)
   ])
   setProducts(productsData)
   setCategories(categoriesData)
   setHierarchicalCategories(hierarchicalData)
   ```

4. **Passar** as categorias hierárquicas ao `StoreLayout` (que contém o `StoreHeader`):
   ```tsx
   <StoreLayout
       companyName={company.nome_fantasia}
       onCartClick={() => setIsCartOpen(true)}
       searchTerm={searchTerm}
       onSearchChange={setSearchTerm}
       categories={hierarchicalCategories}         // NOVO
       onSelectCategory={setActiveCategory}         // NOVO
   >
   ```

> **Nota:** Se o `StoreLayout` é um wrapper que renderiza o `StoreHeader`, as props precisam ser propagadas. Caso contrário, passar diretamente ao `StoreHeader`.

---

#### **[MODIFY]** [StoreHeader.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/StoreHeader.tsx)

**Estado atual:** 85 linhas, sem nenhuma menção a categorias.

**O que fazer:**

1. **Atualizar `StoreHeaderProps`:**
   ```typescript
   import type { HierarchicalCategory } from '../../../services/publicService'

   interface StoreHeaderProps {
       companyName: string
       onCartClick: () => void
       searchTerm?: string
       onSearchChange?: (term: string) => void
       categories?: HierarchicalCategory[]          // NOVO
       onSelectCategory?: (categoryId: string) => void  // NOVO
   }
   ```

2. **Adicionar estado para mega menu:**
   ```typescript
   const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
   ```

3. **Renderizar barra de categorias** abaixo do header existente (logo + search + actions):
   ```tsx
   {/* Categories Navigation Bar */}
   {categories && categories.length > 0 && (
       <nav className="hidden md:block border-t border-gray-100 dark:border-gray-800">
           <div className="max-w-[1280px] mx-auto px-6">
               <ul className="flex items-center gap-1 h-12">
                   {categories.map(cat => (
                       <li
                           key={cat.id}
                           className="relative group"
                           onMouseEnter={() => setHoveredCategory(cat.id)}
                           onMouseLeave={() => setHoveredCategory(null)}
                       >
                           <button
                               onClick={() => onSelectCategory?.(cat.id)}
                               className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
                           >
                               {cat.nome_categoria}
                               {cat.subcategories.length > 0 && (
                                   <span className="material-symbols-outlined text-xs text-gray-400">
                                       expand_more
                                   </span>
                               )}
                           </button>

                           {/* Dropdown de subcategorias */}
                           {cat.subcategories.length > 0 && hoveredCategory === cat.id && (
                               <div className="absolute top-full left-0 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 min-w-[220px] z-50 animate-fade-in">
                                   <ul className="space-y-1">
                                       {cat.subcategories.map(sub => (
                                           <li key={sub.id}>
                                               <button
                                                   onClick={() => {
                                                       onSelectCategory?.(sub.id)
                                                       setHoveredCategory(null)
                                                   }}
                                                   className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                               >
                                                   {sub.nome_categoria}
                                               </button>
                                           </li>
                                       ))}
                                   </ul>
                               </div>
                           )}
                       </li>
                   ))}
               </ul>
           </div>
       </nav>
   )}
   ```

4. **Para mobile**: Adicionar um botão hamburger que abre um drawer/bottom sheet com as categorias. Pode ser simplificado como um menu lateral:
   ```tsx
   {/* Mobile Category Menu Trigger (em tela md:hidden) */}
   <button
       onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
       className="md:hidden p-2 hover:bg-gray-100 rounded-full"
   >
       <span className="material-symbols-outlined">menu</span>
   </button>
   ```

   > A implementação do drawer mobile pode seguir o pattern do `CartDrawer.tsx` (overlay + bottom sheet) ou ser um menu lateral simples.

---

## Fase 4 — Robustez e Testes (T1 + T2)

### T2 — Deep Merge de JSONB

**Objetivo:** Evitar que salvar `appearance.theme` apague `appearance.hero` e `appearance.home_layout`.

#### **[MODIFY]** [storeService.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/services/storeService.ts)

**Estado atual (linhas 76–79):**
```typescript
if (store_config) {
    const currentConfig = currentData?.store_config || {}
    updates.store_config = { ...currentConfig, ...store_config }
}
```

**O que fazer — Implementar deep merge para sub-objetos conhecidos:**

```typescript
if (store_config) {
    const currentConfig = currentData?.store_config || {}

    // Deep merge: para cada chave do novo store_config,
    // se ambos (antigo e novo) são objetos, fazer merge interno
    const mergedConfig = { ...currentConfig }

    for (const [key, value] of Object.entries(store_config)) {
        if (
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            typeof mergedConfig[key] === 'object' &&
            mergedConfig[key] !== null &&
            !Array.isArray(mergedConfig[key])
        ) {
            // Merge de segundo nível (ex: appearance.theme + appearance.hero)
            mergedConfig[key] = { ...mergedConfig[key], ...value }
        } else {
            // Substituição direta (arrays, primitivos, ou novo campo)
            mergedConfig[key] = value
        }
    }

    updates.store_config = mergedConfig
}

if (appearance) {
    const currentAppearance = currentData?.appearance || {}

    // Aplicar mesma lógica de deep merge
    const mergedAppearance = { ...currentAppearance }

    for (const [key, value] of Object.entries(appearance)) {
        if (
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            typeof mergedAppearance[key] === 'object' &&
            mergedAppearance[key] !== null &&
            !Array.isArray(mergedAppearance[key])
        ) {
            mergedAppearance[key] = { ...mergedAppearance[key], ...value }
        } else {
            mergedAppearance[key] = value
        }
    }

    updates.appearance = mergedAppearance
}
```

> **Nota:** O merge é feito em **2 níveis** (nível 1 do `store_config` + nível 2 dos sub-objetos). Arrays (como `home_layout`) são **substituídos** integralmente, não fundidos, pois a reordenação exige o array completo.

---

### T1 — Validação: Fallback de Cores

**Objetivo:** Garantir que as variáveis CSS de fallback estejam definidas no `:root`.

#### **[VERIFICAR]** [index.css](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/index.css)

**Estado atual (linhas 6–12):**
```css
:root {
  --primary-color: #10b77f;
  --primary-hover-color: #0a8a5f;
  --secondary-color: #244E5F;
  --border-radius: 1rem;
  --font-family: 'Plus Jakarta Sans', 'Poppins', sans-serif;
}
```

✅ **Resultado:** O `index.css` **já define** os fallbacks no `:root`. O risco mencionado no PRD (adicionar var vazia) **não se aplica** ao estado atual. Nenhuma modificação é necessária.

**Cenários de validação (teste manual):**

| # | Cenário | Resultado Esperado |
|---|---------|-------------------|
| 1 | Empresa sem `store_config` | Verde `#10b77f` (fallback do `:root`) |
| 2 | Empresa com `store_config: {}` | Verde `#10b77f` (fallback do `:root`) |
| 3 | Empresa com `theme.primary_color: '#FF0000'` | Vermelho `#FF0000` |
| 4 | Empresa com `theme: {}` (sem primary_color) | Verde `#10b77f` (fallback do `:root`) |

---

## 📂 Resumo Completo de Alterações

| Arquivo | Fase | Gap | Tipo | Ação |
|---------|------|-----|------|------|
| [HeroSection.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/HeroSection.tsx) | 1 | G4 | MODIFY | Implementar navegação real nos botões de banner |
| [submenus.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/config/submenus.ts) | 1 | G5 | MODIFY | Adicionar template `/c/:slug` e prop `target` |
| [SubSidebar.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/components/Sidebar/SubSidebar.tsx) | 1 | G5 | MODIFY | Resolver slug dinâmico e abrir em nova aba |
| [Storefront.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/Storefront.tsx) | 1+2+3 | G1,G3,G4 | MODIFY | Render dinâmico + props de Hero + categorias hierárquicas |
| [publicService.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/services/publicService.ts) | 2+3 | G2,G3 | MODIFY | `buildWhatsAppMessage` + `HierarchicalCategory` interface |
| [ProductDetail.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/ProductDetail.tsx) | 2 | G2 | MODIFY | Usar `buildWhatsAppMessage` com template do parceiro |
| [CartDrawer.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/components/Storefront/CartDrawer.tsx) | 2 | G2 | MODIFY | Adicionar saudação dinâmica + prop `storeConfig` |
| [CartContext.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/contexts/CartContext.tsx) | 2 | G2 | MODIFY | Saudação dinâmica no `getCartMessage` |
| [StoreHeader.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/StoreHeader.tsx) | 3 | G3 | MODIFY | Mega menu com dropdown de subcategorias |
| [storeService.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/services/storeService.ts) | 4 | T2 | MODIFY | Deep merge de JSONB em 2 níveis |
| [index.css](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/index.css) | 4 | T1 | VERIFICAR | ✅ Já correto, sem alterações necessárias |

---

## Plano de Verificação (QA)

### Verificação Automatizada
- [ ] `npm run build` — compilação sem erros de TypeScript
- [ ] `npm run lint` — sem warnings/erros novos

### Verificação Manual — Por Fase

#### Fase 1 (G4 + G5)
- [ ] **G4:** Clicar em banner com `link_type: 'product'` → navega para `/c/{slug}/p/{id}`
- [ ] **G4:** Clicar em banner com `link_type: 'category'` → navega para `/c/{slug}/cat/{id}`
- [ ] **G4:** Clicar em banner com `link_type: 'external'` → abre em nova aba (já funciona)
- [ ] **G5:** Clicar em "Ver Loja" no submenu → abre loja pública em nova aba

#### Fase 2 (G1 + G2)
- [ ] **G1:** Empresa sem `home_layout` → renderiza na ordem padrão (hero → categories → flash_deals → products → newsletter)
- [ ] **G1:** Empresa com `home_layout` onde `flash_deals.active: false` → FlashDeals não aparece
- [ ] **G1:** Empresa com blocos reordenados → blocos respeitam a nova ordem
- [ ] **G2:** Produto com template customizado `"[SAUDACAO]! Quero o [NOME] de [PRECO]."` → gera mensagem correta
- [ ] **G2:** Produto sem template → usa mensagem padrão (fallback)
- [ ] **G2:** Carrinho → prefixo com saudação dinâmica ("Bom dia/Boa tarde/Boa noite")
- [ ] **G2:** `include_price: false` → mensagem sem preço
- [ ] **G2:** `include_link: false` → mensagem sem link

#### Fase 3 (G3)
- [ ] **G3:** Categorias aparecem na barra do header (desktop)
- [ ] **G3:** Hover em categoria com subcategorias → dropdown aparece
- [ ] **G3:** Click em subcategoria → filtra produtos
- [ ] **G3:** Mobile → menu de categorias acessível

#### Fase 4 (T1 + T2)
- [ ] **T1:** Cenários 1-4 da tabela de validação de cores passam
- [ ] **T2:** Salvar `appearance.theme` não apaga `appearance.hero`
- [ ] **T2:** Salvar `appearance.theme` não apaga `appearance.home_layout`
- [ ] **T2:** Salvar `whatsapp` não afeta `appearance`

---

## Referências

- [SPEC_Sprint_06.md](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tracking/specs/SPEC_Sprint_06.md) — SPEC pai
- [PRD_Sprint_06.01.md](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tracking/research/PRD_Sprint_06.01.md) — Pesquisa de origem
- [TRACKING.md](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tracking/TRACKING.md) — Progress tracker
