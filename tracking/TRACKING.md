# 🟢 Tracking de Desenvolvimento - UNIQ

**Última atualização:** 15/02/2026
**Sprint Atual:** [Sprint 06] (Planejamento)
**Status:** 📋 Planejamento

> 📁 **Arquivos de Sprints Anteriores:**
> - [Sprint 05](tracking_arq/TRACKING_Sprint_05.md) (Concluído)
> - [Sprint 04](tracking_arq/TRACKING_Sprint_04.md) (Concluído)
> - [Sprint 03](tracking_arq/TRACKING_Sprint_03.md) (Concluído)
>
> 📋 **Backlog Geral:**
> - [Backlog do Projeto](TRACKING_Backlog.md)

---

## 🎯 Sprint 06 - Storefront 2.0 & Personalização

**Status:** � EM PROGRESSO
**Foco:** Sistema de temas, banners, navegação hierárquica e personalização da loja virtual
**Responsável:** AI Agent (Vibe Implementer)
**SPEC:** [SPEC_Sprint_06.md](specs/SPEC_Sprint_06.md)

### 🚧 Em Andamento

#### 🏍️ Estilização e Theming
- [x] Modificar `tailwind.config.js` para suportar variáveis CSS
- [x] Atualizar `src/index.css` com valores default no `:root`

#### 🏪 Core da Loja (Storefront)
- [x] Implementar `ThemedContainer` em `Storefront.tsx`
- [ ] Adicionar lógica de renderização condicional por ordem
- [x] Atualizar `publicService.ts` para retornar `store_config` completo
- [x] Criar método `getHierarchicalCategories`

#### 🧭 Navegação e Menus
- [ ] Atualizar `src/config/submenus.ts` com novo menu Storefront
- [ ] Modificar `src/config/menu.ts` para vincular módulo

#### 🧩 Componentes de Interface
- [ ] Modificar `HeroSection.tsx` para integrar Swiper
- [ ] Modificar `StoreHeader.tsx` para navegação hierárquica
- [ ] Criar novo componente `FlashDeals.tsx`

#### ⚙️ Dashboard de Gestão
- [ ] Criar `AppearanceTab.tsx` para gestão visual
- [ ] Criar `BannerManager.tsx` para CRUD de banners
- [ ] Modificar `MainSidebar.tsx` para ativação do módulo

#### 🛡️ Qualidade e Testes
- [x] Implementar testes E2E do fluxo de Onboarding (Nova Empresa)

---

## 🧪 Checklist de Validação (QA)
- [ ] Testar fallback de cores quando JSONB vazio
- [ ] Monitorar bundle size após adicionar Swiper
- [ ] Validar LCP (Largest Contentful Paint) com banners
- [ ] Garantir que merge do JSONB não apague configurações operacionais
