# SPEC - Módulo Vitrine (Configuração) - Sprint 04

## 1. Visão Geral
Implementação da interface administrativa para configuração da Loja Virtual (Vitrine) do parceiro. O objetivo é permitir que o usuário defina a aparência da sua loja (Slug, Logo, Banner) e selecione quais produtos devem ser exibidos publicamente.

## 2. Estrutura de Arquivos

### 2.1. Arquivos a Criar
| Arquivo | Descrição |
| :--- | :--- |
| `src/pages/Dashboard/StoreConfig/index.tsx` | Main Layout da página de configurações. |
| `src/pages/Dashboard/StoreConfig/GeneralTab.tsx` | Aba de configurações gerais (Slug, Identidade, Contato). |
| `src/pages/Dashboard/StoreConfig/ProductsTab.tsx` | Aba de seleção de produtos (Lista simplificada com Toggle). |
| `src/pages/Dashboard/StoreConfig/StoreProductList.tsx` | Componente de listagem específica para a Vitrine. |
| `src/services/storeService.ts` | Serviço para gerenciar dados da loja (`me_empresa` e `me_produto`). |

### 2.2. Arquivos a Modificar
| Arquivo | Alteração |
| :--- | :--- |
| `src/App.tsx` | Adicionar rota protegida `/dashboard/store-config`. |
| `src/components/Sidebar/MainSidebar.tsx` | Adicionar item de menu "Loja Virtual" ou "Vitrine". |
| `src/services/productService.ts` | Garantir suporte a atualização do campo `exibir_vitrine` (já existente). |

## 3. Detalhes de Implementação

### 3.1. Banco de Dados (Requisito)
Para armazenar configurações adicionais (Banner, Cor, Bio) sem criar novas tabelas complexas, utilizaremos uma coluna `store_config` (JSONB) na tabela `me_empresa`. 
**Recomendado:** Executar o seguinte SQL no Supabase para garantir suporte total:

```sql
ALTER TABLE me_empresa 
ADD COLUMN IF NOT EXISTS store_config JSONB DEFAULT '{}'::jsonb;
```

Estrutura do JSON `store_config`:
```typescript
interface StoreConfig {
  banner_url?: string;
  primary_color?: string;
  description?: string;
  whatsapp_contact?: string; // Se diferente do telefone principal
}
```
*Caso a coluna não exista, o sistema deve salvar apenas os dados mapeados para colunas existentes (slug, avatar_url) e ignorar o resto ou alertar o usuário.*

### 3.2. Serviço: `storeService.ts`
Deve implementar métodos para:
- `getStoreConfig()`: Busca dados de `me_empresa` (slug, avatar_url, store_config).
- `updateStoreConfig(data: Partial<StoreData>)`: Atualiza `me_empresa`.
- `checkSlugAvailability(slug: string)`: Verifica se o slug já está em uso (exceto pela própria empresa).
- `toggleProductVisibility(productId: number, isVisible: boolean)`: Atualiza `me_produto.exibir_vitrine`.

### 3.3. Página: `StoreConfig`
- Layout com Abas: "Geral" e "Produtos".
- **Header**: Título "Minha Loja" e Botão "Visualizar Loja" (Link externo para `/c/{slug}`).

#### Aba Geral (`GeneralTab.tsx`)
- **Slug**: Input com prefixo `uniq.app/c/`. 
  - Validação: Apenas letras minúsculas e hífens.
  - Check de disponibilidade ao sair do campo (onBlur).
- **Identidade Visual**:
  - Logo: Upload de imagem (Atualiza `me_empresa.avatar_url`).
  - Banner: Upload de imagem (Salvar em `store_config.banner_url`).
- **Informações**:
  - Nome da Loja (Editável, default = `nome_fantasia`).
  - Bio/Descrição (TextArea, `store_config.description`).
- **Contato**: WhatsApp (Input com máscara, `store_config.whatsapp_contact`).

#### Aba Produtos (`ProductsTab.tsx`)
- **Componente**: `StoreProductList`
- Tabela simplificada:
  - Colunas: Imagem (Thumbnail), Nome, Categoria, Preço, **Na Vitrine (Switch/Toggle)**.
- **Ações**: 
  - Toggle individual.
  - Filtro de busca por nome.

### 3.4. Componente Sidebar (`MainSidebar.tsx`)
- Adicionar novo item na navegação `MAIN_NAV_ITEMS` (ou manual se não usar config).
- **Condicional**: Exibir item apenas se `isModuleActive('vitrine')` for verdadeiro.
- Rota: `/dashboard/store-config`.

## 4. Fluxo de Usuário
1.  Usuário acessa `/dashboard/store-config`.
2.  Visualiza configurações atuais.
3.  Altera o Slug -> Sistema valida disponibilidade -> Usuário Salva.
4.  Usuário vai para aba "Produtos".
5.  Ativa "Exibir na Vitrine" para 5 produtos.
6.  Clica em "Visualizar Loja" e vê o resultado público.

## 5. Dependências e Tecnologias
- **Zod**: Validação de schema (especialmente slug).
- **React Hook Form**: Gerenciamento de formulário.
- **Supabase Storage**: Bucket `uniq_me_produtos` (ou novo `uniq_loja_assets` se possível, senão usar existente).
- **TailwindCSS**: Estilização seguindo padrão do Dashboard.
