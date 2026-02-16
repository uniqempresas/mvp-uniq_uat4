# Brainstorming Consolidado: Sprint 06 - Expansão Loja Virtual

## 🧐 Desafios Atuais
- O módulo Loja Virtual está "escondido" no dashboard (erros de menu).
- A interface pública (Storefront) é estática e não reflete a marca do parceiro.
- Falta de autonomia para o parceiro gerenciar promoções visuais.

## 💡 Ideias para Exploração (Consolidado)

### 1. Sistema de Temas Dinâmicos (Refatoração de Cores)
- **Descoberta:** As cores atuais no `tailwind.config.js` são hex estáticos.
- **Proposta:** 
    - Mudar `primary` para `var(--primary-color)`.
    - Injetar o valor do banco de dados via inline style no `root` ou `body`.
    - O Parceiro escolhe a cor em um seletor no Dashboard (Cor Primária e Secundária).

### 2. Identidade Visual & Gestão de Banners (Inspiração Magalu)
- **Hero Dinâmico:** Usar `swiper` para criar um carrossel de banners.
- **Upload Duplo:** Permitir subir imagens diferentes para Desktop e Mobile.
- **Banners de Promoção:** Criar interface no Dashboard para o parceiro subir banners que levam a produtos ou categorias específicas.
- **Bolhas de Categorias:** Ícones rápidos abaixo do Hero para facilitar a navegação mobile.

### 3. Escassez e Conversão (Inspiração Mercado Livre)
- **Ofertas Relâmpago:** Seção com cronômetro de contagem regressiva para produtos em promoção.
- **Destaque de Produtos:** O parceiro pode escolher quais produtos aparecem no topo da vitrine ("Mais Vendidos", "Novidades").

### 4. Gestão de Layout Modular
- **Proposta:** No Dashboard, o parceiro ativa/desativa e ordena os blocos da home da loja:
    - [ ] Carrossel Banner Principal
    - [ ] Ícones de Categoria
    - [ ] Vitrine de Ofertas (Cronômetro)
    - [ ] Grid de Todos os Produtos
    - [ ] Seção de Newsletter / Contato

### 5. Navegação Hierárquica (Categorias & Subcategorias)
- **Descoberta:** O banco já possui as tabelas `me_categoria` e `me_subcategoria`.
- **Proposta:**
    - **Mega Menu (Desktop):** Ao pairar sobre uma categoria no cabeçalho, exibir um painel com suas subcategorias.
    - **Filtros Laterais:** Permitir que o cliente refine a visualização por subcategoria dentro de uma categoria selecionada.
    - **Breadcrumbs:** Exibir o caminho (ex: Home > Eletrônicos > Smartphones) para facilitar a navegação.

### 6. Navegação e Checkout Inteligente
- **Recuperação de Menu:** Corrigir a Sidebar para que o item "Loja Virtual" abra contextos de: Visualização, Personalização e Banners.
- **WhatsApp Pro Max:** Permitir que o parceiro defina o texto inicial da mensagem de WhatsApp (ex: "Olá! Vi que o produto [NOME] está em promoção...").

## 🛠️ Infraestrutura Técnica (Readiness)
- [x] Swiper e Framer Motion já instalados para efeitos premium.
- [x] Estrutura de Categorias e Subcategorias pronta para uso.
- [x] Localizado `tailwind.config.js` e `index.css` para refatoração de variáveis.
- [x] Base de dados configurada para suportar `store_config` via JSONB.

## 🧪 Próximos Passos de Planejamento
- [ ] Desenhar o esquema do campo JSONB `layout_config`.
- [ ] Mapear as consultas no `publicService.ts` para trazer a hierarquia completa de categorias.
- [ ] Definir como será a interface do seletor de cores no Dashboard.
- [ ] Planejar o fluxo de upload de múltiplos banners.
