# SPEC Técnica Enriquecida - Sprint 06: Storefront 2.0 & Personalização

Esta especificação provê o roteiro técnico detalhado para a implementação das funcionalidades da Sprint 06, com foco em flexibilidade visual e autonomia para o parceiro.

---

## 1. Banco de Dados & Esquema de Dados (Supabase)

Não serão necessários novos comandos DDL de criação de tabelas, pois utilizaremos a infraestrutura de `JSONB` já existente na tabela `me_empresa`.

### 1.1 Campo `me_empresa.store_config`
O objeto `store_config` será enriquecido com a seguinte estrutura de layout e temas:

```json
{
  "appearance": {
    "theme": {
      "primary_color": "#10b77f",
      "secondary_color": "#244E5F",
      "font_family": "Plus Jakarta Sans",
      "border_radius": "1rem"
    },
    "hero": {
      "type": "carousel",
      "autoplay": true,
      "interval": 5000,
      "banners": [
        {
          "id": "uuid",
          "desktop_url": "https://...",
          "mobile_url": "https://...",
          "title": "...",
          "subtitle": "...",
          "link_type": "product | category | external",
          "link_value": "id | url",
          "button_text": "Comprar Agora"
        }
      ]
    },
    "home_layout": [
      { "id": "hero", "active": true, "order": 1 },
      { "id": "categories_circle", "active": true, "order": 2 },
      { "id": "flash_deals", "active": true, "order": 3 },
      { "id": "featured_products", "active": true, "order": 4 },
      { "id": "all_products", "active": true, "order": 5 },
      { "id": "newsletter", "active": true, "order": 6 }
    ]
  },
  "whatsapp": {
    "custom_message": "Olá! Gostaria de saber mais sobre o produto [NOME].",
    "include_link": true,
    "include_price": true
  }
}
```

### 1.2 Regras de Substituição (WhatsApp Pro Max)
O sistema deve suportar as seguintes tags dinâmicas no `custom_message`:
- `[NOME]`: Nome do produto.
- `[PRECO]`: Preço formatado.
- `[LINK]`: URL da página do produto.
- `[SAUDACAO]`: "Bom dia/tarde/noite" baseado no horário.

---

## 2. Arquivos Afetados e Novas Implementações

### 2.1 Estilização (Theming)
- **[MODIFY]** [tailwind.config.js](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tailwind.config.js):
    - Alterar as chaves de cores `primary` e `secondary` para utilizar `var(--primary-color)` e `var(--secondary-color)`.
- **[MODIFY]** [src/index.css](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/index.css):
    - Definir os valores default no `:root`.

### 2.2 Core da Loja (Storefront)
- **[MODIFY]** [src/pages/Public/Storefront.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/Storefront.tsx):
    - Implementar `ThemedContainer`: Um wrapper que injeta os `inline-styles` das variáveis CSS baseadas no `store_config`.
    - Lógica de renderização condicional por ordem: `layout.home_layout.map(block => renderBlock(block))`.
- **[MODIFY]** [src/services/publicService.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/services/publicService.ts):
    - Atualizar `getCompanyBySlug` para garantir que `store_config` seja retornado completo.
    - Criar método `getHierarchicalCategories` que retorna categorias com suas subcategorias aninhadas.

### 2.3 Navegação e Menus (Sidebar)
Para que a experiência de gestão seja completa, o menu lateral deve refletir as novas capacidades de personalização.

- **[MODIFY]** [src/config/submenus.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/config/submenus.ts):
    - Atualizar o objeto `storefront` para incluir:
        ```typescript
        storefront: {
            title: 'Loja Virtual',
            subtitle: 'Gestão de E-commerce',
            items: [
                { icon: 'visibility', label: 'Ver Loja', view: 'preview', href: '/loja/[slug]' },
                { icon: 'palette', label: 'Aparência', view: 'appearance' },
                { icon: 'view_carousel', label: 'Banners & Hero', view: 'banners' },
                { type: 'divider' },
                { icon: 'category', label: 'Categorias (Menu)', view: 'categories' },
                { icon: 'local_shipping', label: 'Entregas/Frete', view: 'shipping' },
            ],
        }
        ```
- **[MODIFY]** [src/config/menu.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/config/menu.ts):
    - Vincular o módulo `storefront` ao contexto de submenu correto.

### 2.4 Componentes de Interface
- **[MODIFY]** [src/pages/Public/components/HeroSection.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/HeroSection.tsx):
    - Integrar `Swiper` e `SwiperSlide`.
    - Suporte a `Source` de imagem para Mobile (`<picture>` tag).
- **[MODIFY]** [src/pages/Public/components/StoreHeader.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/StoreHeader.tsx):
    - Implementar a navegação em pirâmide (Categoria -> Subcategoria).
- **[NEW]** `src/pages/Public/components/FlashDeals.tsx`:
    - Grid de produtos com cronômetro (Framer Motion).

### 2.4 Dashboard (Gestão)
- **[NEW]** `src/pages/Dashboard/StoreConfig/AppearanceTab.tsx`:
    - Sub-aba para gerenciar o visual.
- **[NEW]** `src/pages/Dashboard/StoreConfig/components/BannerManager.tsx`:
    - Interface CRUD para os banners (Upload para storage `uniq_me_produtos`).
- **[MODIFY]** [src/components/Sidebar/MainSidebar.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/components/Sidebar/MainSidebar.tsx):
    - Garantir que a ativação do módulo abra diretamente a configuração.

---

## 3. Fluxos Técnicos Detalhados

### 3.1 Fluxo de Injeção de Tema
1.  O `Storefront.tsx` busca dados da empresa.
2.  Extrai `store_config.appearance.theme`.
3.  Aplica no elemento raiz da página:
    ```tsx
    <div style={{
      '--primary-color': theme.primary_color,
      '--secondary-color': theme.secondary_color
    } as React.CSSProperties}>
    ```

### 3.2 Fluxo de Upload de Banners
1.  Usuário seleciona imagem no Dashboard.
2.  `storeService.uploadStoreAsset` é chamado.
3.  O arquivo é salvo em `store-assets/{empresa_id}/{uuid}.ext`.
4.  A URL pública é salva na lista de banners do JSONB.

### 3.3 Fluxo de Navegação e Filtros
1.  O `StoreHeader` carrega a hierarquia.
2.  Ao clicar em uma Categoria, o `Storefront` filtra os produtos e o `Breadcrumbs` atualiza para `Home > Categoria`.
3.  Se houver subcategorias, o `CategoryChips` exibe as opções de refino.
4.  A URL deve ser amigável: `/loja/[slug]?cat=[id]&sub=[id]`.

---

## 4. Plano de Verificação (QA)

- **Sanidade**: O fallback de cores deve ser o verde padrão do UNIQ caso o JSONB esteja vazio.
- **Performance**: Monitorar o bundle size após adicionar Swiper e verificar o LCP (Largest Contentful Paint) com os banners.
- **Persistência**: Garantir que o `merge` do JSONB não apague configurações operacionais ao salvar mudanças visuais.
