# PRD - Sprint 06: Expansão Loja Virtual (Storefront 2.0)

Este documento consolida a pesquisa e os requisitos para a Sprint 06, focada na personalização da Loja Virtual e melhoria da experiência do usuário (UX/UI).

## 🎯 Objetivos da Sprint
1.  Implementar **Temas Dinâmicos** (cores customizáveis pelo parceiro).
2.  Criar **Gestão de Banners** (Carrossel Hero e Banners Promocionais).
3.  Implementar **Navegação Hierárquica** (Categorias e Subcategorias com Mega Menu).
4.  Melhorar a **Conversão** (Ofertas Relâmpago e Destaques).
5.  Corrigir a **Navegação do Dashboard** (Acesso rápido à configuração da loja).

---

## 📂 Arquivos Relevantes

### 🎨 Estilização e Temas
- [tailwind.config.js](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/tailwind.config.js): Necessário refatorar cores estáticas para variáveis CSS.
- [src/index.css](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/index.css): Local para definir os tokens padrão de variáveis CSS.

### 🌐 Storefront (Interface Pública)
- [src/pages/Public/Storefront.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/Storefront.tsx): Página principal que orquestra as seções.
- [src/pages/Public/components/HeroSection.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/HeroSection.tsx): Atualmente estático, será transformado em carrossel dinâmico.
- [src/pages/Public/components/CategoryChips.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/CategoryChips.tsx): Base para o novo sistema de navegação e filtros.
- [src/pages/Public/components/StoreHeader.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Public/components/StoreHeader.tsx): Local para implementação do Mega Menu.

### ⚙️ Dashboard e Configuração
- [src/pages/Dashboard/StoreConfig/components/StoreIdentitySection.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/pages/Dashboard/StoreConfig/components/StoreIdentitySection.tsx): Adicionar seletor de cores e gestão de identidade.
- [src/components/Sidebar/MainSidebar.tsx](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/components/Sidebar/MainSidebar.tsx): Ajustar navegação do menu "Loja Virtual".
- [src/config/menu.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/config/menu.ts): Atualizar rotas e ícones do menu lateral.

### 🛠️ Serviços e Mock Data
- [src/services/storeService.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/services/storeService.ts): Atualizar interfaces `StoreConfig` e lógica de persistência JSONB.
- [src/services/publicService.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/services/publicService.ts): Novos métodos para buscar banners e hierarquia de categorias.
- [src/services/categoryService.ts](file:///c:/Users/henri/.gemini/antigravity/playground/vector-perseverance/mvp-uniq_uat4/src/services/categoryService.ts): Lógica de subcategorias já existente mas subutilizada.

---

## 📝 Padrões de Código Identificados

### 1. Injeção de Cores Dinâmicas
Atualmente o projeto usa cores fixas no Tailwind. O padrão a ser seguido para temas dinâmicos é:
```css
/* No index.css */
:root {
  --primary-color: #10b77f;
}

/* No tailwind.config.js */
theme: {
  extend: {
    colors: {
      primary: 'var(--primary-color)',
    }
  }
}
```
A aplicação deve injetar o valor do banco via `style={{ '--primary-color': company.primary_color } as any}` no layout principal da loja.

### 2. Uso de Swiper para Carrosséis
O `swiper` já está instalado. Exemplo de pattern:
```tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Swiper orquestrado por config JSONB
```

### 3. Persistência de Configuração (JSONB)
O `storeService` já utiliza uma estratégia de merge para o campo `store_config`:
```typescript
const currentConfig = currentData?.store_config || {}
updates.store_config = { ...currentConfig, ...store_config }
```

---

## 📚 Documentação e Referências

- **Swiper.js React**: [https://swiperjs.com/react](https://swiperjs.com/react)
- **Framer Motion AnimatePresence**: Usado para transições suaves entre estados de layout.
- **Tailwind CSS CSS Variables**: [https://tailwindcss.com/docs/using-with-preprocessors#using-css-variables](https://tailwindcss.com/docs/using-with-preprocessors#using-css-variables)

---

## 🚀 Próximos Passos (Para a SPEC)
1.  Definir interface exata do `layout_config` dentro do JSONB.
2.  Mapear componentes de Dashboard para "Drag & Drop" ou ordenação de blocos (Home Manager).
3.  Detalhar o fluxo de upload de imagens (banners) para o `storage` do Supabase.
